import type {ContentRecord} from '@random/shared';
export type ConsumerCatalogStatus={source:'online'|'backup';checkedAt:number};
/** Consumer-only failover. Editorial reads and writes never use this snapshot. */
export class CatalogFailover{
 status:ConsumerCatalogStatus={source:'online',checkedAt:0};
 private retryAt=0;
 private pending:Promise<ContentRecord[]>|undefined;
 constructor(private reserve:ContentRecord[],private online:()=>Promise<ContentRecord[]>,private now=()=>Date.now()){}
 load(force=false):Promise<ContentRecord[]>{
  if(this.pending)return this.pending;
  if(!force&&this.status.source==='backup'&&this.now()<this.retryAt)return Promise.resolve(this.reserve);
  this.pending=this.read().finally(()=>{this.pending=undefined;});return this.pending;
 }
 private async read(){
  try{const items=await this.online();this.status={source:'online',checkedAt:this.now()};this.retryAt=0;return items;}
  catch(error){if(!this.reserve.length)throw error;this.status={source:'backup',checkedAt:this.now()};this.retryAt=this.now()+30000;return this.reserve;}
 }
}
