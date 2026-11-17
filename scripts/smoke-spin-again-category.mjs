import {build} from 'esbuild';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';

const fixture=await build({stdin:{contents:"export {createProfile} from './apps/client/src/web/preferences';export {demoCatalog} from './apps/client/src/web/bilingualCatalog';export {publicationIssues} from './packages/shared/src/content';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',write:false});
const {createProfile,demoCatalog,publicationIssues}=await import('data:text/javascript;base64,'+Buffer.from(fixture.outputFiles[0].contents).toString('base64'));
const categories=['EAT','READ','WATCH','MOVE','GO'];
const items=categories.flatMap(category=>Array.from({length:3},(_,index)=>{
 const row=structuredClone(demoCatalog.find(row=>row.category===(category==='READ'?'BOOK':category)));
 return {...row,id:`respin-${category}-${index}`,status:'published',factsVerified:true,translations:Object.fromEntries(Object.entries(row.translations).map(([key,value])=>[key,{...value,reviewed:true}])),image:{...row.image,rightsConfirmed:true}};
}));
for(const row of items)assert.deepEqual(publicationIssues(row),[]);
const html=await readFile('apps/client/preview-dist/RANDOM_INTERACTIVE_PREVIEW.html');
const server=createServer((req,res)=>{
 if(req.url==='/api/catalog/manifest'){res.writeHead(404).end();return;}
 if(req.url.startsWith('/api/')){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({items,ok:true}));return;}
 if(req.url.startsWith('/media/')){res.writeHead(404).end();return;}
 res.setHeader('Content-Type','text/html');res.end(html);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
try{
 for(const locale of ['en','bs']){
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  const profile={...createProfile(),name:'Respin QA',onboarded:true};
  await page.addInitScript(({profile,locale})=>{localStorage.setItem('random-life.local-profile.v1',JSON.stringify(profile));localStorage.setItem('random-life.locale.v1',locale);Math.random=()=>0;},{profile,locale});
  const now=Date.now();await page.clock.install({time:now});await page.clock.pauseAt(now+1000);
  await page.goto('http://127.0.0.1:'+server.address().port);
  await page.locator('.app-splash').waitFor();await page.clock.runFor(2050);await page.locator('.main-stage').waitFor();await page.clock.runFor(1100);await page.waitForFunction(()=>document.querySelector('.catalog-online'));
  async function result(){
   for(let i=0;i<40;i++){
    await page.clock.runFor(250);await page.waitForTimeout(10);
    if(await page.locator('.result-scene.scene-visible').isVisible()&&!await page.locator('.rail-respin').isDisabled())return;
   }
   throw Error('Spin did not finish');
  }
  // Pass a self-contained callback: browser evaluation does not share Node scope.
  async function current(){return page.locator('.result-scene.scene-visible').evaluate(el=>el.className.match(/category-(eat|read|watch|move|go)/)?.[1].toUpperCase());}
  async function history(){return page.evaluate(()=>{const p=JSON.parse(localStorage.getItem('random-life.local-profile.v1'));return JSON.parse(localStorage.getItem('random-life.experience.'+p.id)).history;});}
  for(const category of categories){
   await page.locator('.rail-category').nth(categories.indexOf(category)).click();await result();assert.equal(await current(),category);
   const first=(await history()).at(-1);
   await page.locator('.rail-respin').click();await result();
   assert.equal(await current(),category,`Spin again left ${category} (${locale})`);
   const second=(await history()).at(-1);assert.notEqual(second,first,'Spin again should choose an unseen item while available');
   await page.locator('.rail-respin').click();await result();assert.equal(await current(),category,`Repeated spin left ${category} (${locale})`);
   const third=(await history()).at(-1);assert.equal(new Set([first,second,third]).size,3,'Seen cycle must retain all three distinct choices');
   await page.locator('.rail-respin').click();await result();assert.equal(await current(),category,'Category remains when the unseen cycle wraps');
  }
  await page.locator('.bottom-nav button').first().click();
  await page.locator('.rail-respin').click();await page.waitForTimeout(40);
  assert.equal(await page.locator('[data-wheel-mode="categories"]').count(),1,'Home rail spin remains general');await result();
  await page.locator('.bottom-nav button').first().click();
  await page.locator('.spin-hub').click();await page.waitForTimeout(40);
  assert.equal(await page.locator('[data-wheel-mode="categories"]').count(),1,'Central home spin remains general');await result();
  await page.close();console.log(`PASS ${locale}: all five categories, repeat, unseen items, exhausted-cycle wrap, switching categories, and general home spins`);
 }
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
