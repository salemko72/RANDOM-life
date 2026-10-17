import {build} from 'esbuild';
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
const fixture=await build({stdin:{contents:"export {createProfile} from './apps/client/src/web/preferences';export {demoCatalog} from './apps/client/src/web/bilingualCatalog';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',write:false});
const {createProfile,demoCatalog}=await import('data:text/javascript;base64,'+Buffer.from(fixture.outputFiles[0].contents).toString('base64'));
const items=['EAT','BOOK','WATCH','MOVE','GO'].map(category=>{const row=structuredClone(demoCatalog.find(r=>r.category===category));return {...row,status:'published',factsVerified:true,translations:Object.fromEntries(Object.entries(row.translations).map(([key,value])=>[key,{...value,reviewed:true}])),image:{...row.image,rightsConfirmed:true}};});
const html=await readFile('apps/client/preview-dist/RANDOM_INTERACTIVE_PREVIEW.html');
const server=createServer(async(req,res)=>{if(req.url.startsWith('/api/')){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({items,configured:true,ok:true,authenticated:false}));}else if(req.url.startsWith('/media/')){res.statusCode=404;res.end();}else if(req.url.startsWith('/terms.html')||req.url.startsWith('/privacy.html')){res.setHeader('Content-Type','text/html');res.end(await readFile('apps/client/public/legal/'+req.url.split('?')[0].slice(1)));}else{res.setHeader('Content-Type','text/html');res.end(html);}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const url='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
await mkdir('/workspace/shared/launch-preview',{recursive:true});
try{
 for(const [width,height,locale]of [[390,844,'en'],[320,568,'bs'],[360,640,'bs'],[375,667,'en'],[412,915,'bs']]){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});const page=await context.newPage();const profile={...createProfile(),name:'Salem',onboarded:true};
  await page.addInitScript(({profile,locale})=>{localStorage.setItem('random-life.local-profile.v1',JSON.stringify(profile));localStorage.setItem('random-life.locale.v1',locale);},{profile,locale});
  const start=Date.now();await page.clock.install({time:start});await page.clock.pauseAt(start+1000);await page.goto(url);await page.locator('.app-splash').waitFor();assert.equal(await page.locator('.main-stage').count(),0);assert.equal(await page.locator('.splash-wordmark h1').innerText(),'RANDOM\nlife');
  if(width===390)await page.screenshot({path:'/workspace/shared/launch-preview/splash.png'});
  await page.clock.runFor(1800);assert.equal(await page.locator('.main-stage').count(),0,'home must stay hidden for two seconds');
  await page.clock.runFor(250);await page.locator('.category-rail').waitFor();await page.clock.runFor(1100);
  assert.equal(await page.locator('.app-splash').count(),0);assert.equal(await page.locator('.category-pictogram svg').count(),5);assert.equal(await page.locator('.category-rail .category-photo').count(),0);
  const labels=await page.locator('.rail-label').allTextContents();assert.deepEqual(labels,locale==='bs'?['HRANA','KNJIGE','GLEDAJ','POKRENI SE','IZAĐI']:['EAT','READ','WATCH','MOVE','GO']);
  const layout=await page.locator('.rail-category').evaluateAll(buttons=>buttons.map(button=>{const circle=button.querySelector('.category-pictogram'),label=button.querySelector('.rail-label'),r=button.getBoundingClientRect(),c=circle.getBoundingClientRect(),l=label.getBoundingClientRect(),style=getComputedStyle(label);return {label:label.textContent,button:{top:r.top,bottom:r.bottom,width:r.width},circle:{width:c.width,height:c.height},labelBox:{top:l.top,bottom:l.bottom,width:l.width,scrollWidth:label.scrollWidth},fontSize:parseFloat(style.fontSize)};}));
  for(const row of layout){assert(Math.abs(row.circle.width-row.circle.height)<1,row.label+' circle must be round');assert(row.fontSize>=10.5);assert(row.button.width>=44);assert(row.labelBox.scrollWidth<=row.labelBox.width+1,row.label+' text overflows');assert(row.button.bottom<height-44,row.label+' must remain above footer controls');}
  const controls=await page.locator('.rail-respin,.studio-link').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {top:r.top,bottom:r.bottom};}));assert(layout.at(-1).button.bottom<=controls[0].top,'categories overlap spin again');assert(controls.at(-1).bottom<=height,'Studio link off-screen');if(height<=790){const hub=await page.locator('.spin-hub').boundingBox();const caption=await page.locator('.wheel-caption').boundingBox();assert(hub.y+hub.height<=caption.y+2,'caption covers the spin control');}
  if(width===320||width===390)await page.screenshot({path:`/workspace/shared/launch-preview/home-${width}-${locale}.png`});
  await page.getByRole('button',{name:locale==='en'?'READ':'KNJIGE',exact:true}).click();await page.clock.runFor(9000);await page.locator('.result-scene.category-read.scene-visible').waitFor();
  await context.close();console.log(`PASS ${width}x${height} ${locale}: two-second splash, five readable circular SVG controls and READ selection.`);
 }
 const fresh=await browser.newPage({viewport:{width:390,height:844}});await fresh.goto(url);await fresh.locator('.app-splash').waitFor();assert.equal(await fresh.locator('.onboarding-screen').count(),0);await fresh.locator('input[autocomplete="given-name"]').waitFor();await fresh.close();
 const studio=await browser.newPage();await studio.goto(url+'/#studio');await studio.locator('.preview-studio-shell').waitFor();assert.equal(await studio.locator('.app-splash').count(),0);await studio.close();
 console.log('PASS fresh-user onboarding follows splash; direct Studio skips splash.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
