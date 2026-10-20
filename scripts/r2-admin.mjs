// Run through a local private credential wrapper. Never prints tokens or download URLs.
import fs from 'node:fs/promises';import path from 'node:path';import{fileURLToPath}from'node:url';import{createHash}from'node:crypto';import{build}from'esbuild';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),dir=path.resolve(repo,'../r2-handoff'),account=process.env.CLOUDFLARE_ACCOUNT_ID,database='d47c89e2-e2ab-42fd-be29-dce5ba809b6d',bucket='lifespinner-content',project='random-life-preview',task=process.argv[2]||'backup';
if(!account||!process.env.CLOUDFLARE_API_TOKEN)throw Error('Private Cloudflare configuration required');
await fs.mkdir(dir,{recursive:true});const headers={Authorization:`Bearer ${process.env.CLOUDFLARE_API_TOKEN}`},base=`https://api.cloudflare.com/client/v4/accounts/${account}`;
const metrics={d1RowsRead:0,d1RowsWritten:0,r2Reads:0,r2Writes:0,apiRequests:0};
async function raw(route,method='GET',body,extra={}){for(let a=0;;a++){try{metrics.apiRequests++;const r=await fetch(base+route,{method,headers:{...headers,...extra},body,signal:AbortSignal.timeout(60000)});if([429,502,503,504].includes(r.status)&&a<3){await r.body?.cancel();await new Promise(r=>setTimeout(r,2000*(a+1)));continue;}if(!r.ok)throw Error(`${method} ${route.split('?')[0]} HTTP ${r.status}`);return r;}catch(e){if(a>=3)throw e;await new Promise(r=>setTimeout(r,2000*(a+1)));}}}
async function api(route,method='GET',data){const j=await(await raw(route,method,data===undefined?undefined:JSON.stringify(data),data===undefined?{}:{'Content-Type':'application/json'})).json();if(!j.success)throw Error('Cloudflare API rejected '+route+': '+JSON.stringify(j.errors));return j.result;}
async function query(sql,params=[]){const results=await api(`/d1/database/${database}/query`,'POST',{sql,params});for(const r of results){metrics.d1RowsRead+=r.meta?.rows_read??0;metrics.d1RowsWritten+=r.meta?.rows_written??0;}return results[0];}
const objectRoute=key=>`/r2/buckets/${bucket}/objects/${key.split('/').map(encodeURIComponent).join('/')}`;
async function put(key,bytes,mime){await raw(objectRoute(key),'PUT',bytes,{'Content-Type':mime});metrics.r2Writes++;}
async function get(key){metrics.r2Reads++;return Buffer.from(await(await raw(objectRoute(key))).arrayBuffer());}
const sha=b=>createHash('sha256').update(b).digest('hex');
const bundle=await build({entryPoints:[path.join(repo,'services/artwork/consumer-storage.ts')],bundle:true,write:false,format:'esm',platform:'node'});const{consumerSchema,approvedPublic}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].contents).toString('base64'));
if(task==='backup'){
 const p=await api(`/pages/projects/${project}`);await fs.writeFile(path.join(dir,'rollback-project.json'),JSON.stringify({deployment:p.canonical_deployment?.id,production_branch:p.production_branch,configs:Object.fromEntries(Object.entries(p.deployment_configs??{}).map(([k,v])=>[k,{d1_databases:v.d1_databases,r2_buckets:v.r2_buckets,compatibility_date:v.compatibility_date,compatibility_flags:v.compatibility_flags}]))},null,2));
 let e;do{e=await api(`/d1/database/${database}/export`,'POST',{output_format:'polling',...(e?.at_bookmark?{current_bookmark:e.at_bookmark}:{})});if(e.status==='error')throw Error('D1 export failed');}while(e.status!=='complete');
 let sql;for(let retry=0;retry<4;retry++){try{const download=await fetch(e.result.signed_url,{signal:AbortSignal.timeout(120000)});if(!download.ok)throw Error('Backup download failed HTTP '+download.status);sql=Buffer.from(await download.arrayBuffer());break;}catch{if(retry===3)throw Error('Private SQL backup download unavailable; no mutation performed');}}
 await fs.writeFile(path.join(dir,'d1-before.sql'),sql);
 const items=(await query('SELECT * FROM random_items ORDER BY id')).results,media=(await query('SELECT path,mime,hash,length(bytes) AS bytes FROM random_media ORDER BY path')).results;
 await fs.writeFile(path.join(dir,'items-before.json'),JSON.stringify(items));await fs.writeFile(path.join(dir,'media-before.json'),JSON.stringify(media,null,2));
 console.log(JSON.stringify({backupBytes:sql.length,backupSha256:sha(sql),items:items.length,media:media.length,rollbackDeployment:p.canonical_deployment?.id}));
}else if(task==='migrate'){
 if(!(await fs.stat(path.join(dir,'d1-before.sql'))).size)throw Error('Backup required');
 const buckets=await api('/r2/buckets');if(!buckets.buckets.some(b=>b.name===bucket))await api('/r2/buckets','POST',{name:bucket});
 const media=JSON.parse(await fs.readFile(path.join(dir,'media-before.json'))),results=[];let cursor=0;
 await fs.mkdir(path.join(dir,'media'),{recursive:true});
 await Promise.all(Array.from({length:3},async()=>{for(;;){const index=cursor++;if(index>=media.length)return;const m=media[index],local=path.join(dir,'media',path.basename(m.path));let bytes;try{bytes=await fs.readFile(local);}catch{const row=(await query('SELECT hex(bytes) AS hex FROM random_media WHERE path=?',[m.path])).results[0];bytes=Buffer.from(row.hex,'hex');await fs.writeFile(local,bytes);}
 if(sha(bytes)!==m.hash||bytes.length!==m.bytes)throw Error('Source media mismatch '+m.path);const key=m.path.slice(1);await put(key,bytes,m.mime);const after=await get(key);if(sha(after)!==m.hash)throw Error('R2 mismatch '+m.path);results.push({path:m.path,bytes:bytes.length,sha256:m.hash,verified:true});if(results.length%25===0)console.log(JSON.stringify({mediaVerified:results.length,total:media.length}));await fs.writeFile(path.join(dir,'migration-inventory.json'),JSON.stringify(results,null,2));}}));
 await fs.writeFile(path.join(dir,'migration-inventory.json'),JSON.stringify(results.sort((a,b)=>a.path.localeCompare(b.path)),null,2));
 console.log(JSON.stringify({migrated:results.length,bytes:results.reduce((n,m)=>n+m.bytes,0)}));
}else if(task==='initialize'){
 const inventory=JSON.parse(await fs.readFile(path.join(dir,'migration-inventory.json')));if(inventory.length!==JSON.parse(await fs.readFile(path.join(dir,'media-before.json'))).length)throw Error('Complete media verification required');
 for(const sql of consumerSchema)await query(sql);
 const rows=(await query('SELECT * FROM random_items ORDER BY id')).results;const valid=[],rejected=[];
 for(const row of rows){try{const item={...JSON.parse(row.data),id:row.id,status:row.status,version:row.version,updatedAt:row.updated_at,approvedBy:row.approved_by,approvedAt:row.approved_at};const p=approvedPublic(item);if(p)valid.push(p);else if(row.status==='published')rejected.push({id:row.id,reason:'publication validation'});}catch{if(row.status==='published')rejected.push({id:row.id,reason:'invalid record'});}}
 if(rejected.length){await fs.writeFile(path.join(dir,'rejected.json'),JSON.stringify(rejected));throw Error('Published rows failed validation; coordinate rather than silently dropping');}
 for(const i of valid)await query('INSERT INTO random_public_items(id,data,image_path) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data,image_path=excluded.image_path WHERE data<>excluded.data OR image_path<>excluded.image_path',[i.id,JSON.stringify(i),i.image.path]);
 const s=(await query('SELECT * FROM random_catalog_state WHERE id=1')).results[0];
 const ordered=(await query('SELECT data FROM random_public_items ORDER BY id')).results;const body=Buffer.from('{"schema":1,"items":['+ordered.map(r=>r.data).join(',')+']}');if(body.length>8*1024*1024||ordered.length>10000)throw Error('Contract limits exceeded');const version=sha(body);
 await put(`catalog/snapshots/${version}.json`,body,'application/json; charset=utf-8');if(sha(await get(`catalog/snapshots/${version}.json`))!==version)throw Error('Snapshot verification failed');await put(`catalog/legacy/${version}.json`,Buffer.from('{"items":['+ordered.map(r=>r.data).join(',')+']}'),'application/json; charset=utf-8');
 const now=s.version===version?s.generated_at:new Date().toISOString();const updated=await query('UPDATE random_catalog_state SET version=?,generated_at=?,item_count=?,published_generation=? WHERE id=1 AND generation=?',[version,now,ordered.length,s.generation,s.generation]);if(updated.meta.changes!==1)throw Error('Concurrent edit; retry snapshot initialization');
 const manifest={schema:1,version,generatedAt:now,snapshotPath:`/api/catalog/snapshots/${version}.json`,itemCount:ordered.length};await fs.writeFile(path.join(dir,'manifest.json'),JSON.stringify(manifest,null,2));await fs.writeFile(path.join(dir,'snapshot.json'),body);console.log(JSON.stringify({manifest,snapshotBytes:body.length,rejected:0}));
}else if(task==='verify'){
 const before=JSON.parse(await fs.readFile(path.join(dir,'items-before.json'))),rows=(await query('SELECT * FROM random_items ORDER BY id')).results;
 const media=(await query('SELECT path,mime,hash,length(bytes) AS bytes FROM random_media ORDER BY path')).results;
 const originalMedia=JSON.parse(await fs.readFile(path.join(dir,'media-before.json')));
 const unchanged=JSON.stringify(rows)===JSON.stringify(before),mediaUnchanged=JSON.stringify(media)===JSON.stringify(originalMedia);
 const state=(await query('SELECT * FROM random_catalog_state WHERE id=1')).results[0],p=await api(`/pages/projects/${project}`),domain=await api(`/r2/buckets/${bucket}/domains/managed`);
 const report={contentRowsUnchanged:unchanged,d1MediaUnchanged:mediaUnchanged,items:rows.length,d1Images:media.length,state,managedDomain:domain,deployment:{id:p.canonical_deployment.id,url:p.canonical_deployment.url,commit:p.canonical_deployment.deployment_trigger?.metadata?.commit_hash},bindings:{d1:p.deployment_configs.production.d1_databases,r2:p.deployment_configs.production.r2_buckets,secrets:Object.keys(p.deployment_configs.production.env_vars??{})}};
 await fs.writeFile(path.join(dir,'cloud-final-verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));if(!unchanged||!mediaUnchanged||domain.enabled)throw Error('Preservation/private bucket check failed');
}else if(task==='bind'){
 await api(`/pages/projects/${project}`,'PATCH',{deployment_configs:{production:{r2_buckets:{CONTENT_BUCKET:{name:bucket}}},preview:{d1_databases:{CONTENT_DB:{id:database}},r2_buckets:{CONTENT_BUCKET:{name:bucket}}}}});console.log('Bound private R2 bucket and existing D1 to Pages; preserved existing secret bindings.');
}else throw Error('Unknown task');
await fs.writeFile(path.join(dir,`metrics-${task}.json`),JSON.stringify(metrics,null,2));console.log(JSON.stringify({task,metrics}));
