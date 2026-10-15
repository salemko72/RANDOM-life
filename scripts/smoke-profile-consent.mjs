import{createServer}from'node:http';import{readFile}from'node:fs/promises';import{chromium}from'playwright-core';import assert from'node:assert/strict';
const html=await readFile('apps/client/preview-dist/RANDOM_INTERACTIVE_PREVIEW.html');const server=createServer((req,res)=>{if(req.url.startsWith('/api/')){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({items:[],configured:true,ok:true,authenticated:false}));}else{res.setHeader('Content-Type','text/html');res.end(html);}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const url='http://127.0.0.1:'+server.address().port;
try{
 for(const mode of ['guest','diet','personalized']){
  const context=await browser.newContext({viewport:{width:390,height:844}});const page=await context.newPage();page.setDefaultTimeout(10000);await page.goto(url);
  await page.locator('input[autocomplete="given-name"]').fill('Salem');await page.getByRole('button',{name:'CONTINUE',exact:true}).click();
  await page.getByRole('button',{name:'Continue without profiling',exact:true}).waitFor();
  if(mode==='guest')await page.getByRole('button',{name:'Continue without profiling',exact:true}).click();
  if(mode==='diet'){
   await page.getByRole('button',{name:'Set dietary filters only',exact:true}).click();await page.getByLabel('Vegan recipes only',{exact:true}).check();await page.getByLabel('Low-phosphate diet',{exact:true}).check();await page.getByRole('button',{name:'ENTER RANDOM',exact:true}).click();
  }
  if(mode==='personalized'){
   await page.getByRole('button',{name:'Personalize my suggestions',exact:true}).click();await page.getByRole('button',{name:'EAT',exact:true}).click();await page.getByRole('button',{name:'CONTINUE',exact:true}).click();
   const learning=page.getByLabel('Learn from my choices on this device',{exact:true});assert.equal(await learning.isChecked(),false);await learning.check();await page.getByRole('button',{name:'ENTER RANDOM',exact:true}).click();
  }
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('random-life.local-profile.v1')??'{}').onboarded===true);
  const profile=await page.evaluate(()=>JSON.parse(localStorage.getItem('random-life.local-profile.v1')));assert.equal(profile.personalization,mode==='personalized');assert.equal(profile.learning,mode==='personalized');assert.equal(profile.vegan,mode==='diet');assert.equal(profile.lowPhosphateDiet,mode==='diet');
  await page.reload();await page.waitForTimeout(500);assert.equal(await page.locator('.onboarding-screen').count(),0);await context.close();
 }
 console.log('PASS mobile onboarding: guest, dietary-only, explicit personalization, optional learning and return persistence.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
