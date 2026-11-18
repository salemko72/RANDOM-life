import type{ContentRecord}from'@random/shared';
/** Transport snapshots are immutable: each editorial refresh replaces its items array. */
export function memoizeCatalogProjection(project:(record:ContentRecord)=>ContentRecord){
 const cache=new WeakMap<ContentRecord[],ContentRecord[]>();
 return(items:ContentRecord[]):ContentRecord[]=>{
  const existing=cache.get(items);if(existing)return existing;
  const result=items.map(project);cache.set(items,result);return result;
 };
}
