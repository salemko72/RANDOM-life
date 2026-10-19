import {build} from 'esbuild';
import {mkdtemp,mkdir,copyFile,writeFile,stat,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
import {createServer} from 'node:http';

const bundled=await build({stdin:{contents:"export {prepareNativePreview} from './apps/client/src/native/preview-assets';export {createProfile} from './apps/client/src/web/preferences';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',write:false});
const {prepareNativePreview,createProfile}=await import('data:text/javascript;base64,'+Buffer.from(bundled.outputFiles[0].contents).toString('base64'));
const directory=await mkdtemp(resolve(tmpdir(),'random-native-file-'));
const catalog=JSON.parse(await readFile('apps/client/src/web/backup/catalog.json','utf8'));
const book=catalog.items.find(row=>row.category==='BOOK');
const profile={...createProfile(),name:'Native QA',onboarded:true};
const state={'random-life.local-profile.v1':JSON.stringify(profile),'random-life.locale.v1':'en',['random-life.experience.'+profile.id]:JSON.stringify({favorites:[book.id],history:[],seen:[]})};
const files={cacheDirectory:pathToFileURL(directory+'/').href,makeDirectoryAsync:(uri)=>mkdir(fileURLToPath(uri),{recursive:true}),getInfoAsync:async uri=>({exists:await stat(fileURLToPath(uri)).then(()=>true,()=>false)}),copyAsync:({from,to})=>copyFile(fileURLToPath(from),fileURLToPath(to)),writeAsStringAsync:(uri,text)=>writeFile(fileURLToPath(uri),text)};
const uri=await prepareNativePreview({hash:'abcdef123',localUri:pathToFileURL(resolve('apps/client/src/generated/preview.html')).href,downloadAsync:async()=>{}},files,state,{top:24,bottom:16});
// The managed browser blocks file:// navigation. Serve the exact prepared files
// locally to verify script order and relative assets without changing its policy.
const root=fileURLToPath(uri.slice(0,uri.lastIndexOf('/')+1));
const server=createServer(async(req,res)=>{try{const name=req.url==='/'?'index.html':req.url.slice(1);if(!['index.html','native-state.js'].includes(name)){res.writeHead(404).end();return;}res.setHeader('Content-Type',name.endsWith('.js')?'application/javascript':'text/html');res.end(await readFile(resolve(root,name)));}catch{res.writeHead(500).end();}});
await new Promise(done=>server.listen(0,'127.0.0.1',done));
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.__nativeMessages=[];window.ReactNativeWebView={postMessage:m=>window.__nativeMessages.push(m)};});
 await page.route('https://random-life-preview.pages.dev/**',route=>route.abort('failed'));
 await page.route('**/api/catalog',route=>route.abort('failed'));
 await page.goto('http://127.0.0.1:'+server.address().port,{waitUntil:'load'});
 await page.locator('.main-stage').waitFor();
 await page.locator('.backup-status').waitFor();
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('random-life.local-profile.v1')).name),'Native QA');
 assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--native-safe-top')),'24px');
 await page.waitForFunction(()=>window.__nativeMessages.some(raw=>{const m=JSON.parse(raw);return m.type==='random-life.performance.v1'&&m.name==='ui_ready';}));
 await page.locator('.menu-button').click();await page.getByRole('button',{name:'Share diagnostic log',exact:true}).click();
 assert(await page.evaluate(()=>window.__nativeMessages.some(raw=>JSON.parse(raw).type==='random-life.performance.export.v1')));
 const metrics=await page.evaluate(()=>window.__nativeMessages.map(raw=>JSON.parse(raw)).filter(m=>m.type==='random-life.performance.v1'));
 assert(metrics.some(m=>m.name==='web_boot'));assert(metrics.some(m=>m.name==='catalog'&&m.metrics.backup===1));assert(!JSON.stringify(metrics).includes('Native QA'));
 await page.keyboard.press('Escape');
 await page.locator('[data-nav="favorites"]').click();await page.locator('.saved-item').click();
 await page.waitForFunction(()=>document.querySelector('.feature-photo')?.disabled===false);
 await mkdir('/workspace/shared/android-startup',{recursive:true});
 await page.screenshot({path:'/workspace/shared/android-startup/read-smooth.png'});
 await page.locator('.feature-photo').click();await page.getByRole('dialog').waitFor();
 assert(await page.locator('.image-viewer img').evaluate(img=>img.complete&&img.naturalWidth>0));
 await page.keyboard.press('Escape');
 await page.locator('.favorite-float').click();
 assert(await page.evaluate(()=>window.__nativeMessages.some(raw=>JSON.parse(raw).operation==='set')));
 assert.deepEqual(errors,[]);
 console.log('PASS installed-file layout via local HTTP: bootstrap before app, profile/language/safe area, D1 outage reserve, correct book image, native state messages, startup/catalog diagnostic events and native report sharing. Physical Android file:// launch remains a device check.');
}finally{await browser.close();server.closeAllConnections();await new Promise(done=>server.close(done));await rm(directory,{recursive:true,force:true});}
