import {build} from 'esbuild';
import {Miniflare} from 'miniflare';
import {chromium} from 'playwright-core';
import {readFile} from 'node:fs/promises';
import sharp from 'sharp';
import assert from 'node:assert/strict';

const fixture=await build({stdin:{contents:"export {demoCatalog} from './apps/client/src/web/bilingualCatalog';export {publicationIssues} from './packages/shared/src/index';export {createProfile} from './apps/client/src/web/preferences';",resolveDir:process.cwd()},bundle:true,format:'esm',platform:'node',write:false});
const {demoCatalog,createProfile,publicationIssues}=await import('data:text/javascript;base64,'+Buffer.from(fixture.outputFiles[0].contents).toString('base64'));
const built=await build({entryPoints:['services/artwork/worker.ts'],bundle:true,format:'esm',platform:'browser',write:false});
const mf=new Miniflare({modules:true,script:built.outputFiles[0].text,compatibilityDate:'2026-08-01',d1Databases:['CONTENT_DB'],bindings:{RANDOM_STUDIO_PASSWORD:'link-test-password'},serviceBindings:{ASSETS:async request=>{
 const path=new URL(request.url).pathname;
 if(path.includes('..'))return new Response('',{status:400});
 try{const bytes=await readFile('apps/client/preview-dist'+(path==='/'?'/index.html':path));return new Response(bytes,{headers:{'Content-Type':path.endsWith('.js')?'application/javascript':path.endsWith('.css')?'text/css':path.endsWith('.png')?'image/png':'text/html'}});}catch{return new Response('',{status:404});}
}}});
const origin=(await mf.ready).toString(),db=await mf.getD1Database('CONTENT_DB');
await mf.dispatchFetch(origin+'api/database/health');
const bytes=await sharp({create:{width:80,height:120,channels:3,background:'#ae8a76'}}).webp().toBuffer();
const items=['BOOK','WATCH'].map(category=>{
 const item=structuredClone(demoCatalog.find(row=>row.category===category));
 item.id='access-'+category;item.version=2;item.image.path='/media/access-'+category+'.webp';
 delete item.accessLinks;assert.deepEqual(publicationIssues(item),[]);return item;
});
for(const row of items){
 await db.prepare('INSERT INTO random_items(id,dedup,category,data,status,version,updated_at,approved_by,approved_at,revision) VALUES (?,?,?,?,?,?,?,?,?,?)').bind(row.id,row.id,row.category,JSON.stringify(row),'published',2,row.updatedAt,'editor',row.approvedAt,'initial').run();
 await db.prepare('INSERT INTO random_media(path,bytes,mime,hash) VALUES (?,?,?,?)').bind(row.image.path,new Uint8Array(bytes),'image/webp','fixture').run();
}
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try{
 for(const [width,height,locale]of [[320,568,'en'],[390,844,'bs']]){
  const page=await browser.newPage({viewport:{width,height},hasTouch:true,isMobile:true,reducedMotion:'reduce'}),profile={...createProfile(),name:'Links QA',onboarded:true};
  await page.addInitScript(({profile,locale,ids})=>{localStorage.setItem('random-life.local-profile.v1',JSON.stringify(profile));localStorage.setItem('random-life.locale.v1',locale);localStorage.setItem('random-life.experience.'+profile.id,JSON.stringify({favorites:ids,history:[],seen:[]}));},{profile,locale,ids:items.map(row=>row.id)});
  await page.goto(origin);await page.locator('.app-splash').waitFor({state:'detached'});
  for(const item of items){
   await page.locator('[data-nav="favorites"]').click();await page.locator('.saved-item').filter({has:page.locator('[data-item-image="'+item.image.path+'"]')}).click();
   await page.locator('.result-actions .pill-primary').click();const sources=page.locator('.item-access-links');await sources.waitFor();
   const anchors=await sources.locator('a').evaluateAll(nodes=>nodes.map(a=>({url:a.href,label:a.textContent,rel:a.rel})));
   assert(anchors.length>=1);assert(anchors.every(a=>a.label.includes(locale==='en'?'Search':'Pretraži')));
   assert(anchors.every(a=>a.rel.includes('noopener')&&a.url.startsWith('https:')));
   await sources.locator('a').first().scrollIntoViewIfNeeded();const box=await sources.locator('a').first().boundingBox();assert(box.width>100&&box.height>=44&&box.x>=0&&box.x+box.width<=width);
   await page.locator('.detail-controls .icon-button').first().click();
  }
  await page.close();console.log(`PASS ${width}x${height} ${locale}: public book/watch search actions without Studio login, scrollable and touch-sized.`);
 }
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 await page.goto(origin+'#studio');await page.getByLabel('Studio password',{exact:true}).fill('link-test-password');await page.getByRole('button',{name:'Sign in',exact:true}).click();await page.getByText('Editor signed in',{exact:true}).waitFor();
 const stored=await db.prepare('SELECT * FROM random_items WHERE id=?').bind('access-BOOK').first();const book={...JSON.parse(stored.data),id:stored.id,status:stored.status,version:stored.version,updatedAt:stored.updated_at,approvedBy:stored.approved_by,approvedAt:stored.approved_at};
 assert.equal(stored.version,3);assert.equal(stored.status,'published');assert.equal(book.accessLinks.length,2);
 await page.evaluate(book=>localStorage.setItem('random-life.studio-editor.v1',JSON.stringify({selected:book,json:JSON.stringify(book),category:'BOOK'})),book);await page.reload();
 const editor=page.locator('.access-links-editor');await editor.waitFor();await editor.getByText('Add a link',{exact:true}).click();
 await editor.getByLabel('Service or bookshop',{exact:true}).fill('Local Books');await editor.getByLabel('HTTPS URL',{exact:true}).fill('javascript:alert(1)');await editor.getByRole('button',{name:'Apply link to item',exact:true}).click();assert.equal(await editor.getByRole('alert').count(),1);
 await editor.getByLabel('HTTPS URL',{exact:true}).fill('https://books.example/exact-edition');await editor.getByLabel('Country (optional, e.g. BA)',{exact:true}).fill('BA');await editor.getByLabel('I checked that this link matches the title / edition.',{exact:true}).check();await editor.getByRole('button',{name:'Apply link to item',exact:true}).click();
 assert.equal(await editor.locator('.access-link-rows li').count(),3);
 await editor.locator('.access-link-rows li').last().getByRole('button',{name:'Edit',exact:true}).click();await editor.getByLabel('HTTPS URL',{exact:true}).fill('https://books.example/correct-edition');assert.equal(await editor.getByRole('checkbox').isChecked(),false);
 await editor.getByRole('checkbox').check();await editor.getByRole('button',{name:'Apply link to item',exact:true}).click();
 await page.locator('.publish-action button').click();await page.locator('.publish-feedback[data-outcome="published"]').waitFor();assert.equal(await page.locator('.access-links-editor').count(),0,'successful publish clears existing-item fields');
 const catalog=await(await mf.dispatchFetch(origin+'api/catalog')).json(),published=catalog.items.find(row=>row.id==='access-BOOK');
 assert.equal(published.status,'published');assert(published.accessLinks.some(link=>link.provider==='Local Books'&&link.verified&&link.url.endsWith('correct-edition')));
 const events=await db.prepare("SELECT * FROM random_events WHERE action='access-links-upgrade'").all();assert.equal(events.results.length,2);
 console.log('PASS Studio login → idempotent D1 upgrade → manual link checks/edit reset → publish → public direct link; prior approvals preserved.');
 await page.close();
}finally{await browser.close();await mf.dispose();}
