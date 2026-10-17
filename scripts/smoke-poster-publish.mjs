import {build} from 'esbuild';
import {Miniflare} from 'miniflare';
import {chromium} from 'playwright-core';
import {readFile} from 'node:fs/promises';
import sharp from 'sharp';
import assert from 'node:assert/strict';
const fixture=await build({stdin:{contents:"export {demoCatalog} from './apps/client/src/web/bilingualCatalog';",resolveDir:process.cwd()},bundle:true,format:'esm',platform:'node',write:false});
const {demoCatalog}=await import('data:text/javascript;base64,'+Buffer.from(fixture.outputFiles[0].contents).toString('base64'));
const built=await build({entryPoints:['services/artwork/worker.ts'],bundle:true,format:'esm',platform:'browser',write:false});
const mf=new Miniflare({modules:true,script:built.outputFiles[0].text,compatibilityDate:'2026-08-01',d1Databases:['CONTENT_DB'],bindings:{RANDOM_STUDIO_PASSWORD:'poster-test-password'},serviceBindings:{ASSETS:async request=>{
 const path=new URL(request.url).pathname;if(path.includes('..'))return new Response('',{status:400});
 try{const body=await readFile('apps/client/preview-dist'+(path==='/'?'/index.html':path));return new Response(body,{headers:{'Content-Type':path.endsWith('.js')?'application/javascript':path.endsWith('.css')?'text/css':path.endsWith('.png')?'image/png':'text/html'}});}catch{return new Response('',{status:404});}
}}});
const origin=(await mf.ready).toString();
const login=await mf.dispatchFetch(origin+'api/database/login',{method:'POST',headers:{Origin:new URL(origin).origin,'Content-Type':'application/json'},body:JSON.stringify({password:'poster-test-password'})});
const cookie=login.headers.get('set-cookie').split(';')[0];
async function api(path,method='GET',data){const response=await mf.dispatchFetch(origin+path,{method,headers:{Origin:new URL(origin).origin,Cookie:cookie,'Content-Type':'application/json'},body:data===undefined?undefined:JSON.stringify(data)});assert(response.ok,`${path}: ${response.status}`);return response.json();}
const oldBytes=await sharp({create:{width:80,height:120,channels:3,background:'#9d765d'}}).webp().toBuffer();
const cover=await sharp({create:{width:180,height:260,channels:3,background:'#37516d'}}).jpeg().toBuffer();
await mf.dispatchFetch(origin+'api/database/media/original.webp',{method:'PUT',headers:{Origin:new URL(origin).origin,Cookie:cookie,'Content-Type':'image/webp'},body:oldBytes});
const input={...structuredClone(demoCatalog.find(row=>row.category==='BOOK')),image:{...demoCatalog.find(row=>row.category==='BOOK').image,path:'/media/original.webp'}};
const initial=(await api('api/content','POST',{input})).item;
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1100,height:850}});page.setDefaultTimeout(10000);
 await page.route('**/api/artwork?*',route=>route.fulfill({json:{state:'ready',candidates:[{id:'/works/OL1W',title:input.translations.en.title,author:input.authors[0],provider:'Open Library',imageUrl:'https://covers.openlibrary.org/b/id/42-L.jpg',sourceUrl:'https://openlibrary.org/works/OL1W',attribution:'Test cover',exact:true}]}}));
 await page.route('**/api/artwork-image?*',route=>route.fulfill({body:cover,contentType:'image/jpeg'}));
 await page.goto(origin+'#studio');await page.getByLabel('Studio password',{exact:true}).fill('poster-test-password');await page.getByRole('button',{name:'Sign in',exact:true}).click();await page.getByText('Editor signed in',{exact:true}).waitFor();
 async function edit(item,selected){await page.evaluate(({item,selected})=>localStorage.setItem('random-life.studio-editor.v1',JSON.stringify({category:'BOOK',selected,json:JSON.stringify(item)})),{item,selected});await page.reload();await page.getByRole('button',{name:'Find book cover',exact:true}).click();await page.waitForFunction(path=>{try{return JSON.parse(document.querySelector('.package-data textarea')?.value||'{}').image?.path!==path&&!!document.querySelector('.image-file-details');}catch{return false;}},item.image.path);await page.waitForFunction(()=>!document.querySelector('.editor-lock')?.disabled);await page.locator('.editor fieldset').getByRole('checkbox',{name:'I confirm the image rights',exact:true}).check();}
 // Reimporting an existing title is a duplicate, not a successful image update.
 await edit(initial,null);const pending=JSON.parse(await page.locator('.package-data textarea').inputValue());assert.notEqual(pending.image.path,initial.image.path);
 const duplicateResponse=page.waitForResponse(response=>response.url().endsWith('/api/content')&&response.request().method()==='POST');await page.locator('.publish-action button').click();assert.equal((await(await duplicateResponse).json()).duplicate,true);
 await page.waitForFunction(()=>!document.querySelector('.editor-lock')?.disabled);
 assert.equal(await page.locator('.package-data textarea').count(),1,'duplicate publish must preserve the pending cover and editor');
 assert.equal(JSON.parse(await page.locator('.package-data textarea').inputValue()).image.path,pending.image.path);
 await page.getByRole('button',{name:'Apply these changes to the existing item',exact:true}).click();
 await page.locator('.publish-action button').click();await page.locator('.publish-feedback[data-outcome="published"]').waitFor();
 let stored=(await api('api/content')).items.find(row=>row.id===initial.id);assert.equal(stored.image.path,pending.image.path);assert.equal(stored.status,'published');assert.equal(stored.id,initial.id);
 const media=await mf.dispatchFetch(origin.slice(0,-1)+stored.image.path);assert.equal(media.status,200);assert((await media.arrayBuffer()).byteLength>0);
 // Editing an existing item must retain its identity and show the saved cover.
 await edit(stored,stored);const edited=JSON.parse(await page.locator('.package-data textarea').inputValue());await page.locator('.publish-action button').click();await page.locator('.publish-feedback[data-outcome="published"]').waitFor();
 stored=(await api('api/content')).items.find(row=>row.id===initial.id);assert.equal(stored.image.path,edited.image.path);assert.notEqual(stored.image.path,pending.image.path);assert.equal(stored.version,3);
 assert.equal(await page.locator('.review-preview').count(),1,'editing keeps the saved item in view');
 // A review save must explain why it is not published, without losing edits.
 const incomplete=structuredClone(stored);incomplete.translations.bs.reviewed=false;await edit(incomplete,incomplete);await page.locator('.publish-action button').click();await page.locator('.publish-feedback[data-outcome="review"]').waitFor();
 assert.match(await page.locator('.publish-feedback').innerText(),/BS translation requires human review/);
 assert.equal(await page.locator('.review-preview').count(),1);
 stored=(await api('api/content')).items.find(row=>row.id===initial.id);
 await edit(stored,stored);const conflicted=JSON.parse(await page.locator('.package-data textarea').inputValue());
 await api('api/content','POST',{id:stored.id,version:stored.version,input:{...stored,summary:'Concurrent editor update'}});
 await page.locator('.publish-action button').click();await page.locator('.publish-feedback[data-outcome="error"]').waitFor();
 assert.match(await page.locator('.publish-feedback').innerText(),/changed in another editor/);
 assert.equal(JSON.parse(await page.locator('.package-data textarea').inputValue()).image.path,conflicted.image.path);
 const newBook=structuredClone(initial);delete newBook.isbn;newBook.title='New test book';newBook.translations.en.title='New test book';newBook.translations.bs.title='Nova testna knjiga';
 await edit(newBook,null);await page.locator('.publish-action button').click();await page.locator('.publish-feedback[data-outcome="published"]').waitFor();
 assert.equal(await page.locator('.package-data textarea').count(),0,'new item still clears its form');
 assert.equal((await api('api/content')).items.length,2);
 console.log('PASS duplicate cover preserved → explicit update same ID → public D1 media; existing cover replacement persists; review issues and conflicts visible; new items clear their form.');
 await page.close();
}finally{await browser.close();await mf.dispose();}
