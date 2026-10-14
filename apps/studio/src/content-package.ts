import { unzipSync } from 'fflate';
import { repairStructure } from './structural-repair';
import { bilingualIssues, contentSchema, ingredientDefinitions, resolveIngredient, type ContentInput } from '@random/shared';

const MB = 1024 * 1024;
const decoder = new TextDecoder('utf-8', { fatal: true });
const fail = (message: string): never => { throw new Error(message); };
const imagePattern = /^[a-zA-Z0-9_-]+\.(png|jpe?g|webp|avif)$/;

/** Inspect ZIP directory and local headers before allocating decompressed buffers. */
function inspect(bytes: Uint8Array): Map<string, number> {
  if (bytes.length > 25 * MB) fail('ZIP package exceeds 25 MB.');
  const v = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const u16 = (p: number) => v.getUint16(p, true);
  const u32 = (p: number) => v.getUint32(p, true);
  let end = -1;
  for (let p = bytes.length - 22; p >= Math.max(0, bytes.length - 65557); p--) {
    if (u32(p) === 0x06054b50 && p + 22 + u16(p + 20) === bytes.length) { end = p; break; }
  }
  if (end < 0) fail('Invalid ZIP directory.');
  const count = u16(end + 10), size = u32(end + 12), start = u32(end + 16);
  if (u16(end + 4) || u16(end + 6) || u16(end + 8) !== count || count < 2 || count > 5 || start + size !== end) fail('Unsupported ZIP directory or entry count.');
  const entries = new Map<string, number>();
  let p = start, total = 0;
  const ranges: Array<[number, number]> = [];
  for (let i = 0; i < count; i++) {
    if (p + 46 > end || u32(p) !== 0x02014b50) fail('Invalid ZIP entry.');
    const flags = u16(p + 8), method = u16(p + 10), packed = u32(p + 20), length = u32(p + 24);
    const nameLength = u16(p + 28), extra = u16(p + 30), comment = u16(p + 32), local = u32(p + 42);
    if (p + 46 + nameLength + extra + comment > end || !nameLength) fail('Invalid ZIP filename.');
    const name = decoder.decode(bytes.subarray(p + 46, p + 46 + nameLength));
    if (!/^[a-zA-Z0-9_.-]+$/.test(name) || name === '.' || name === '..') fail('ZIP files must have safe root filenames.');
    if (entries.has(name)) fail('Duplicate ZIP filename.');
    if (name !== 'content.json' && name !== 'manifest.json' && name !== 'readme.txt' && !imagePattern.test(name)) fail('Unexpected file in ZIP package.');
    if (flags & 0x41 || (method !== 0 && method !== 8) || u16(p + 34)) fail('Encrypted or unsupported ZIP entry.');
    const limit = imagePattern.test(name) ? 15 * MB : 128 * 1024;
    if (length > limit || length > Math.max(packed * 200, 1024 * 1024)) fail('ZIP entry size or compression ratio exceeds the limit.');
    total += length;
    if (total > 35 * MB) fail('ZIP contents exceed 35 MB.');
    if (local + 30 > start || u32(local) !== 0x04034b50 || u16(local + 6) !== flags || u16(local + 8) !== method) fail('Invalid ZIP local header.');
    const localNameLength = u16(local + 26), localExtra = u16(local + 28), data = local + 30 + localNameLength + localExtra;
    if (data + packed > start || decoder.decode(bytes.subarray(local + 30, local + 30 + localNameLength)) !== name) fail('ZIP local filename or size does not match.');
    if (!(flags & 8) && (u32(local + 18) !== packed || u32(local + 22) !== length)) fail('ZIP local sizes do not match.');
    if (ranges.some(([a, b]) => local < b && data + packed > a)) fail('Overlapping ZIP entries.');
    ranges.push([local, data + packed]);
    entries.set(name, length);
    p += 46 + nameLength + extra + comment;
  }
  if (p !== end || !entries.has('content.json')) fail('ZIP package must contain root content.json.');
  return entries;
}

function parseJson(bytes: Uint8Array, name: string, repair = false): Record<string, unknown> {
  let value: unknown;
  try {
    let text = decoder.decode(bytes);
    if (repair) {
      text = text.replace(/^\uFEFF/, '').trim();
      const fence = /^```(?:json)?\s*\n([\s\S]*?)\n```$/i.exec(text);
      if (fence) text = fence[1]!;
    }
    value = JSON.parse(text);
  } catch { return fail(`${name} must contain valid UTF-8 JSON.`); }
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${name} must contain a JSON object.`);
  return value as Record<string, unknown>;
}
function imageMime(name: string, b: Uint8Array): string {
  const ascii = (start: number, end: number) => String.fromCharCode(...b.subarray(start, end));
  if (name.endsWith('.png') && b.length >= 33 && [137,80,78,71,13,10,26,10].every((n,i)=>b[i]===n) && ascii(12,16)==='IHDR' && new DataView(b.buffer,b.byteOffset,b.byteLength).getUint32(8)===13) return 'image/png';
  if (/\.jpe?g$/.test(name) && b.length >= 4 && b[0]===255 && b[1]===216 && b[2]===255 && b[b.length-2]===255 && b[b.length-1]===217) return 'image/jpeg';
  if (name.endsWith('.webp') && b.length >= 20 && ascii(0,4)==='RIFF' && ascii(8,12)==='WEBP' && ['VP8 ','VP8L','VP8X'].includes(ascii(12,16)) && new DataView(b.buffer,b.byteOffset,b.byteLength).getUint32(4,true)+8===b.length) return 'image/webp';
  if (name.endsWith('.avif') && b.length >= 24 && ascii(4,8)==='ftyp') {
    const length = new DataView(b.buffer,b.byteOffset,b.byteLength).getUint32(0);
    if (length >= 24 && length <= b.length && length % 4===0 && (ascii(8,12)==='avif' || Array.from({length:(length-16)/4},(_,i)=>ascii(16+i*4,20+i*4)).includes('avif'))) return 'image/avif';
  }
  return fail('Image extension and binary format must match PNG, JPEG, WebP, or AVIF.');
}

export function readContentPackage(bytes: Uint8Array, options: { repair?: boolean } = {}): { input: ContentInput; image: {name: string; bytes: Uint8Array; mime: string}; classificationChanged?: boolean; corrections?:string[]; reviewFlags?: string[]; originalJson?: string } {
  const entries = inspect(bytes);
  const images = [...entries.keys()].filter(name => imagePattern.test(name));
  if (images.length !== 1) fail('ZIP package must contain exactly one image.');
  let files: Record<string, Uint8Array>;
  try { files = unzipSync(bytes); } catch { return fail('ZIP package could not be decompressed.'); }
  for (const [name, length] of entries) if (!files[name] || files[name].length !== length) fail('Decompressed ZIP sizes do not match.');
  const raw = parseJson(files['content.json']!, 'content.json', options.repair);
  const classificationChanged = raw.category === 'READ' || (options.repair === true && typeof raw.category === 'string' && raw.category.trim().toUpperCase() === 'READ');
  const repaired = options.repair ? repairStructure(raw) : undefined;
  if (classificationChanged) raw.category = 'BOOK';
  const corrections:string[]=[...(repaired?.corrections ?? [])];
  if(raw.category==='EAT'&&Array.isArray(raw.ingredients)){
    raw.ingredients=raw.ingredients.map((value:unknown,index:number)=>{
      if(!value||typeof value!=='object'||Array.isArray(value))return value;
      const ingredient={...value} as Record<string,unknown>;
      if(ingredient.tag!==undefined&&!ingredientDefinitions.some(entry=>entry.id===ingredient.tag)){
        const supplied=(typeof ingredient.tag==='string'?ingredient.tag:JSON.stringify(ingredient.tag)??'unknown').slice(0,80);delete ingredient.tag;
        const match=typeof ingredient.name==='string'?resolveIngredient(ingredient.name):undefined;
        if(match)ingredient.tag=match.id;
        corrections.push(`ingredients.${index}.tag: ${supplied} → ${match?.id??'unmapped; illustration needed'}`);
      }
      return ingredient;
    });
  }
  const parsed = contentSchema.safeParse(raw);
  if (!parsed.success && options.repair) return fail(`Complete required fields: ${[...new Set(parsed.error.issues.map(issue => issue.path.join('.') || 'content'))].join(', ')}. Missing facts cannot be inferred automatically.`);
  if (!parsed.success) return fail(`Invalid content.json fields: ${parsed.error.issues.map(issue=>`${issue.path.join('.')}: ${issue.message}`).join('; ')}.`);
  const input = parsed.data;
  const issues = bilingualIssues(input).filter(issue => !issue.endsWith('translation requires human review.'));
  for (const locale of ['en', 'bs'] as const) {
    const translation = input.translations?.[locale];
    if (!translation || input.category === 'EAT') continue;
    if (translation.genres?.length !== input.genres.length) issues.push(`${locale.toUpperCase()} genres must match the source count.`);
    if (input.category === 'BOOK' && translation.authors?.length !== input.authors.length) issues.push(`${locale.toUpperCase()} authors must match the source count.`);
  }
  if (issues.length) fail(issues.join(' '));
  const name = images[0]!;
  if (input.image.path.split('/').pop() !== name) fail('content.json image.path must match the packaged image filename.');
  if (files['manifest.json']) {
    const manifest = parseJson(files['manifest.json'], 'manifest.json');
    if (manifest.format !== 'RANDOM-content-package-v1' || manifest.content !== 'content.json' || manifest.image !== name || Object.keys(manifest).some(key=>!['format','content','image'].includes(key))) fail('manifest.json does not match this content package.');
  }
  input.factsVerified = false;
  input.image.rightsConfirmed = false;
  for (const translation of Object.values(input.translations ?? {})) if (translation) translation.reviewed = false;
  if (input.category === 'EAT') {input.allergensVerified = false;if(input.phosphateAssessment)input.phosphateAssessment.reviewed=false;}
  return { input, image: {name, bytes:files[name]!, mime:imageMime(name,files[name]!)}, ...(classificationChanged ? {classificationChanged:true} : {}),...(corrections.length?{corrections}:{}), ...(repaired ? {reviewFlags: repaired.reviewFlags, originalJson: decoder.decode(files['content.json']!)} : {}) };
}
