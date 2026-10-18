import {build} from 'esbuild';
import sharp from 'sharp';
import {createHash,randomInt} from 'node:crypto';
import {mkdir,writeFile,readFile,rename,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
import {tmpdir} from 'node:os';

// Run with Node 24's --use-env-proxy: TLS and the environment's proxy remain enabled.
const origin='https://random-life-preview.pages.dev';
const target=resolve('apps/client/src/web/backup'),temporary=target+'.next';
const validation=await build({stdin:{contents:"export {contentSchema,publicationIssues} from './packages/shared/src/content';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',write:false});
const {contentSchema,publicationIssues}=await import('data:text/javascript;base64,'+Buffer.from(validation.outputFiles[0].contents).toString('base64'));
async function download(url){for(let attempt=0;attempt<3;attempt++){const response=await fetch(url,{headers:{'User-Agent':'RANDOM-life-backup-builder/1.0'},signal:AbortSignal.timeout(25000)});if(response.ok)return response;if(attempt<2&&[429,500,502,503,504].includes(response.status)){await new Promise(r=>setTimeout(r,250));continue;}throw Error('HTTP '+response.status);}}
const {items}=await(await download(origin+'/api/catalog')).json();
if(!Array.isArray(items))throw Error('Public catalog response has no items');
const groups=new Map(['EAT','BOOK','WATCH','MOVE','GO'].map(category=>[category,[]]));
for(const row of items){if(row.status!=='published'||!row.id)continue;const parsed=contentSchema.safeParse(row);if(!parsed.success||publicationIssues(parsed.data).length)continue;groups.get(row.category)?.push({...parsed.data,id:row.id,status:'published',version:row.version,updatedAt:row.updatedAt,approvedAt:null,approvedBy:null});}
for(const rows of groups.values())for(let i=rows.length-1;i>0;i--){const j=randomInt(i+1);[rows[i],rows[j]]=[rows[j],rows[i]];}
const food=groups.get('EAT'),prioritized=[];
for(const [predicate,count]of [[r=>r.phosphateAssessment?.reviewed&&r.phosphateAssessment.suitability==='low'&&r.dietaryTags.includes('low-phosphate'),7],[r=>r.dietaryTags.includes('vegan'),7]])for(const row of food.filter(predicate).slice(0,count))if(!prioritized.includes(row))prioritized.push(row);
groups.set('EAT',[...prioritized,...food.filter(row=>!prioritized.includes(row))]);
await rm(temporary,{recursive:true,force:true});await mkdir(temporary+'/images',{recursive:true});
const records=[],assets=[],skipped=[];let imageBytes=0;const cache=resolve(tmpdir(),'random-reserve-downloads');await mkdir(cache,{recursive:true});
try{
 for(const [category,rows]of groups){let count=0;for(const row of rows){if(count===20)break;try{
  if(!/^\/media\/[A-Za-z0-9_-]+\.(?:webp|png|jpg)$/.test(row.image.path))throw Error('Unsupported public media path');
  const cached=cache+'/'+createHash('sha256').update(row.image.path).digest('hex')+'.webp';let bytes;
  try{bytes=await readFile(cached);}catch{
   const response=await download(origin+row.image.path);const source=Buffer.from(await response.arrayBuffer());if(source.length>15*1024*1024)throw Error('Source image too large');
   bytes=await sharp(source,{limitInputPixels:40_000_000}).rotate().resize({width:720,height:960,fit:'inside',withoutEnlargement:true}).webp({quality:65,effort:5}).toBuffer();await writeFile(cached,bytes);
  }
  const hash=createHash('sha256').update(bytes).digest('hex').slice(0,24),name=hash+'.webp';await writeFile(temporary+'/images/'+name,bytes);imageBytes+=bytes.length;
  records.push(row);if(!assets.some(a=>a.path===row.image.path))assets.push({path:row.image.path,file:name,bytes:bytes.length});count++;
 }catch(error){skipped.push({id:row.id,title:row.title,error:error.message});console.warn(category,row.title,error.message);}}
 if(count!==20)throw Error(`Only ${count} usable ${category} items; need 20. Existing backup is untouched.`);
 }
 if(records.filter(r=>r.category==='EAT'&&r.dietaryTags.includes('vegan')).length<7||records.filter(r=>r.category==='EAT'&&r.dietaryTags.includes('low-phosphate')&&r.phosphateAssessment?.reviewed&&r.phosphateAssessment.suitability==='low').length<7)throw Error('Reserve needs seven verified low-phosphate and seven vegan choices');
 const manifest={version:1,generatedAt:new Date().toISOString(),source:origin+'/api/catalog',counts:Object.fromEntries([...groups.keys()].map(category=>[category,records.filter(r=>r.category===category).length])),imageBytes,items:records};
 const json=JSON.stringify(manifest);if(Buffer.byteLength(json)+imageBytes>10*1024*1024)throw Error('Backup exceeds the 10 MiB budget');
 await writeFile(temporary+'/catalog.json',json);
 await writeFile(temporary+'/catalog.ts',"import type {ContentRecord} from '@random/shared';\nexport const reserveItems="+JSON.stringify(records)+" as unknown as ContentRecord[];\nexport const reserveMetadata="+JSON.stringify({...manifest,items:undefined})+";\n");
 const imports=assets.map((a,i)=>`import image${i} from './images/${a.file}';`).join('\n');
 await writeFile(temporary+'/images.ts',imports+'\nexport const bundledImageFiles:Record<string,string>={\n'+assets.map((a,i)=>JSON.stringify(a.path)+':image'+i).join(',\n')+'\n};\n');
 await writeFile(temporary+'/README.md',`# Bundled reserve catalog\n\nGenerated from published public D1 items by npm run backup:refresh.\n\n${records.length} items, 20 per category. Images: ${imageBytes} bytes; metadata: ${Buffer.byteLength(json)} bytes.\n\nIDs, diet assessments, translations and rights provenance are preserved. Private approval identities are not exported by the public API and remain null. This snapshot is read-only and is never imported into Studio or D1.\n`);
 await rm(target+'.previous',{recursive:true,force:true});try{await rename(target,target+'.previous');}catch(error){if(error.code!=='ENOENT')throw error;}
 try{await rename(temporary,target);}catch(error){try{await rename(target+'.previous',target);}catch{}throw error;}await rm(target+'.previous',{recursive:true,force:true});
 console.log(JSON.stringify({items:records.length,counts:manifest.counts,imageBytes,metadataBytes:Buffer.byteLength(json),totalBytes:imageBytes+Buffer.byteLength(json),skipped},null,2));
}catch(error){await rm(temporary,{recursive:true,force:true});throw error;}
