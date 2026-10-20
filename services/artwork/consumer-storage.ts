import {contentSchema,publicationIssues,visibleAccessLinks,type ContentRecord} from '@random/shared';

export interface ConsumerEnv {CONTENT_DB?:D1Database;CONTENT_BUCKET?:R2Bucket}
export const consumerSchema=[
 'CREATE TABLE IF NOT EXISTS random_public_items(id TEXT PRIMARY KEY,data TEXT NOT NULL,image_path TEXT NOT NULL)',
 'CREATE INDEX IF NOT EXISTS random_public_image ON random_public_items(image_path)',
 'CREATE TABLE IF NOT EXISTS random_catalog_state(id INTEGER PRIMARY KEY CHECK(id=1),generation INTEGER NOT NULL DEFAULT 0,published_generation INTEGER NOT NULL DEFAULT -1,version TEXT,generated_at TEXT,item_count INTEGER NOT NULL DEFAULT 0)',
 'INSERT OR IGNORE INTO random_catalog_state(id) VALUES(1)',
 ...['INSERT','UPDATE','DELETE'].map(action=>`CREATE TRIGGER IF NOT EXISTS random_public_${action.toLowerCase()} AFTER ${action} ON random_public_items BEGIN UPDATE random_catalog_state SET generation=generation+1 WHERE id=1; END`),
];
const encode=new TextEncoder();
export async function digest(bytes:Uint8Array){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes as BufferSource)),b=>b.toString(16).padStart(2,'0')).join('');}
export function approvedPublic(item:ContentRecord){
 const parsed=contentSchema.safeParse(item);
 if(!parsed.success||item.status!=='published'||!item.approvedAt||!item.approvedBy||!Number.isSafeInteger(item.version)||item.version<1||!item.id||publicationIssues(parsed.data).length)return null;
 // Whitelist schema fields, not an arbitrary D1 payload that happens to validate.
 const safe={...parsed.data,id:item.id,status:item.status,version:item.version,updatedAt:item.updatedAt};
 return {...safe,...((item.category==='BOOK'||item.category==='WATCH')?{accessLinks:visibleAccessLinks(item)}:{}),translations:Object.fromEntries(Object.entries(item.translations??{}).filter(([,t])=>t.reviewed))};
}
export function publicStatement(db:D1Database,item:ContentRecord,revision:string){
 const data=approvedPublic(item);
 return data?db.prepare('INSERT INTO random_public_items(id,data,image_path) SELECT ?,?,? WHERE EXISTS(SELECT 1 FROM random_items WHERE id=? AND revision=?) ON CONFLICT(id) DO UPDATE SET data=excluded.data,image_path=excluded.image_path').bind(item.id,JSON.stringify(data),item.image.path,item.id,revision)
 :db.prepare('DELETE FROM random_public_items WHERE id=? AND EXISTS(SELECT 1 FROM random_items WHERE id=? AND revision=?)').bind(item.id,item.id,revision);
}
export async function copyMedia(env:ConsumerEnv,path:string){
 if(!env.CONTENT_BUCKET||!env.CONTENT_DB)return;
 const key=path.slice(1);if(await env.CONTENT_BUCKET.head(key))return;
 const row=await env.CONTENT_DB.prepare('SELECT bytes,mime,hash FROM random_media WHERE path=?').bind(path).first<{bytes:number[]|ArrayBuffer;mime:string;hash:string}>();
 if(!row)throw Error('MEDIA_NOT_FOUND');
 const bytes=Array.isArray(row.bytes)?new Uint8Array(row.bytes):new Uint8Array(row.bytes);
 if(await digest(bytes)!==row.hash)throw Error('MEDIA_HASH_MISMATCH');
 await env.CONTENT_BUCKET.put(key,bytes,{httpMetadata:{contentType:row.mime},customMetadata:{sha256:row.hash}});
}
type State={generation:number;published_generation:number;version:string|null;generated_at:string|null;item_count:number};
const jobs=new WeakMap<object,Promise<unknown>>();
// Only prevalidated public rows are serialized here. No editorial history or per-user data.
export async function rebuildCatalog(env:ConsumerEnv){
 if(!env.CONTENT_BUCKET||!env.CONTENT_DB)return;
 const existing=jobs.get(env.CONTENT_DB);if(existing){await existing;return rebuildCatalog(env);}
 const job=(async()=>{
  const db=env.CONTENT_DB!,bucket=env.CONTENT_BUCKET!;
  for(let attempt=0;attempt<3;attempt++){
   const start=await db.prepare('SELECT * FROM random_catalog_state WHERE id=1').first<State>();
   if(!start)throw Error('CATALOG_NOT_INITIALIZED');
   if(start.generation===start.published_generation&&start.version)return;
   const rows=await db.prepare('SELECT data FROM random_public_items ORDER BY id LIMIT 10001').all<{data:string}>();
   if(rows.results.length>10000)throw Error('CATALOG_ITEM_LIMIT');
   const text='{"schema":1,"items":['+rows.results.map(r=>r.data).join(',')+']}';const bytes=encode.encode(text);
   if(bytes.byteLength>8*1024*1024)throw Error('CATALOG_BYTE_LIMIT');
   const version=await digest(bytes),key=`catalog/snapshots/${version}.json`;
   if(start.version!==version){
    await bucket.put(key,bytes,{httpMetadata:{contentType:'application/json; charset=utf-8'},customMetadata:{sha256:version}});
    const verified=await bucket.get(key);if(!verified||await digest(new Uint8Array(await verified.arrayBuffer()))!==version)throw Error('SNAPSHOT_VERIFY_FAILED');
    // A second object preserves the legacy exact {items:[...]} envelope without runtime parsing.
    await bucket.put(`catalog/legacy/${version}.json`,'{"items":['+rows.results.map(r=>r.data).join(',')+']}',{httpMetadata:{contentType:'application/json; charset=utf-8'}});
   }
   const now=start.version===version?start.generated_at!:new Date().toISOString();
   const result=await db.prepare('UPDATE random_catalog_state SET version=?,generated_at=?,item_count=?,published_generation=? WHERE id=1 AND generation=? AND published_generation<=?').bind(version,now,rows.results.length,start.generation,start.generation,start.generation).run();
   if(result.meta.changes===1)return;
  }
  throw Error('CATALOG_CONCURRENT_RETRY');
 })();jobs.set(env.CONTENT_DB,job);try{await job;}finally{jobs.delete(env.CONTENT_DB);}
}
function cache(){return (caches as unknown as {default?:Cache}).default;}
function cacheRequest(request:Request,suffix:string){const url=new URL(request.url);url.pathname='/__consumer_cache/'+suffix;url.search='';return new Request(url.href);}
export async function invalidateConsumer(request:Request,paths:string[]=[]){const store=cache();if(store)await Promise.all(['state',...paths.map(p=>'approved'+p)].map(k=>store.delete(cacheRequest(request,k))));}
async function cached(request:Request,key:string,seconds:number,load:()=>Promise<Response>){
 const store=cache(),req=cacheRequest(request,key),hit=await store?.match(req);if(hit)return{response:hit,hit:true};
 const response=await load();if(response.ok&&store){const copy=new Response(response.clone().body,{headers:response.headers});copy.headers.set('Cache-Control',`public, max-age=${seconds}`);await store.put(req,copy);}return{response,hit:false};
}
const headers={'Access-Control-Allow-Origin':'*','X-Content-Type-Options':'nosniff'};
export async function consumerRead(request:Request,env:ConsumerEnv):Promise<Response|null>{
 const path=new URL(request.url).pathname;
 if(!['GET','HEAD','OPTIONS'].includes(request.method)||!['/api/catalog','/api/catalog/manifest'].includes(path)&&!/^\/api\/catalog\/snapshots\/[a-f0-9]{64}\.json$/.test(path))return null;
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...headers,'Access-Control-Allow-Methods':'GET, HEAD, OPTIONS'}});
 if(!env.CONTENT_BUCKET||!env.CONTENT_DB)return path==='/api/catalog'?null:Response.json({error:'CATALOG_NOT_CONFIGURED'},{status:503,headers:{...headers,'Cache-Control':'no-store'}});
 try{
  const state=await cached(request,'state',60,async()=>{let r=await env.CONTENT_DB!.prepare('SELECT * FROM random_catalog_state WHERE id=1').all<State>();let s=r.results[0];if(!s?.version)throw Error('CATALOG_NOT_READY');if(s.generation!==s.published_generation){await rebuildCatalog(env);r=await env.CONTENT_DB!.prepare('SELECT * FROM random_catalog_state WHERE id=1').all<State>();s=r.results[0];}if(!s?.version)throw Error('CATALOG_NOT_READY');return Response.json(s,{headers:{'X-LifeSpinner-D1-Rows':String(r.meta.rows_read??0)}});});
  const s=await state.response.json() as State;
  const manifest={schema:1,version:s.version,generatedAt:s.generated_at,snapshotPath:`/api/catalog/snapshots/${s.version}.json`,itemCount:s.item_count};
  if(path==='/api/catalog/manifest')return new Response(request.method==='HEAD'?null:JSON.stringify(manifest),{headers:{...headers,'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=60',ETag:`"${s.version}"`,'X-LifeSpinner-State-Cache':state.hit?'HIT':'MISS','X-LifeSpinner-D1-Rows':state.hit?'0':state.response.headers.get('X-LifeSpinner-D1-Rows')??'0','X-LifeSpinner-R2-Ops':'0'}});
  if(path!=='/api/catalog'&&path!==manifest.snapshotPath)return Response.json({error:'SNAPSHOT_RETIRED'},{status:404,headers:{...headers,'Cache-Control':'no-store'}});
  const key=path==='/api/catalog'?`catalog/legacy/${s.version}.json`:`catalog/snapshots/${s.version}.json`;
  const body=await cached(request,key,31536000,async()=>{const r=await env.CONTENT_BUCKET!.get(key);if(!r)throw Error('SNAPSHOT_MISSING');return new Response(r.body,{headers:{'Content-Type':'application/json; charset=utf-8'}});});
  return new Response(request.method==='HEAD'?null:body.response.body,{headers:{...headers,'Content-Type':'application/json; charset=utf-8','Cache-Control':path==='/api/catalog'?'public, max-age=60':'public, max-age=31536000, immutable',ETag:`"${s.version}"`,'X-LifeSpinner-State-Cache':state.hit?'HIT':'MISS','X-LifeSpinner-Body-Cache':body.hit?'HIT':'MISS','X-LifeSpinner-D1-Rows':state.hit?'0':state.response.headers.get('X-LifeSpinner-D1-Rows')??'0','X-LifeSpinner-R2-Ops':body.hit?'0':'1'}});
 }catch{return Response.json({error:'CATALOG_UNAVAILABLE'},{status:503,headers:{...headers,'Cache-Control':'no-store'}});}
}
export async function r2Media(request:Request,env:ConsumerEnv,auth:boolean):Promise<Response|null>{
 if(!env.CONTENT_BUCKET||!env.CONTENT_DB)return null;
 const path=new URL(request.url).pathname;
 try{
  let reads=0,permissionHit=false;
  if(!auth){
   const permission=await cached(request,'approved'+path,60,async()=>{const r=await env.CONTENT_DB!.prepare('SELECT id FROM random_public_items WHERE image_path=? LIMIT 1').bind(path).all();reads+=r.meta.rows_read??0;return new Response(r.results.length?'yes':'no',{status:r.results.length?200:404});});permissionHit=permission.hit;
   if(!permission.response.ok)return new Response(null,{status:404,headers:{...headers,'Cache-Control':'no-store','X-LifeSpinner-D1-Rows':String(reads)}});
  }
  const get=async()=>{const r=await env.CONTENT_BUCKET!.get(path.slice(1));if(!r)return new Response(null,{status:404});return new Response(r.body,{headers:{'Content-Type':r.httpMetadata?.contentType??'image/webp',ETag:r.customMetadata?.sha256?`"${r.customMetadata.sha256}"`:r.httpEtag}});};
  const body=auth?{response:await get(),hit:false}:await cached(request,'body'+path,31536000,get);
  if(body.response.status===404)return null; // D1 bytes fallback, after approved index check.
  const h=new Headers(body.response.headers);for(const[k,v]of Object.entries(headers))h.set(k,v);
  h.set('Cache-Control',auth?'private, no-store':'public, max-age=31536000, immutable');h.set('X-LifeSpinner-Body-Cache',body.hit?'HIT':'MISS');h.set('X-LifeSpinner-Approval-Cache',permissionHit?'HIT':'MISS');h.set('X-LifeSpinner-D1-Rows',String(reads));h.set('X-LifeSpinner-R2-Ops',body.hit?'0':'1');
  if(!auth&&request.headers.get('If-None-Match')===h.get('ETag'))return new Response(null,{status:304,headers:h});
  return new Response(request.method==='HEAD'?null:body.response.body,{headers:h});
 }catch{return new Response(null,{status:503,headers:{'Cache-Control':'no-store'}});}
}
