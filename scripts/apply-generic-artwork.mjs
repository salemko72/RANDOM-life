// Run from the repository root. Dry run by default; --apply requires a valid Studio session.
import{build}from'esbuild';import{readFile,writeFile,mkdir}from'node:fs/promises';import{createHash}from'node:crypto';
const base='https://random-life-preview.pages.dev',apply=process.argv.includes('--apply');
const compiled=await build({stdin:{contents:"export {withGenericArtwork} from './packages/shared/src/generic-artwork';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',write:false});
const{withGenericArtwork}=await import('data:text/javascript;base64,'+Buffer.from(compiled.outputFiles[0].contents).toString('base64'));
const password=process.env.LIFESPINNER_STUDIO_PASSWORD;let cookie='';
async function call(path,options={}){const r=await fetch(base+path,{...options,headers:{Origin:base,...(cookie?{Cookie:cookie}:{}),...options.headers}});if(!r.ok){let code='';try{const j=await r.json();if(typeof j.error==='string'&&/^[A-Z0-9_]+$/.test(j.error))code=' '+j.error;}catch{}throw Error(path+' HTTP '+r.status+code);}return r;}
if(apply&&!password)throw Error('Set LIFESPINNER_STUDIO_PASSWORD locally; never put it in chat or this file. No mutation performed.');
if(password){const r=await call('/api/database/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})});cookie=(r.headers.get('set-cookie')??'').split(';')[0];if(!cookie.startsWith('random_studio='))throw Error('No Studio session received');}
const snapshot=await(await call(password?'/api/content':'/api/catalog')).json();const items=snapshot.items;if(!Array.isArray(items))throw Error('Missing items');
const targets=items.filter(x=>['BOOK','WATCH'].includes(x.category));const pending=targets.filter(x=>x.image.path!==withGenericArtwork(x).image.path||x.image.provenance||!x.image.generated);
const published=pending.filter(x=>x.status==='published');const unpublished=pending.filter(x=>x.status!=='published');
const dir='/workspace/shared/generic-artwork-v1';await mkdir(dir,{recursive:true});
await writeFile(dir+'/migration-before-'+Date.now()+'.json',JSON.stringify({items}));
console.log(JSON.stringify({apply,total:items.length,targeted:targets.length,publishedChanges:published.length,unpublishedRequireDirectD1:unpublished.length}));
if(!apply){await writeFile(dir+'/dry-run.json',JSON.stringify(published.map(x=>({id:x.id,version:x.version,before:x.image,after:withGenericArtwork(x).image})),null,2));process.exit(0);}
const media=JSON.parse(await readFile('docs/reviews/generic-artwork-v1-sources.json'));
for(const x of media){const name=x.path.split('/').pop(),bytes=await readFile('apps/client/src/web/assets/generic/'+name);await call('/api/database/media/'+encodeURIComponent(name),{method:'PUT',headers:{'Content-Type':'image/webp'},body:bytes});const actual=await(await call(x.path)).arrayBuffer();if(createHash('sha256').update(Buffer.from(actual)).digest('hex')!==createHash('sha256').update(bytes).digest('hex'))throw Error('Uploaded image hash mismatch: '+name);}
const done=[];try{
 for(const old of published){const next=withGenericArtwork(old);const r=await(await call('/api/content',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:old.id,version:old.version,input:next})})).json();if(r.item?.id!==old.id||r.item?.status!=='published'||r.item?.image.path!==next.image.path)throw Error('Unexpected publication state for '+old.id);done.push({id:old.id,version:r.item.version,path:r.item.image.path});await writeFile(dir+'/migration-progress.json',JSON.stringify(done,null,2));if(done.length%20===0)console.log('Updated '+done.length+' / '+published.length);}
 const after=await(await call('/api/catalog')).json();const stale=after.items.filter(x=>['BOOK','WATCH'].includes(x.category)&&(!x.image.path.startsWith('/media/generic-')||x.image.provenance));if(stale.length)throw Error('Public snapshot not fully updated; stale count '+stale.length);await writeFile(dir+'/migration-after.json',JSON.stringify(after));console.log(JSON.stringify({updated:done.length,publicStale:stale.length,unpublishedPending:unpublished.length}));
}catch(e){console.error('Stopped safely after '+done.length+' items. Preserve migration backups and progress; rerun recomputes versions. '+e.message);process.exitCode=1;}
