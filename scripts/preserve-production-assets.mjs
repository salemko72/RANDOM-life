// Backend-only deployment: retain the actual live frontend and downloadable bytes.
import fs from'node:fs/promises';import path from'node:path';import{fileURLToPath}from'node:url';import{createHash}from'node:crypto';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),site=path.join(repo,'apps/client/preview-site'),backup=path.resolve(repo,'../r2-handoff/assets-before'),origin='https://ea061935.random-life-preview.pages.dev';
const inventory=[],queue=[];async function walk(dir){for(const e of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())await walk(p);else queue.push(path.relative(site,p).replaceAll('\\','/'));}}await walk(site);
queue.push('downloads/recipes/manifest.json','downloads/android/apk-manifest.json','downloads/LifeSpinner-dietary-Codex-instructions.txt');
const seen=new Set();let cursor=0;
await Promise.all(Array.from({length:4},async()=>{for(;;){const i=cursor++;if(i>=queue.length)return;const file=queue[i];if(seen.has(file)||file.startsWith('_'))continue;seen.add(file);let r;for(let retry=0;retry<3;retry++){try{r=await fetch(origin+'/'+file,{signal:AbortSignal.timeout(30000)});break;}catch{if(retry===2)throw Error('Asset fetch failed '+file);}}
if(!r.ok){inventory.push({file,status:r.status});continue;}const type=r.headers.get('content-type')??'';if(type.includes('text/html')&&!file.endsWith('.html')){inventory.push({file,status:'SPA fallback, not an asset'});continue;}
const bytes=Buffer.from(await r.arrayBuffer());await fs.mkdir(path.dirname(path.join(backup,file)),{recursive:true});await fs.writeFile(path.join(backup,file),bytes);await fs.mkdir(path.dirname(path.join(site,file)),{recursive:true});await fs.writeFile(path.join(site,file),bytes);inventory.push({file,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
if(file==='standalone.js'||file.endsWith('.css'))for(const m of bytes.toString().matchAll(/(?:\.\/|\/)assets\/[A-Za-z0-9_.-]+\.(?:webp|png|jpg|woff2?)/g))queue.push(m[0].replace(/^\.\//,'').replace(/^\//,''));
if(file==='downloads/recipes/manifest.json'){const m=JSON.parse(bytes);for(const f of m.files??[])queue.push('downloads/recipes/'+f);}
if(file==='downloads/android/apk-manifest.json'){const m=JSON.parse(bytes);for(const value of Object.values(m))if(typeof value==='string'&&value.startsWith('/downloads/'))queue.push(value.slice(1));}
}}));
await fs.writeFile(path.resolve(repo,'../r2-handoff/static-assets-inventory.json'),JSON.stringify(inventory,null,2));console.log(JSON.stringify({preserved:inventory.filter(i=>i.sha256).length,other:inventory.filter(i=>!i.sha256),bytes:inventory.reduce((n,i)=>n+(i.bytes??0),0)}));
