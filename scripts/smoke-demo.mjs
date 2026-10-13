import {chromium} from 'playwright-core';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const root='apps/client/preview-dist/';
const server=createServer(async(q,r)=>{if(!['/RANDOM_INTERACTIVE_PREVIEW.html','/RANDOM_CONTENT_STUDIO.html'].includes(q.url)){r.writeHead(404).end();return;}r.setHeader('Content-Type','text/html');r.end(await readFile(root+q.url.slice(1)));});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const p=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(`http://127.0.0.1:${server.address().port}/RANDOM_INTERACTIVE_PREVIEW.html`);await p.getByRole('button',{name:'UĐI U RANDOM'}).click();
 for(const category of ['EAT','LEARN']){
  const titles=[];
  for(let i=0;i<5;i++){
   const old=await p.locator('.result-copy h2').textContent().catch(()=>null);
   await p.getByRole('button',{name:category,exact:true}).click();
   await p.waitForFunction(old=>{const e=document.querySelector('.result-scene.scene-visible .result-copy h2');return e&&e.textContent!==old},old);
   titles.push(await p.locator('.result-copy h2').textContent());
   assert(await p.locator('.feature-photo').evaluate(async e=>{const image=new Image();image.src=getComputedStyle(e).backgroundImage.slice(5,-2);await image.decode();return image.naturalWidth>0;}),'Every selected image must decode');
  }
  assert.equal(new Set(titles).size,5);
  console.log(category+': '+titles.join(' | '));
 }
 assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await p.goto(`http://127.0.0.1:${server.address().port}/RANDOM_CONTENT_STUDIO.html`);await p.getByRole('heading',{name:'Tvoj urednički stol.'}).waitFor();assert.deepEqual(errors,[]);
 console.log('PASS: all ten unique demo choices, decoded embedded photos, phone width, separate Studio HTML.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
