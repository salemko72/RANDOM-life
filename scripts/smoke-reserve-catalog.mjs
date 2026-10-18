import {build} from 'esbuild';import {createServer} from 'node:http';import {readFile,mkdir} from 'node:fs/promises';import {chromium} from 'playwright-core';import assert from 'node:assert/strict';
const fixture=await build({stdin:{contents:"export {createProfile} from './apps/client/src/web/preferences';export {reserveItems} from './apps/client/src/web/backup/catalog';",resolveDir:process.cwd()},bundle:true,format:'esm',platform:'node',write:false});const {createProfile,reserveItems}=await import('data:text/javascript;base64,'+Buffer.from(fixture.outputFiles[0].contents).toString('base64'));
let mode='down',apiRequests=0,remoteMedia=0;
const online=structuredClone(reserveItems[0]);online.id='online-only-fixture';online.title='Online recovered item';online.translations.en.title=online.title;online.translations.bs.title=online.title;
const reserveManifest=JSON.parse(await readFile('apps/client/src/web/backup/catalog.json','utf8'));
const embedded=await readFile('apps/client/preview-dist/RANDOM_INTERACTIVE_PREVIEW.html');
const server=createServer(async(req,res)=>{const path=new URL(req.url,'http://local').pathname;
 if(path==='/api/catalog'){apiRequests++;if(mode==='hang')return;res.setHeader('Content-Type','application/json');res.statusCode=mode==='down'?503:200;res.end(JSON.stringify(mode==='down'?{error:'DATABASE_UNAVAILABLE'}:{items:mode==='empty'?[]:[online]}));return;}
 if(path.startsWith('/media/')){remoteMedia++;res.statusCode=503;res.end();return;}
 if(path==='/embedded'){res.setHeader('Content-Type','text/html');res.end(embedded);return;}
 try{const body=await readFile('apps/client/preview-dist'+(path==='/'?'/index.html':path));res.setHeader('Content-Type',path.endsWith('.js')?'application/javascript':path.endsWith('.css')?'text/css':path.endsWith('.webp')?'image/webp':path.endsWith('.png')?'image/png':'text/html');res.end(body);}catch{res.statusCode=404;res.end();}
});await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});await mkdir('/workspace/shared/reserve-catalog',{recursive:true});
try{
 for(const [width,height,embeddedMode]of [[390,844,false],[320,568,true]]){
  mode='down';remoteMedia=0;const page=await browser.newPage({viewport:{width,height},isMobile:true,hasTouch:true,reducedMotion:'reduce'});const profile={...createProfile(),name:'Reserve QA',onboarded:true};
  await page.addInitScript(({profile,ids})=>{localStorage.setItem('random-life.local-profile.v1',JSON.stringify(profile));localStorage.setItem('random-life.locale.v1','en');localStorage.setItem('random-life.experience.'+profile.id,JSON.stringify({favorites:ids,history:[],seen:[]}));},{profile,ids:reserveItems.map(r=>r.id)});
  if(embeddedMode){await page.route('**/assets/**',route=>route.abort());await page.addInitScript(()=>Object.defineProperty(navigator,'onLine',{get:()=>false}));}
  await page.goto(origin+(embeddedMode?'/embedded':'/'));await page.locator('.backup-status').waitFor();await page.locator('.app-splash').waitFor({state:'detached'});assert.equal((await page.locator('.backup-status').innerText()),'D1 disconnected · Backup active');
  const status=await page.locator('.backup-status').boundingBox();assert(status.height<25&&status.width<260);assert.equal(await page.locator('.backup-status').evaluate(e=>getComputedStyle(e).pointerEvents),'none');
  for(const category of ['EAT','BOOK','WATCH','MOVE','GO']){
   const item=reserveItems.find(r=>r.category===category);await page.locator('[data-nav="favorites"]').click();await page.locator('.saved-item').filter({has:page.locator('[data-item-image="'+item.image.path+'"]')}).first().click();await page.waitForFunction(()=>document.querySelector('.feature-photo')?.disabled===false);
   await page.locator('.feature-photo').click({position:{x:Math.min(160,width*.5),y:100}});const viewer=page.getByRole('dialog');await viewer.waitFor();assert(await viewer.locator('img').evaluate(async img=>{await img.decode();return img.naturalWidth>0&&img.naturalHeight>0}));await page.keyboard.press('Escape');await page.locator('.result-header .menu-button').click();
  }
  assert.equal(remoteMedia,0,'reserve images must never request D1 media');
  if(embeddedMode){const packed=await page.evaluate(async()=>{const urls=[...new Set(Object.entries(globalThis.__randomAssetUrls).filter(([key])=>key.endsWith('.webp')).map(([,url])=>url))];let bytes=0;for(const url of urls){if(!url.startsWith('blob:'))throw Error('Reserve image is not local');const blob=await(await fetch(url)).blob();if(blob.type!=='image/webp')throw Error('Wrong native media type');bytes+=blob.size;}return {count:urls.length,bytes};});assert.equal(packed.count,100);assert.equal(packed.bytes,reserveManifest.imageBytes);}

  await page.locator('.spin-hub').click();await page.locator('.result-scene.scene-visible').waitFor({timeout:20000});await page.waitForFunction(()=>document.querySelector('.feature-photo')?.disabled===false);const title=await page.locator('.result-item-title').innerText();
  if(!embeddedMode){await page.screenshot({path:'/workspace/shared/reserve-catalog/backup-active.png'});mode='up';await page.evaluate(()=>window.dispatchEvent(new Event('online')));await page.locator('.backup-status').waitFor({state:'detached'});assert.equal(await page.locator('.result-item-title').innerText(),title,'recovery must preserve the open item');assert((await page.locator('.catalog-online').first().innerText()).includes('1'));
   // A valid empty D1 catalog must never silently revive the reserve.
   mode='empty';await page.evaluate(()=>window.dispatchEvent(new Event('online')));await page.waitForFunction(()=>document.querySelector('.catalog-online')?.textContent?.includes('0'));assert.equal(await page.locator('.backup-status').count(),0);
   mode='hang';const started=Date.now();await page.evaluate(()=>window.dispatchEvent(new Event('online')));await page.locator('.backup-status').waitFor({timeout:6000});assert(Date.now()-started<5500,'a hung D1 request must fail over quickly');
   await page.clock.install();mode='up';await page.clock.fastForward(31000);await page.locator('.backup-status').waitFor({state:'detached'});assert.equal(await page.locator('.result-item-title').innerText(),title,'automatic recovery must preserve the current item');

  }
  await page.close();console.log(`PASS ${width}x${height}: ${embeddedMode?'installed HTML with all asset-network requests blocked':'static web with D1 down'}, five local images, spin, quiet status${embeddedMode?'':', D1 recovery and authoritative empty catalog'}.`);
 }
}finally{await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
