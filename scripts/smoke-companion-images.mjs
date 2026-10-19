import {build} from 'esbuild';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
const bundle=await build({stdin:{contents:"export {demoCatalog} from './apps/client/src/web/bilingualCatalog';export {createProfile} from './apps/client/src/web/preferences';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',write:false});
const {demoCatalog,createProfile}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].contents).toString('base64'));
const items=['BOOK','WATCH'].flatMap(category=>[0,1,2].map(i=>{
 const row=structuredClone(demoCatalog.find(r=>r.category===category));
 return {...row,id:`companion-${category}-${i}`,title:`${category} ${i}`,status:'published',factsVerified:true,translations:Object.fromEntries(Object.entries(row.translations).map(([lang,t])=>[lang,{...t,title:`${category} ${i}`,reviewed:true}])),image:{...row.image,path:`/media/companion-${category}-${i}.png`,rightsConfirmed:true}};
}));
const media=new Map();for(const row of items.filter(r=>!r.id.endsWith('-2')))media.set(row.image.path,await sharp({create:{width:320,height:480,channels:3,background:row.category==='BOOK'?'#32725f':'#9c4860'}}).png().toBuffer());
const html=await readFile('apps/client/preview-dist/RANDOM_INTERACTIVE_PREVIEW.html');
const server=createServer((req,res)=>{if(req.url.startsWith('/api/')){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({items,ok:true}));}else if(media.has(req.url)){res.setHeader('Content-Type','image/png');res.end(media.get(req.url));}else if(req.url.startsWith('/media/'))res.writeHead(404).end();else{res.setHeader('Content-Type','text/html');res.end(html);}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try{for(const category of ['BOOK','WATCH']){
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});const profile={...createProfile(),onboarded:true};
 await page.addInitScript(({profile,id})=>{localStorage.setItem('random-life.local-profile.v1',JSON.stringify(profile));localStorage.setItem('random-life.locale.v1','en');localStorage.setItem('random-life.experience.'+profile.id,JSON.stringify({favorites:[id],history:[],seen:[]}));},{profile,id:`companion-${category}-0`});
 await page.goto('http://127.0.0.1:'+server.address().port);await page.locator('.main-stage').waitFor();await page.locator('[data-nav="favorites"]').click();await page.locator('.saved-item').click();await page.locator('.result-actions .pill-primary').click();await page.locator('.detail-action-bar .pill-primary').click();
 const valid=page.locator('.companion-entry').filter({has:page.getByText(`${category} 1`,{exact:true})});
 await valid.locator('.saved-photo').waitFor();await page.waitForFunction(path=>{const e=document.querySelector(`.companion-thumb [data-item-image="${path}"]`);return e?.style.backgroundImage.includes('blob:');},`/media/companion-${category}-1.png`);
 const bytes=await valid.locator('.saved-photo').evaluate(async e=>{const url=e.style.backgroundImage.slice(5,-2);const blob=await(await fetch(url)).blob();return [...new Uint8Array(await blob.arrayBuffer())];});
 assert.equal(createHash('sha256').update(Buffer.from(bytes)).digest('hex'),createHash('sha256').update(media.get(`/media/companion-${category}-1.png`)).digest('hex'));
 const missing=page.locator('.companion-entry').filter({has:page.getByText(`${category} 2`,{exact:true})});assert.equal(await missing.locator('.saved-photo').evaluate(e=>getComputedStyle(e).backgroundImage),'none');assert(await missing.locator('.saved-photo svg').isVisible());
 await valid.click();await page.locator('.result-item-title').filter({hasText:`${category} 1`}).waitFor();
 console.log(`PASS ${category}: real related image bytes, neutral missing-image icon, navigation to exact related item.`);await page.close();
}}finally{await browser.close();await new Promise(r=>server.close(r));}
