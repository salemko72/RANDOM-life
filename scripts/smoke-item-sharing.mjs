import {build} from 'esbuild';import {Miniflare} from 'miniflare';import {chromium} from 'playwright-core';import {readFile,mkdir} from 'node:fs/promises';import sharp from 'sharp';import assert from 'node:assert/strict';
const {items:catalog}=JSON.parse(await readFile('apps/client/src/web/backup/catalog.json','utf8'));
const records=['EAT','BOOK','WATCH','MOVE','GO'].map(category=>structuredClone(catalog.find(r=>r.category===category)));
const result=await build({entryPoints:['services/artwork/worker.ts'],bundle:true,platform:'browser',format:'esm',write:false});
const mf=new Miniflare({modules:true,script:result.outputFiles[0].text,compatibilityDate:'2026-08-01',d1Databases:['CONTENT_DB'],serviceBindings:{ASSETS:async request=>{const path=new URL(request.url).pathname;try{return new Response(await readFile('apps/client/preview-dist'+(path==='/'?'/index.html':path)),{headers:{'Content-Type':path.endsWith('.js')?'application/javascript':path.endsWith('.css')?'text/css':path.endsWith('.webp')?'image/webp':'text/html'}});}catch{return new Response('',{status:404});}}}});
const origin=(await mf.ready).toString(),db=await mf.getD1Database('CONTENT_DB');await mf.dispatchFetch(origin+'api/database/health');
const bytes=await sharp({create:{width:400,height:600,channels:3,background:'#bc827b'}}).webp().toBuffer();
for(const row of records){await db.prepare('INSERT INTO random_items(id,dedup,category,data,status,version,updated_at,approved_by,approved_at,revision) VALUES (?,?,?,?,?,?,?,?,?,?)').bind(row.id,row.id,row.category,JSON.stringify(row),'published',row.version,row.updatedAt,'test-editor','2026-10-18T00:00:00Z','test').run();await db.prepare('INSERT INTO random_media(path,bytes,mime,hash) VALUES (?,?,?,?)').bind(row.image.path,[...bytes],'image/webp','test').run();}
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});await mkdir('/workspace/shared/item-sharing',{recursive:true});
try{
 for(const [width,lang]of [[320,'bs'],[390,'en']]){
 const page=await browser.newPage({viewport:{width,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});let catalogs=0;const errors=[];page.on('request',r=>{if(r.url().includes('/api/catalog'))catalogs++;});page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.__shares=[];Object.defineProperty(navigator,'share',{value:async data=>window.__shares.push(data)});});
 for(const row of records){const response=await page.goto(origin+'item/'+row.id+'?lang='+lang+'#studio');assert.equal(response.status(),200);const html=await response.text();assert(html.includes('property="og:image"'));assert(html.includes('type="application/json"'));await page.locator('.shared-article h1').waitFor();assert.equal(await page.locator('.wheel-stage,.category-rail,.bottom-nav,.onboarding-screen,.app-splash,.studio-link').count(),0);assert.equal(await page.locator('.item-social-actions>button').count(),3);assert.equal(await page.locator('.bookmark-button').count(),0);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'shared page overflows horizontally');assert.equal(await page.locator('a[href="#"],a[href="#studio"]').count(),0);
 if(row.category==='EAT'){assert.equal(await page.locator('.shared-ingredients li').count(),row.ingredients.length);assert.equal(await page.locator('.recipe-step').count(),row.steps.length);}
 await page.getByRole('button',{name:lang==='en'?'Share':'Podijeli',exact:true}).click();const shared=await page.evaluate(()=>window.__shares.at(-1));assert.equal(shared.url,'https://random-life-preview.pages.dev/item/'+row.id+'?lang='+lang);
 const buttons=await page.locator('.item-social-actions>button').all();for(let i=0;i<buttons.length;i++){const a=await buttons[i].boundingBox();assert(a.width>=42&&a.height>=42);if(i){const b=await buttons[i-1].boundingBox();assert(a.y>=b.y+b.height+7,'social controls overlap');}}
 await page.getByRole('button',{name:lang==='en'?'Like':'Sviđa mi se',exact:true}).click();await page.reload();assert.equal(await page.getByRole('button',{name:lang==='en'?'Like':'Sviđa mi se',exact:true}).getAttribute('aria-pressed'),'true');
 if(row.category==='EAT')await page.screenshot({path:`/workspace/shared/item-sharing/recipe-${width}.png`,fullPage:true});
 }
 assert.equal(catalogs,0,'shared view must not load the app catalog');assert.deepEqual(errors,[]);
 const missing=await page.goto(origin+'item/not-published?lang='+lang);assert.equal(missing.status(),404);assert.equal(await page.locator('.wheel-stage,.category-rail,.bottom-nav').count(),0);
 await page.close();console.log(`PASS ${width}px ${lang}: all five standalone items, full recipe, no shell/onboarding/catalog, OG metadata, share URL and persisted Like.`);
 }
 // A withdrawn item must disappear immediately from both the page and its metadata.
 const row=records[0];await db.prepare("UPDATE random_items SET status='review' WHERE id=?").bind(row.id).run();const withdrawn=await mf.dispatchFetch(origin+'item/'+row.id);assert.equal(withdrawn.status,404);assert(!(await withdrawn.text()).includes(row.image.path));
 // User-controlled title text must not escape metadata or the inert JSON script.
 const book=records[1];book.title='</script><img src=x onerror="window.attacked=1">';book.translations.en.title=book.title;
 await db.prepare('UPDATE random_items SET data=? WHERE id=?').bind(JSON.stringify(book),book.id).run();const xss=await browser.newPage();await xss.goto(origin+'item/'+book.id+'?lang=en');await xss.locator('.shared-article h1').waitFor();assert.equal(await xss.evaluate(()=>window.attacked),undefined);assert.equal(await xss.locator('h1').innerText(),book.title);await xss.close();
 console.log('PASS withdrawn/draft item privacy and hostile metadata escaping.');
}finally{await browser.close();await mf.dispose();}
