import {type ContentRecord} from '@random/shared';
export type OnlineStatus={configured:boolean;authenticated:boolean;ok:boolean;error?:string};
export class OnlineError extends Error {constructor(message:string,public status:number){super(message);this.name='OnlineError';}}
async function request<T>(path:string,method='GET',body?:unknown):Promise<T>{
 let response:Response;
 try{response=await fetch(path,{method,credentials:'same-origin',...(body===undefined?{}:{headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})});}catch{throw new OnlineError('Online database is unavailable. Your local copy is retained.',0);}
 const data=await response.json().catch(()=>({})) as {error?:string;issues?:Array<{path?:Array<string|number>;message?:string}>};
 if(!response.ok)throw new OnlineError((data.error??(response.status===401?'Sign in to the online database first.':'Online database request failed.'))+(data.issues?.length?': '+data.issues.map(i=>(i.path??[]).join('.')+': '+i.message).join('; ').slice(0,1500):''),response.status);
 return data as T;
}
export type OnlineStorage={database:string;databaseBytes:number;mediaBytes:number;items:number;revisions:number;databaseLimitBytes:number;accountLimitBytes:number;measuredAt:string};
export const onlineStorage=()=>request<OnlineStorage>('/api/database/storage');
export const onlineStatus=()=>request<OnlineStatus>('/api/database/status');
export async function onlineUpgradeAccessLinks(){
 let updated=0;
 for(let page=0;page<20;page++){
  const result=await request<{updated:number;hasMore:boolean}>('/api/database/upgrade-access-links','POST',{});
  updated+=result.updated;
  if(!result.hasMore||!result.updated)break;
 }
 return updated;
}
export const onlineLogin=(password:string)=>request<OnlineStatus>('/api/database/login','POST',{password});
export const onlineLogout=()=>request<unknown>('/api/database/logout','POST');
let onlineDeletedIds=new Set<string>();
export function getOnlineDeletedIds():Set<string>{return new Set(onlineDeletedIds);}
async function publicCatalogRequest(path:string):Promise<{items:ContentRecord[];deletedIds?:string[]}>{
 for(let attempt=0;attempt<2;attempt++){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
  try{
   let response:Response;
   try{response=await fetch(path,{method:'GET',credentials:'omit',cache:'no-store',signal:controller.signal});}
   catch{throw new OnlineError(controller.signal.aborted?'CATALOG_TIMEOUT':'CATALOG_NETWORK',0);}
   if(!response.ok)throw new OnlineError(`CATALOG_HTTP_${response.status}`,response.status);
   let data:any;try{data=await response.json();}catch{throw new OnlineError('CATALOG_INVALID_JSON',response.status);}
   if(!data||!Array.isArray(data.items))throw new OnlineError('CATALOG_INVALID_RESPONSE',response.status);
   return data;
  }catch(error){
   if(attempt===0&&error instanceof OnlineError&&[0,502,503,504].includes(error.status))continue;
   throw error;
  }finally{clearTimeout(timer);}
 }
 throw new OnlineError('CATALOG_NETWORK',0);
}
export async function onlineCatalog(admin:boolean):Promise<ContentRecord[]>{
 const path=admin?'/api/content':(typeof window!=='undefined'&&(window.location.hostname==='random-preview.invalid'||window.location.protocol==='file:')?'https://random-life-preview.pages.dev/api/catalog':'/api/catalog');
 const result=admin?await request<{items:ContentRecord[];deletedIds?:string[]}>(path):await publicCatalogRequest(path);
 if(admin)onlineDeletedIds=new Set(result.deletedIds??[]);
 return result.items;
}
export const onlineSubmit=(input:unknown,id?:string,version?:number)=>request<{item:ContentRecord;duplicate?:boolean;issues?:string[]}>('/api/content','POST',{input,...(id?{id,version}:{})});
export async function onlineDelete(id:string,version:number){await request(`/api/content/${encodeURIComponent(id)}`,'DELETE',{version});}
export async function onlinePutImage(path:string,blob:Blob){
 if(!/^\/media\/[a-zA-Z0-9_-]+\.webp$/.test(path))throw Error('Online images require a safe /media/name.webp path.');
 if(blob.type!=='image/webp'||!blob.size||blob.size>1024*1024)throw Error('Online images must be WebP and at most 1 MB.');
 let response:Response;try{response=await fetch(`/api/database/media/${encodeURIComponent(path.slice(7))}`,{method:'PUT',credentials:'same-origin',headers:{'Content-Type':'image/webp'},body:blob});}catch{throw new OnlineError('Online image upload failed. Your local copy is retained.',0);}
 if(!response.ok){const data=await response.json().catch(()=>({})) as {error?:string};throw new OnlineError(data.error??'Online image upload failed.',response.status);}
}
/** Hash the original bytes so retries choose the same asset name independent of source basename. */
export async function imagePathForBlob(blob:Blob){if(!blob.size||blob.size>15*1024*1024)throw Error('Source image must be at most 15 MB.');const hash=await crypto.subtle.digest('SHA-256',await blob.arrayBuffer());return `/media/local-${Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('')}.webp`;}
export function optimizedDimensions(width:number,height:number){if(!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0||width*height>40_000_000)throw Error('Image dimensions are invalid or exceed 40 megapixels.');const scale=Math.min(1,1440/Math.max(width,height));return {width:Math.max(1,Math.round(width*scale)),height:Math.max(1,Math.round(height*scale))};}
export async function optimizeImage(blob:Blob):Promise<Blob>{
 if(!blob.size||blob.size>15*1024*1024)throw Error('Source image must be at most 15 MB.');
 const bitmap=await createImageBitmap(blob);
 try{const size=optimizedDimensions(bitmap.width,bitmap.height),canvas=document.createElement('canvas');canvas.width=size.width;canvas.height=size.height;const context=canvas.getContext('2d');if(!context)throw Error('Image optimization is unavailable.');context.drawImage(bitmap,0,0,size.width,size.height);
 const result=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(Error('Image optimization failed.')),'image/webp',0.84));
 if(result.type!=='image/webp'||result.size>1024*1024)throw Error('Optimized image exceeds 1 MB or WebP is unsupported.');return result;
 }finally{bitmap.close();}
}
export type MigrationResult={localId:string;localTitle?:string;onlineId?:string;status:'added'|'skipped'|'conflict'|'failed';missingImage?:boolean;error?:string};
export type MigrationReport={added:number;skipped:number;conflicts:number;failed:number;mapping:Record<string,string>;results:MigrationResult[]};
function canonical(value:unknown):string{if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';if(value&&typeof value==='object')return '{'+Object.entries(value).filter(([key])=>!['__storage','dedupKey','editorialFlags'].includes(key)).sort(([a],[b])=>a.localeCompare(b)).map(([key,v])=>JSON.stringify(key)+':'+canonical(v)).join(',')+'}';return JSON.stringify(value)??'null';}
export async function migrateLocalItems(localRows:ContentRecord[],readLocalImage:(path:string)=>Promise<Blob|null>,events:unknown[]=[]):Promise<MigrationReport>{
 const status=await onlineStatus();if(!status.configured||!status.authenticated||!status.ok)throw new OnlineError(status.error??'Sign in to the configured online database first.',401);
 const existing=new Map((await onlineCatalog(true)).map(item=>[item.id,item]));
 const report:MigrationReport={added:0,skipped:0,conflicts:0,failed:0,mapping:{},results:[]};
 for(const local of localRows){let missingImage=false;try{
 if(onlineDeletedIds.has(local.id)){report.skipped++;report.results.push({localId:local.id,status:'skipped'});continue;}
 const latest=existing.get(local.id);if(latest&&latest.version>local.version){report.skipped++;report.mapping[local.id]=latest.id;report.results.push({localId:local.id,onlineId:latest.id,status:'skipped'});continue;}
 const item=structuredClone(local),blob=await readLocalImage(local.image.path);
 if(blob){item.image.path=await imagePathForBlob(blob);}else{missingImage=true;item.status='review';item.approvedAt=null;item.approvedBy=null;}
 const remote=existing.get(item.id);
 if(remote){report.mapping[local.id]=remote.id;if(missingImage)throw Error('Text is already in D1; complete the missing image in the online editor.');if(canonical(remote)!==canonical(item))throw new OnlineError('An online record with this ID differs. Reload and review the conflict.',409);if(missingImage)throw Error('Local image is missing; migration is incomplete.');report.skipped++;report.mapping[local.id]=remote.id;report.results.push({localId:local.id,onlineId:remote.id,status:'skipped'});continue;}
 if(blob)await onlinePutImage(item.image.path,await optimizeImage(blob));
 const relevant=events.filter(event=>{const e=event as {item?:ContentRecord};return e.item?.id===local.id;});
 const result=await request<{item:ContentRecord;duplicate?:boolean}>('/api/database/migrate','POST',{item,events:relevant});
 existing.set(result.item.id,result.item);report.mapping[local.id]=result.item.id;
 if(missingImage){report.failed++;report.results.push({localId:local.id,onlineId:result.item.id,status:'failed',missingImage:true,error:'Local image is missing; online metadata saved for review.'});}
 else{const outcome=result.duplicate?'skipped':'added';report[outcome]++;report.results.push({localId:local.id,onlineId:result.item.id,status:outcome});}
 }catch(error){const conflict=error instanceof OnlineError&&error.status===409;report[conflict?'conflicts':'failed']++;report.results.push({localId:local.id,...(report.mapping[local.id]?{onlineId:report.mapping[local.id]}:{}),status:conflict?'conflict':'failed',...(missingImage?{missingImage:true}:{}),error:error instanceof Error?error.message:String(error)});}}
 report.results=report.results.map(result=>({...result,localTitle:localRows.find(row=>row.id===result.localId)?.title??result.localId}));
 return report;
}
