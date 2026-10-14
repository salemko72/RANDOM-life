import{reopenLastSaved}from'./browser-helpers.mjs';
import{zipSync,strToU8}from'fflate';
import {enterDemo} from './browser-helpers.mjs';
import {chromium} from 'playwright-core';
import {createServer} from 'node:http';
import {readFile,stat,mkdir} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import assert from 'node:assert/strict';
const root=resolve('apps/client/preview-dist');
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png'};
const server=createServer(async(req,res)=>{try{const path=resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403).end();return;}const file=(await stat(path)).isDirectory()?resolve(path,'index.html'):path;res.setHeader('Content-Type',mime[extname(file)]??'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const url=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH??'/usr/bin/chromium',args:['--no-sandbox']});
const shots=resolve(root,'screenshots');await mkdir(shots,{recursive:true});
const errors=[];
try {
 const p=await browser.newPage({viewport:{width:1280,height:1080}});p.on('pageerror',e=>errors.push(e.message));
 const shot=async(name)=>{await p.waitForTimeout(650);await p.screenshot({path:resolve(shots,name+'.png'),fullPage:true});};
 await p.addInitScript(()=>{Math.random=()=>0;});await p.goto(url);await p.evaluate(()=>document.fonts.ready);await shot('login');
 await enterDemo(p);await p.waitForTimeout(550);
 assert.equal(await p.getByRole('button',{name:'DO — uskoro',exact:true}).count(),0);assert.equal(await p.locator('.rail-category').count(),5);
 assert(await p.locator('.category-eat').first().evaluate(e=>getComputedStyle(e).backgroundImage!=='none'));await shot('home');
 await p.getByRole('button',{name:'Zavrti wheel',exact:true}).click();assert(await p.getByRole('button',{name:'Wheel se okreće'}).isDisabled());
 assert(await p.getByRole('link',{name:'Otvori Content Studio'}).evaluate(e=>e.classList.contains('disabled')));
 const visited=new Set();for(let n=0;n<12;n++){visited.add(await p.locator('.rail-category.selected').getAttribute('aria-label'));await p.waitForTimeout(180);}assert(visited.size>=3,'Highlight must track actual wheel sectors');
 await p.getByRole('button',{name:'KUHAJMO'}).waitFor({timeout:15000});assert(await p.locator('.result-copy').getByText('Mercimek čorbasi',{exact:false}).count());assert.equal(await p.locator('.rail-category.selected').getAttribute('aria-label'),'EAT');await shot('eat');
 await p.getByRole('button',{name:'KUHAJMO'}).click();await shot('recipe');await p.getByRole('dialog',{name:'Sastojci'}).getByText('Crvena leća',{exact:true}).waitFor();await shot('ingredients');
 await p.getByRole('button',{name:'Zatvori panel'}).click();await p.waitForTimeout(300);await p.getByRole('button',{name:'READ',exact:true}).click();await p.getByRole('button',{name:'PROČITAJ OVU KNJIGU'}).waitFor({timeout:15000});assert.equal(await p.locator('.rail-category.selected').getAttribute('aria-label'),'READ');await shot('learn');
 await p.getByRole('button',{name:'PROČITAJ OVU KNJIGU'}).click();await shot('book');await p.getByRole('button',{name:'ISTI AUTOR',exact:true}).click();await p.getByRole('button',{name:'Zatvori panel'}).click();await p.waitForTimeout(250);await p.setViewportSize({width:390,height:844});await shot('mobile-book');assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow');
 await p.getByRole('link',{name:'Otvori Content Studio'}).click();await p.getByRole('heading',{name:'Tvoj urednički stol.'}).waitFor();await p.setViewportSize({width:1360,height:1100});await p.locator('.prompt-builder').evaluate(e=>e.open=true);await p.getByRole('button',{name:'Učitaj demo nacrt'}).click();
 const editor=p.getByLabel('Podaci iz uvezenog paketa');const sample=JSON.parse(await editor.inputValue());sample.title='Browser QA soup';sample.translations.en.title='Browser QA soup';sample.translations.bs.title='Browser QA soup';sample.image.path='/media/image.png';const zip=zipSync({'content.json':strToU8(JSON.stringify(sample)),'image.png':new Uint8Array(await readFile('apps/client/src/web/assets/lentil-soup.png'))});await p.getByLabel('ChatGPT ZIP sadržaja').setInputFiles({name:'random-soup.zip',mimeType:'application/zip',buffer:Buffer.from(zip)});await p.getByTestId('zip-import-status').getByText('ZIP učitan za pregled',{exact:false}).waitFor();
 await p.getByLabel('Provjerio/la sam činjenice i izvor').check();await p.getByLabel('Provjerio/la sam sastojke i alergene').check();await p.getByLabel('Potvrđujem prava na sliku').check();await p.getByLabel('Provjerio/la sam ENG prevod').check();await p.getByLabel('Provjerio/la sam BHS prevod').check();await p.getByRole('button',{name:'OBJAVI · snimi u bazu',exact:true}).click();await p.locator('.item').filter({hasText:'Browser QA soup'}).getByText('Objavljeno',{exact:true}).waitFor();await shot('studio');
 await p.getByRole('link',{name:'Nazad u RANDOM'}).click();await p.emulateMedia({reducedMotion:'reduce'});const selectedTitles=[];
 for(let n=0;n<5;n++){
  const old=await p.locator('.result-copy h2').textContent();await p.getByRole('button',{name:'EAT',exact:true}).click();
  await p.waitForFunction(old=>{const e=document.querySelector('.result-scene.scene-visible .result-copy h2');return e&&e.textContent!==old;},old);
  const title=await p.locator('.result-copy h2').textContent();selectedTitles.push(title);
  if(title.includes('Browser QA soup'))assert((await p.locator('.feature-photo').getAttribute('style')).includes('blob:'),'Imported image must be shown');
 }
 assert(selectedTitles.some(t=>t.includes('Browser QA soup')),'Published content must join the demo catalog');assert.equal(new Set(selectedTitles).size,5);
 await p.getByRole('button',{name:'EAT',exact:true}).click();await p.getByRole('status').waitFor();assert(await p.getByRole('status').getByText('Nema novog izbora',{exact:false}).count());await p.getByRole('button',{name:'Vrati prethodne prijedloge'}).click();
 await p.getByRole('link',{name:'Otvori Content Studio'}).click();await p.locator('.library .item').filter({hasText:'Browser QA soup'}).click();await p.locator('.item').filter({hasText:'Browser QA soup'}).getByText('Objavljeno',{exact:true}).waitFor();const current=JSON.parse(await p.getByLabel('Podaci iz uvezenog paketa').inputValue());await p.getByLabel('Prevedeni opis',{exact:false}).fill('Updated browser summary');await p.getByRole('button',{name:'OBJAVI · snimi u bazu',exact:true}).click();await p.locator('.library .item').filter({hasText:'Browser QA soup'}).getByText('Na pregledu',{exact:true}).waitFor();await p.getByRole('button',{name:'Povuci iz objave'}).waitFor({state:'detached'});assert.equal(await p.getByRole('button',{name:'Povuci iz objave'}).count(),0);
 assert.deepEqual(errors,[],'No unhandled browser errors');
 const offline=await browser.newPage({viewport:{width:430,height:932},reducedMotion:'reduce'});await offline.goto(url+'/RANDOM_INTERACTIVE_PREVIEW.html');await enterDemo(offline);await offline.getByRole('button',{name:'EAT',exact:true}).click();await offline.getByRole('button',{name:'KUHAJMO'}).waitFor();assert(await offline.locator('.rail-category .category-eat').first().evaluate(async e=>{const image=new Image();image.src=getComputedStyle(e).backgroundImage.slice(5,-2);await image.decode();return image.naturalWidth>0;}),'Embedded image must decode, not merely have a CSS URL');
 console.log('PASS: visual UI, real wheel tracking, EAT/LEARN, details/ingredients, mobile, Studio upload-review-publish-edit, live catalog, fallback, reduced motion, offline HTML.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
