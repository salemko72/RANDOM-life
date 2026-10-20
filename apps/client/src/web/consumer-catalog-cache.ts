import{contentSchema,publicationIssues,type ContentRecord}from'@random/shared';
export const CATALOG_INTERVAL=30*60*1000,CATALOG_RETRY=60000,CATALOG_MAX_BYTES=8*1024*1024;
export type CatalogSnapshot={schema:1;version:string|null;items:ContentRecord[];checkedAt:number;savedAt:number};
export type CatalogStorage={read:()=>Promise<unknown>;write:(snapshot:CatalogSnapshot)=>Promise<void>};
export function validateCatalogItems(raw:unknown):ContentRecord[]{
 if(!Array.isArray(raw)||raw.length>10000)throw Error('CATALOG_INVALID_ITEMS');
 const ids=new Set<string>();return raw.map(row=>{if(!row||typeof row.id!=='string'||!row.id||row.id.length>180||ids.has(row.id)||row.status!=='published'||!Number.isSafeInteger(row.version)||row.version<1||typeof row.updatedAt!=='string'||!Number.isFinite(Date.parse(row.updatedAt)))throw Error('CATALOG_INVALID_RECORD');const parsed=contentSchema.safeParse(row);if(!parsed.success||publicationIssues(parsed.data).length)throw Error('CATALOG_UNAPPROVED_RECORD');ids.add(row.id);return{...parsed.data,id:row.id,status:'published',version:row.version,updatedAt:row.updatedAt,approvedBy:null,approvedAt:null};});
}
export function validateCachedCatalog(raw:unknown):CatalogSnapshot|null{
 try{const s=raw as CatalogSnapshot;if(!s||s.schema!==1||!(s.version===null||/^[a-f0-9]{64}$/.test(s.version))||!Number.isFinite(s.checkedAt)||s.checkedAt<0||!Number.isFinite(s.savedAt)||s.savedAt<0)return null;return{schema:1,version:s.version,checkedAt:s.checkedAt,savedAt:s.savedAt,items:validateCatalogItems(s.items)};}catch{return null;}
}
const address=(path:string)=>typeof location!=='undefined'&&(location.protocol==='file:'||location.hostname==='random-preview.invalid')?'https://random-life-preview.pages.dev'+path:path;
export function createCatalogTransport(fetcher:typeof fetch=globalThis.fetch,now=()=>Date.now(),onRequest?:(bytes:number)=>void){
 async function request(path:string){if(typeof navigator!=='undefined'&&navigator.onLine===false)throw Error('CATALOG_NETWORK');const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),3500);try{const r=await fetcher(address(path),{credentials:'omit',cache:'no-store',headers:{Accept:'application/json'},signal:controller.signal});const bytes=await r.arrayBuffer();onRequest?.(bytes.byteLength);if(bytes.byteLength>CATALOG_MAX_BYTES)throw Error('CATALOG_TOO_LARGE');return{response:r,bytes};}finally{clearTimeout(timer);}}
 return async(current?:CatalogSnapshot):Promise<CatalogSnapshot>=>{
 const m=await request('/api/catalog/manifest');
 if([404,405,501].includes(m.response.status)||(m.response.ok&&m.response.headers.get('content-type')?.includes('text/html'))){const legacy=await request('/api/catalog');if(!legacy.response.ok)throw Error('CATALOG_HTTP_'+legacy.response.status);const rows=validateCatalogItems(JSON.parse(new TextDecoder().decode(legacy.bytes)).items);return{schema:1,version:null,items:rows,checkedAt:now(),savedAt:now()};}
 if(!m.response.ok)throw Error('CATALOG_HTTP_'+m.response.status);
 const manifest=JSON.parse(new TextDecoder().decode(m.bytes));if(manifest.schema!==1||typeof manifest.version!=='string'||!/^[a-f0-9]{64}$/.test(manifest.version)||manifest.snapshotPath!==`/api/catalog/snapshots/${manifest.version}.json`||!Number.isSafeInteger(manifest.itemCount)||manifest.itemCount<0||manifest.itemCount>10000||typeof manifest.generatedAt!=='string'||!Number.isFinite(Date.parse(manifest.generatedAt)))throw Error('CATALOG_INVALID_MANIFEST');
 if(current&&current.version===manifest.version&&current.items.length===manifest.itemCount)return{...current,checkedAt:now()};
 const r=await request(manifest.snapshotPath);if(!r.response.ok)throw Error('CATALOG_HTTP_'+r.response.status);const digest=await crypto.subtle.digest('SHA-256',r.bytes),hash=Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');if(hash!==manifest.version)throw Error('CATALOG_CHECKSUM');const body=JSON.parse(new TextDecoder().decode(r.bytes));if(body.schema!==1)throw Error('CATALOG_INVALID_SNAPSHOT');const rows=validateCatalogItems(body.items);if(rows.length!==manifest.itemCount)throw Error('CATALOG_COUNT');return{schema:1,version:manifest.version,items:rows,checkedAt:now(),savedAt:now()};
 };
}
export class PersistentCatalog{
 status:{source:'online'|'cached'|'backup';checkedAt:number}={source:'cached',checkedAt:0};
 private snapshot?:CatalogSnapshot;private hydration?:Promise<void>;private pending?:Promise<ContentRecord[]>;private retryAt=0;
 constructor(private options:{storage:CatalogStorage;fetchSnapshot:(current?:CatalogSnapshot)=>Promise<CatalogSnapshot>;reserve:ContentRecord[];now?:()=>number;onUpdate?:()=>void}){}
 private now(){return this.options.now?.()??Date.now();}
 private hydrate(){return this.hydration??=(async()=>{try{const value=validateCachedCatalog(await this.options.storage.read());if(value){this.snapshot=value;this.status={source:'cached',checkedAt:value.checkedAt};}}catch{}})();}
 async load(force=false):Promise<ContentRecord[]>{await this.hydrate();const now=this.now();if(!force&&this.snapshot){if(now>=this.retryAt&&(now-this.status.checkedAt>=CATALOG_INTERVAL||this.status.checkedAt>now+60000))void this.refresh();return this.snapshot.items;}if(!force&&now<this.retryAt)return this.options.reserve;return this.refresh();}
 private refresh(){return this.pending??=(async()=>{try{const next=await this.options.fetchSnapshot(this.snapshot);this.snapshot=next;this.status={source:'online',checkedAt:this.now()};this.retryAt=0;void this.options.storage.write(next).catch(()=>{});this.options.onUpdate?.();return next.items;}catch{this.retryAt=this.now()+CATALOG_RETRY;this.status={source:this.snapshot?'cached':'backup',checkedAt:this.snapshot?.checkedAt??0};this.options.onUpdate?.();return this.snapshot?this.snapshot.items:this.options.reserve;}})().finally(()=>{this.pending=undefined;});}
}
