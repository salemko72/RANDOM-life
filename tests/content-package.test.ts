import { describe, expect, it } from 'vitest';
import { zipSync, strToU8 } from 'fflate';
import { demoItems, type ContentInput } from '@random/shared';
import { readContentPackage } from '../apps/studio/src/content-package';

const png = new Uint8Array(33);
png.set([137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82]);
const jpeg = new Uint8Array([255,216,255,224,0,2,255,217]);
const webp = new Uint8Array(20);
webp.set(strToU8('RIFF')); webp[4]=12; webp.set(strToU8('WEBPVP8 '),8);
const avif = new Uint8Array(24);
avif[3]=24; avif.set(strToU8('ftypavif'),4); avif.set(strToU8('avif'),16);
const source = (category='EAT'): ContentInput => {
  const input = structuredClone(demoItems.find(item=>item.category===category) ?? demoItems.find(item=>item.category==='BOOK')!);
  if(category==='WATCH') {
    for(const t of Object.values(input.translations ?? {})) if(t) t.durationLabel='100 minutes';
    Object.assign(input,{category:'WATCH',format:'Film',year:2020,durationLabel:'100 minutes',platform:'Cinema'});
  }
  input.image.path='/media/image.png';
  return input;
};
const bundle = (input: unknown = source(), extras: Record<string,Uint8Array> = {}) => zipSync({'content.json':strToU8(JSON.stringify(input)),'image.png':png,...extras});

describe('content ZIP import',()=>{
  it.each(['EAT','BOOK','WATCH'])('imports complete %s drafts and resets all trust flags',category=>{
    const original = source(category);
    const {input,image}=readContentPackage(bundle({...original,status:'published',approvedBy:'AI',id:'untrusted'}));
    expect(image.mime).toBe('image/png');
    expect(input.factsVerified).toBe(false);
    expect(input.image.rightsConfirmed).toBe(false);
    expect(input.translations?.en?.reviewed).toBe(false);
    expect(input.translations?.bs?.reviewed).toBe(false);
    expect(input).not.toHaveProperty('status');
    expect(input).not.toHaveProperty('id');
    if(input.category==='EAT' && original.category==='EAT') {
      expect(input.allergensVerified).toBe(false);
      expect(input.ingredients).toEqual(original.ingredients);
      expect(input.allergens).toEqual(original.allergens);
    }
  });
  it('never trusts a phosphate review imported from ChatGPT',()=>{
    const raw=source();if(raw.category!=='EAT')throw Error();raw.phosphateAssessment={suitability:'low',reviewed:true,notes:{en:'AI suggestion',bs:'AI prijedlog'}};
    const imported=readContentPackage(bundle(raw)).input;if(imported.category!=='EAT')throw Error();expect(imported.phosphateAssessment?.reviewed).toBe(false);
  });
  it('accepts unreviewed translations and maps READ to BOOK explicitly',()=>{
    const raw=source('BOOK'); raw.translations!.en!.reviewed=false;
    const result=readContentPackage(bundle({...raw,category:'READ'}));
    expect(result.input.category).toBe('BOOK'); expect(result.classificationChanged).toBe(true);
  });
  it.each([['jpg',jpeg,'image/jpeg'],['webp',webp,'image/webp'],['avif',avif,'image/avif']] as const)('checks %s binary signatures',(extension,bytes,mime)=>{
    const raw=source(); raw.image.path=`/media/image.${extension}`;
    const bytesZip=zipSync({'content.json':strToU8(JSON.stringify(raw)),[`image.${extension}`]:bytes});
    expect(readContentPackage(bytesZip).image.mime).toBe(mime);
  });
  it('accepts a matching manifest and readme',()=>{
    expect(readContentPackage(bundle(source(),{'manifest.json':strToU8(JSON.stringify({format:'RANDOM-content-package-v1',content:'content.json',image:'image.png'})),'readme.txt':strToU8('Review before publishing.')})).image.name).toBe('image.png');
  });
  it.each(['../escape.txt','/absolute.txt','dir\\file.txt','dir/file.txt','unexpected.txt'])('rejects unsafe or unexpected path %s',name=>{
    expect(()=>readContentPackage(bundle(source(),{[name]:strToU8('bad')}))).toThrow();
  });
  it('rejects ambiguous images and mismatching image paths',()=>{
    expect(()=>readContentPackage(bundle(source(),{'second.png':png}))).toThrow('exactly one image');
    const raw=source();raw.image.path='/media/other.png';
    expect(()=>readContentPackage(bundle(raw))).toThrow('must match');
  });
  it('rejects malformed JSON, missing translations and mismatching translation counts',()=>{
    expect(()=>readContentPackage(bundle(source(),{'content.json':strToU8('{')}))).toThrow('valid UTF-8 JSON');
    const raw=source();delete raw.translations;
    expect(()=>readContentPackage(bundle(raw))).toThrow('Missing EN translation');
    const recipe=source();recipe.translations!.en!.ingredientNames=[];
    expect(()=>readContentPackage(bundle(recipe))).toThrow('match all ingredients');
    const book=source('BOOK');book.translations!.bs!.authors=[];
    expect(()=>readContentPackage(bundle(book))).toThrow('authors must match');
  });
  it('rejects invalid UTF-8, nonobjects and disguised images',()=>{
    expect(()=>readContentPackage(bundle(source(),{'content.json':new Uint8Array([255])}))).toThrow('UTF-8');
    expect(()=>readContentPackage(bundle([]))).toThrow('JSON object');
    expect(()=>readContentPackage(bundle(source(),{'image.png':strToU8('<html>hello</html>')}))).toThrow('binary format');
  });
  it('rejects invalid manifests, oversized archives and oversized expanded files before decompression',()=>{
    expect(()=>readContentPackage(bundle(source(),{'manifest.json':strToU8('{}')}))).toThrow('manifest');
    expect(()=>readContentPackage(new Uint8Array(25*1024*1024+1))).toThrow('25 MB');
    expect(()=>readContentPackage(bundle(source(),{'readme.txt':new Uint8Array(128*1024+1)}))).toThrow('size');
    expect(()=>readContentPackage(bundle(source(),{'image.png':new Uint8Array(15*1024*1024+1)}))).toThrow('size');
  });
  it('rejects duplicate directory names, encryption and inconsistent local sizes',()=>{
    const duplicate=bundle(source(),{'other.png':png});
    const needle=strToU8('other.png');
    for(let i=0;i<duplicate.length-needle.length;i++) if(needle.every((byte,j)=>duplicate[i+j]===byte)) duplicate.set(strToU8('image.png'),i);
    expect(()=>readContentPackage(duplicate)).toThrow('Duplicate');
    const encrypted=bundle();
    const view=new DataView(encrypted.buffer);
    for(let i=0;i<encrypted.length-4;i++) if(view.getUint32(i,true)===0x02014b50) {encrypted[i+8]|=1;break;}
    expect(()=>readContentPackage(encrypted)).toThrow('Encrypted');
    const sizes=bundle(); sizes[22]^=1;
    expect(()=>readContentPackage(sizes)).toThrow('sizes');
  });
});

it('recovers unknown optional illustration tags without changing recipe facts',()=>{
 const raw=source();if(raw.category!=='EAT')throw Error();raw.ingredients[0]={...raw.ingredients[0],name:'Luk',tag:'invented-onion-tag'};raw.ingredients[1]={...raw.ingredients[1],name:'Ingredient without illustration',tag:'invented-illustration'};
 const {input}=readContentPackage(bundle(raw));if(input.category!=='EAT')throw Error();expect(input.ingredients[0].tag).toBe('onion');expect(input.ingredients[1]).not.toHaveProperty('tag');expect(input.ingredients.map(i=>[i.name,i.quantity,i.unit])).toEqual(raw.ingredients.map(i=>[i.name,i.quantity,i.unit]));expect(input.allergens).toEqual(raw.allergens);expect(input.translations).toEqual(Object.fromEntries(Object.entries(raw.translations!).map(([code,t])=>[code,{...t,reviewed:false}])));
});
