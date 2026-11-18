import{build}from'esbuild';import{createHash}from'node:crypto';import{readFile,writeFile,mkdir}from'node:fs/promises';
const root='content/i18n-2026-11-18';
const pinned='59a712e7856e411d0d1b11e7c7c681cdb0e4e769522ccdbcd84a502df53eebf8';
const manifestResponse=await fetch('https://random-life-preview.pages.dev/api/catalog/manifest');if(!manifestResponse.ok)throw Error('MANIFEST_HTTP_'+manifestResponse.status);const manifest=await manifestResponse.json();if(manifest.version!==pinned)throw Error('SOURCE_MOVED_REVIEW_NEW_SNAPSHOT_BEFORE_REGENERATING');
const response=await fetch('https://random-life-preview.pages.dev'+manifest.snapshotPath);if(!response.ok)throw Error('SNAPSHOT_HTTP_'+response.status);const bytes=Buffer.from(await response.arrayBuffer());
const digest=buffer=>createHash('sha256').update(buffer).digest('hex');if(digest(bytes)!==manifest.version)throw Error('SNAPSHOT_HASH');
const result=await build({stdin:{contents:"export{validateCatalogItems}from'./apps/client/src/web/consumer-catalog-cache';export{applyRecipeWording}from'./apps/client/src/web/recipe-wording';export{withGenericArtwork}from'./packages/shared/src/generic-artwork';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',write:false});
const{validateCatalogItems,applyRecipeWording,withGenericArtwork}=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].contents).toString('base64'));
const project=record=>withGenericArtwork(applyRecipeWording(record));
const records=validateCatalogItems(JSON.parse(bytes).items).map(project);if(records.length!==manifest.itemCount)throw Error('COUNT');
const reserve=JSON.parse(await readFile('apps/client/src/web/backup/catalog.json','utf8')).items.map(project);
for(const record of reserve){const online=records.find(row=>row.id===record.id);if(!online||JSON.stringify(online.translations.en)!==JSON.stringify(record.translations.en))throw Error('OFFLINE_ENGLISH_DIFF '+record.id);}
const pilot=[];for(const category of ['EAT','BOOK','WATCH','MOVE','GO']){
 const item=category==='EAT'?records.find(record=>record.category==='EAT'&&record.dietaryTags.includes('low-phosphate')):records.find(record=>record.category===category);
 if(!item)throw Error('PILOT '+category);pilot.push(item.id);
}const series=records.find(record=>record.category==='WATCH'&&/series|serija/i.test(record.format));if(series&&!pilot.includes(series.id))pilot.push(series.id);
const map=new Map();for(const record of records){for(const[field,value]of Object.entries(record.translations.en)){
 if(field==='authors'||field==='reviewed'||field==='title'&&['BOOK','WATCH'].includes(record.category))continue;
 for(const text of typeof value==='string'?[value]:Array.isArray(value)?value:[]){const key=digest(text).slice(0,12);let row=map.get(key);if(row&&row.en!==text)throw Error('COLLISION');if(!row){row={key,en:text,fields:[],categories:[],pilot:false};map.set(key,row);}if(!row.fields.includes(field))row.fields.push(field);if(!row.categories.includes(record.category))row.categories.push(record.category);if(pilot.includes(record.id))row.pilot=true;}
}}
const strings=[...map.values()].sort((a,b)=>Number(b.pilot)-Number(a.pilot)||a.key.localeCompare(b.key));
await mkdir(root+'/chunks',{recursive:true});await mkdir(root+'/memory',{recursive:true});
await writeFile(root+'/source-catalog.json',JSON.stringify({schema:1,serverVersion:manifest.version,projection:'recipe-wording-2026-11-17 + generic-art-v1',items:records}));
await writeFile(root+'/source-strings.json',JSON.stringify(strings,null,2)+'\n');
await writeFile(root+'/source-manifest.json',JSON.stringify({schema:1,serverVersion:manifest.version,projectionSha256:digest(JSON.stringify(records)),itemCount:records.length,counts:records.reduce((acc,row)=>(acc[row.category]=(acc[row.category]??0)+1,acc),{}),reserveIds:reserve.map(row=>row.id),pilotIds:pilot,stringCount:strings.length,uniqueWords:strings.reduce((n,row)=>n+row.en.split(/\s+/).length,0)},null,2)+'\n');
const pilotStrings=strings.filter(row=>row.pilot);await writeFile(root+'/pilot-strings.json',JSON.stringify(pilotStrings,null,2)+'\n');
// Small numbered source chunks let each locale worker resume safely without loading the whole catalogue.
for(let offset=0;offset<strings.length;offset+=120)await writeFile(root+'/chunks/'+String(offset/120+1).padStart(2,'0')+'.json',JSON.stringify(strings.slice(offset,offset+120),null,2)+'\n');
console.log(JSON.stringify({items:records.length,strings:strings.length,pilotRecords:pilot.length,pilotStrings:pilotStrings.length,chunks:Math.ceil(strings.length/120),words:strings.reduce((n,row)=>n+row.en.split(/\s+/).length,0)}));
