import {importZip} from './ahmed-content-import.mjs';
import {Miniflare} from 'miniflare';
import {build} from 'esbuild';
import {zipSync,strToU8} from 'fflate';
import sharp from 'sharp';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import assert from 'node:assert/strict';
const fixtures=await build({stdin:{contents:"export {demoItems} from './packages/shared/src/demo';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',write:false});
const {demoItems}=await import('data:text/javascript;base64,'+Buffer.from(fixtures.outputFiles[0].contents).toString('base64'));
const worker=await build({entryPoints:['services/artwork/worker.ts'],bundle:true,format:'esm',platform:'browser',write:false});
const mf=new Miniflare({modules:true,script:worker.outputFiles[0].text,compatibilityDate:'2026-08-01',d1Databases:['CONTENT_DB'],bindings:{RANDOM_STUDIO_PASSWORD:'test-password'}});
const folder=await mkdtemp(join(tmpdir(),'random-import-'));
try{
 const input=structuredClone(demoItems.find(i=>i.category==='EAT'));input.image.path='/media/image.png';
 const image=await sharp({create:{width:1800,height:1200,channels:3,background:'#b98965'}}).png().toBuffer();
 const file=join(folder,'recipe.zip');await writeFile(file,zipSync({'content.json':strToU8(JSON.stringify(input)),'image.png':image}));
 const options={password:'test-password',baseUrl:'https://studio.example',fetcher:(url,options)=>mf.dispatchFetch(url,options)};
 await assert.rejects(importZip(file,{...options,password:'wrong'}),/401/);
 const result=await importZip(file,options);assert.equal(result.status,'review');assert.equal(result.duplicate,false);
 const duplicate=await importZip(file,options);assert.equal(duplicate.id,result.id);assert.equal(duplicate.duplicate,true);
 const publicItems=await(await mf.dispatchFetch('https://studio.example/api/catalog')).json();assert.equal(publicItems.items.length,0);
 const login=await mf.dispatchFetch('https://studio.example/api/database/login',{method:'POST',headers:{Origin:'https://studio.example','Content-Type':'application/json'},body:JSON.stringify({password:'test-password'})});
 const cookie=login.headers.get('set-cookie').split(';')[0];const rows=await(await mf.dispatchFetch('https://studio.example/api/content',{headers:{Cookie:cookie}})).json();assert.equal(rows.items.length,1);
 const media=await mf.dispatchFetch('https://studio.example'+rows.items[0].image.path,{headers:{Cookie:cookie}});const metadata=await sharp(Buffer.from(await media.arrayBuffer())).metadata();assert.equal(metadata.width,1440);assert.equal(metadata.format,'webp');
 console.log('PASS contributor ZIP → optimized D1 image → review-only shared item → idempotent duplicate; wrong password rejected.');
}finally{await mf.dispose();await rm(folder,{recursive:true,force:true});}
