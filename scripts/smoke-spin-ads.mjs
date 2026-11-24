import {build} from 'esbuild';
import {readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
const native=await build({stdin:{contents:"import {createAdController} from './apps/client/src/native/ads-controller';import{parseAdMessage}from'./apps/client/src/native/ads-policy';window.__createAdController=createAdController;window.__parseAdMessage=parseAdMessage;",resolveDir:process.cwd()},bundle:true,write:false,format:'iife',platform:'browser'});
const profileBundle=await build({stdin:{contents:"export{createProfile}from'./apps/client/src/web/preferences';",resolveDir:process.cwd()},bundle:true,write:false,format:'esm',platform:'node'});
const {createProfile}=await import('data:text/javascript;base64,'+Buffer.from(profileBundle.outputFiles[0].text).toString('base64'));
const profile={...createProfile(),onboarded:true};
const html=await readFile('apps/client/preview-dist/RANDOM_INTERACTIVE_PREVIEW.html');
const server=createServer((req,res)=>req.url.startsWith('/api/')?res.writeHead(503).end():res.writeHead(200,{'Content-Type':'text/html'}).end(html));
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 for(const placement of ['central','category','repeat']){
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript({content:native.outputFiles[0].text+'\n'+`(${function(profile){
   localStorage.setItem('random-life.locale.v1','en');localStorage.setItem('random-life.local-profile.v1',JSON.stringify(profile));
   window.__lifespinnerAds=true;window.confirm=()=>true;
   const state=window.__adTest={shown:0,spins:0,requests:0,events:[],now:200000,close:null,load:null};
   const sdk={consent:async()=>true,privacy:async()=>true,initialize:async()=>{},preload:events=>{state.close=()=>events.closed();state.load=()=>events.loaded();queueMicrotask(()=>events.loaded());return{show:async()=>{state.shown++;},dispose(){}};}};
   const c=window.__createAdController({sdk,read:async()=>null,write:async()=>{},now:()=>state.now});c.active(true);
   window.ReactNativeWebView={postMessage:raw=>{const m=window.__parseAdMessage(raw);if(!m)return;state.events.push(m);if(m.event==='spin')state.spins++;if(m.event==='request')state.requests++;const respond=stage=>window.dispatchEvent(new CustomEvent('lifespinner.ads.response.v1',{detail:{seq:m.seq,stage}}));const result=c.receive(m,()=>respond('showing'));if(m.event==='request')Promise.resolve(result).then(()=>respond('continue'));}};
  }.toString()})(${JSON.stringify(profile)});`});
  await page.goto('http://127.0.0.1:'+server.address().port);await page.locator('.app-splash').waitFor({state:'detached'});await page.locator('.spin-hub').waitFor();
  // Five mixed completed Spins, counting actual results rather than UI taps.
  for(let i=0;i<5;i++){
   if(i===0)await page.locator('.spin-hub').click();else await page.locator('.rail-category').nth(i%5).click();
   await page.waitForFunction(count=>window.__adTest.spins===count,i+1);assert.equal(await page.evaluate(()=>window.__adTest.shown),0);
  }
  // Menu/profile/favorites/history/Home are not opportunities, even when due.
  await page.locator('.bottom-nav button').last().click();await page.locator('.floating-panel').waitFor();assert.equal(await page.evaluate(()=>window.__adTest.shown),0);
  await page.locator('.panel-close').click();await page.locator('.panel-scrim').waitFor({state:'detached'});
  await page.locator('.bottom-nav button').first().click();await page.locator('.home-scene.scene-visible').waitFor();assert.equal(await page.evaluate(()=>window.__adTest.shown),0);
  if(placement==='central')await page.locator('.spin-hub').click();else if(placement==='category')await page.locator('.rail-category').nth(2).click();else await page.locator('.rail-respin').click();
  await page.waitForFunction(()=>window.__adTest.shown===1);assert.equal(await page.evaluate(()=>window.__adTest.spins),5,'Wheel must wait for native ad close');
  await page.evaluate(()=>window.__adTest.close());await page.waitForFunction(()=>window.__adTest.spins===6);
  assert.equal(await page.evaluate(()=>window.__adTest.shown),1);assert.equal(await page.evaluate(()=>window.__adTest.events.filter(m=>m.event==='home').length),0);
  assert.deepEqual(errors,[]);console.log(`PASS ${placement}: 5 completed spins -> navigation no ad -> next explicit Spin shows one ad -> wheel waits for close -> next result.`);await page.close();
 }
}finally{await browser.close();await new Promise(r=>server.close(r));}
