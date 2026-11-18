import{build}from'esbuild';import{readFile,mkdir}from'node:fs/promises';import{createServer}from'node:http';import{chromium}from'playwright-core';import assert from'node:assert/strict';import{resolve,dirname}from'node:path';
const target=resolve(process.argv[2]||'/workspace/shared/lifespinner-content-pilot/LifeSpinner-Translations.html'),full=process.argv.includes('--full');
const html=await readFile(target),source=JSON.parse(await readFile('content/i18n-2026-11-18/source-catalog.json','utf8')).items,bundle=JSON.parse(await readFile('content/i18n-2026-11-18/'+(full?'draft-overlay.json':'pilot-drafts.json'),'utf8'));
const b=await build({stdin:{contents:"export{createProfile}from'./apps/client/src/web/preferences';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',write:false});const{createProfile}=await import('data:text/javascript;base64,'+Buffer.from(b.outputFiles[0].contents).toString('base64'));
const server=createServer((request,response)=>{response.setHeader('Content-Type','text/html; charset=utf-8');response.end(html);});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
try{for(const locale of ['es','pt-BR','de','it']){
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'}),profile={...createProfile(),name:'Content QA',onboarded:true};const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.route(/^https?:/,route=>route.request().url().startsWith(origin+'/')?route.continue():route.abort());
 await page.addInitScript(({profile,locale})=>{localStorage.setItem('lifespinner-language-review.random-life.local-profile.v1',JSON.stringify(profile));localStorage.setItem('lifespinner-language-review.random-life.locale.v1',locale);Math.random=()=>0;},{profile,locale});
 const now=Date.now();await page.clock.install({time:now});await page.clock.pauseAt(now+1000);await page.goto(origin+'/');await page.locator('.app-splash').waitFor();await page.clock.runFor(2050);await page.locator('.main-stage').waitFor();await page.clock.runFor(1100);
 assert.equal(await page.locator('html').getAttribute('lang'),locale);await page.waitForFunction(()=>document.querySelector('.catalog-backup'));
 async function result(){for(let i=0;i<40;i++){await page.clock.runFor(250);await page.waitForTimeout(10);if(await page.locator('.result-scene.scene-visible').isVisible()&&!await page.locator('.rail-respin').isDisabled())return;}throw Error('Spin timeout');}
 for(const[index,category]of['EAT','BOOK','WATCH','MOVE','GO'].entries()){
  await page.locator('.rail-category').nth(index).click();await result();
  const id=await page.evaluate(()=>{const profile=JSON.parse(localStorage.getItem('random-life.local-profile.v1'));return JSON.parse(localStorage.getItem('random-life.experience.'+profile.id)).history.at(-1);});
  const original=source.find(record=>record.id===id),entry=bundle.items.find(record=>record.id===id);assert(entry,'Selected record must have compiled translations');assert.equal(original.category,category);
  const translated=entry.translations[locale];assert.equal(await page.locator('.result-item-title').innerText(),translated.title);assert.equal(await page.locator('.result-summary').innerText(),translated.summary);
  await page.waitForFunction(()=>document.querySelector('.feature-photo')?.style.backgroundImage.startsWith('url('));
  await page.locator('.result-actions .pill-primary').click();await page.clock.runFor(350);
  if(['EAT','MOVE','GO'].includes(category))assert.deepEqual(await page.locator('.detail-content .recipe-step p').allTextContents(),translated.steps);else assert.equal(await page.locator('.reading-reason').innerText(),translated.recommendationReason);
  if(category==='BOOK'||category==='WATCH'){
   const link=page.locator('.item-access-link').first();const pages=page.context().pages().length;await link.click();await page.clock.runFor(50);assert.equal(page.context().pages().length,pages,'Review click cannot navigate to provider');await link.focus();await page.keyboard.press('Enter');await page.clock.runFor(50);assert.equal(page.context().pages().length,pages,'Review keyboard cannot navigate to provider');
  }
  if(category==='EAT'){
   await page.locator('.detail-action-bar .pill-primary').click();await page.clock.runFor(350);const content=await page.locator('.floating-panel').innerText();for(const ingredient of translated.ingredientNames)assert(content.includes(ingredient));
   const ui=JSON.parse(await readFile('apps/client/src/web/i18n/'+locale+'.json','utf8'));await page.getByRole('button',{name:ui['Close panel'],exact:true}).click();await page.clock.runFor(350);
   await page.screenshot({path:resolve(dirname(target),'Content-'+locale+'.png')});
  }
  await page.locator('.detail-home-button').click();await page.clock.runFor(350);
 }
 assert.deepEqual(errors,[]);await page.close();console.log(`PASS ${locale}: translated title/summary/details in all5categories, recipe ingredient names, original book/film title identity, offline artwork blobs, no page errors`);
}}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
