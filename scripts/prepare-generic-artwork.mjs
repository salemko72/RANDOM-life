import {build}from'esbuild';import{readFile,writeFile,mkdir}from'node:fs/promises';
const b=await build({stdin:{contents:"export {withGenericArtwork,genericArtworkPath} from './packages/shared/src/generic-artwork';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',write:false});
const {withGenericArtwork}=await import('data:text/javascript;base64,'+Buffer.from(b.outputFiles[0].contents).toString('base64'));
const dir='apps/client/src/web/backup';const old=JSON.parse(await readFile(dir+'/catalog.json'));const next={...old,generatedAt:new Date().toISOString(),items:old.items.map(r=>withGenericArtwork(r))};
const imageSource=await readFile(dir+'/images.ts','utf8');const importedFiles=[...imageSource.matchAll(/from '\.\/images\/([^']+)'/g)].map(m=>m[1]);
const genericFiles=JSON.parse(await readFile('docs/reviews/generic-artwork-v1-sources.json')).map(x=>x.path.split('/').pop());
next.imageBytes=0;for(const file of new Set(importedFiles))next.imageBytes+=(await readFile(dir+'/images/'+file)).length;for(const file of genericFiles)next.imageBytes+=(await readFile('apps/client/src/web/assets/generic/'+file)).length;
await writeFile(dir+'/catalog.json',JSON.stringify(next));const{items,...metadata}=next;
await writeFile(dir+'/catalog.ts',"import type {ContentRecord} from '@random/shared';\nexport const reserveItems="+JSON.stringify(items)+' as unknown as ContentRecord[];\nexport const reserveMetadata='+JSON.stringify(metadata)+';\n');
// Keep old images available in Git history, but never import them into the installed bundle.
const used=new Set(items.filter(x=>!['BOOK','WATCH'].includes(x.category)).map(x=>x.image.path));
const oldMap=await readFile(dir+'/images.ts','utf8');const entries=[...oldMap.matchAll(/("\/media\/[^"\n]+"):(image\d+)/g)].filter(m=>used.has(JSON.parse(m[1])));
const names=new Set(entries.map(m=>m[2]));const imports=oldMap.split('\n').filter(l=>[...names].some(n=>l.startsWith('import '+n+' from ')));
await writeFile(dir+'/images.ts',imports.join('\n')+'\nexport const bundledImageFiles:Record<string,string>={\n'+entries.map(m=>m[1]+':'+m[2]).join(',\n')+'\n};\n');
const response=await fetch('https://random-life-preview.pages.dev/api/catalog');if(!response.ok)throw Error('Public snapshot fetch failed');const live=await response.json();
await mkdir('/workspace/shared/generic-artwork-v1',{recursive:true});await writeFile('/workspace/shared/generic-artwork-v1/public-before.json',JSON.stringify(live));const changes=live.items.filter(x=>['BOOK','WATCH'].includes(x.category)).map(x=>({id:x.id,expectedVersion:x.version,image:withGenericArtwork(x).image}));await writeFile('/workspace/shared/generic-artwork-v1/public-image-changes.json',JSON.stringify(changes,null,2));console.log('Reserve normalized; public image changes:',changes.length);
