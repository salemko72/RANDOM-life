import type {ContentRecord} from '@random/shared';
export type ConsumerCatalogStatus={source:'online'|'backup';checkedAt:number};
/** Consumer-only failover. Editorial reads and writes never use this snapshot. */
export class CatalogFailover{
 status:ConsumerCatalogStatus={source:'online',checkedAt:0};
 private retryAt=0;
 private cached:ContentRecord[]|undefined;
 private pending:Promise<ContentRecord[]>|undefined;
 constructor(private reserve:ContentRecord[],private online:()=>Promise<ContentRecord[]>,private now=()=>Date.now()){}
 load(force=false):Promise<ContentRecord[]>{
  if(!force&&this.cached&&this.status.source==='online'){
   if(this.now()-this.status.checkedAt>=30000)void this.refresh().catch(()=>{});
   return Promise.resolve(this.cached);
  }
  if(this.pending)return this.pending;
  if(!force&&this.status.source==='backup'&&this.now()<this.retryAt)return Promise.resolve(this.reserve);
  return this.refresh();
 }
 private refresh(){
  if(this.pending)return this.pending;
  this.pending=this.read().finally(()=>{this.pending=undefined;});return this.pending;
 }
 private async read(){
  try{const items=await this.online();this.cached=items;this.status={source:'online',checkedAt:this.now()};this.retryAt=0;return items;}
  catch(error){this.cached=undefined;if(!this.reserve.length)throw error;this.status={source:'backup',checkedAt:this.now()};this.retryAt=this.now()+30000;return this.reserve;}
 }
}
