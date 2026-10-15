import {ingredientKey, unresolvedIngredients, type MissingIngredient} from './missing-ingredients';

export type AtlasBatchCell = {id:string;key:string;name:string;names:{en?:string;bs?:string};recipes:string[];index:number;row:number;column:number};
export type AtlasBatch = {atlasId:string;status:'pending';columns:10;rows:10;cells:AtlasBatchCell[]};
const compare=(a:string,b:string)=>a<b?-1:a>b?1:0;
function hash(value:string):string {
 let a=2166136261,b=3339675911;
 for(let i=0;i<value.length;i++){a=Math.imul(a^value.charCodeAt(i),16777619);b=Math.imul(b^value.charCodeAt(i),2246822519);}
 return (a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');
}
function ingredientId(key:string){return `ingredient-${key.replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'item'}-${hash(key)}`;}
/** A queue plan only: no artwork is generated or approved by this helper. */
export function planAtlasBatches(entries:MissingIngredient[],batchSize=100):{ready:AtlasBatch[];remaining:MissingIngredient[]} {
 if(!Number.isInteger(batchSize)||batchSize<1||batchSize>100)throw new RangeError('Atlas batch size must be an integer from 1 to 100.');
 const grouped=new Map<string,MissingIngredient[]>();
 for(const entry of unresolvedIngredients(entries)){
  const key=ingredientKey(entry.key||entry.name);if(!key)continue;
  grouped.set(key,[...(grouped.get(key)??[]),entry]);
 }
 const canonical=[...grouped].sort(([a],[b])=>compare(a,b)).map(([key,duplicates])=>{
  const sorted=[...duplicates].sort((a,b)=>compare(a.name,b.name)||compare(JSON.stringify(a.names??{}),JSON.stringify(b.names??{})));
  const names:{en?:string;bs?:string}={};
  for(const language of ['en','bs'] as const){const values=sorted.map(e=>e.names?.[language]).filter((v):v is string=>!!v).sort(compare);if(values[0])names[language]=values[0];}
  return {key,name:sorted[0].name,names,recipes:[...new Set(sorted.flatMap(e=>e.recipes))].sort(compare),firstSeen:sorted.map(e=>e.firstSeen).sort(compare)[0],lastSeen:sorted.map(e=>e.lastSeen).sort(compare).at(-1)!};
 });
 const ready:AtlasBatch[]=[];
 const fullCount=Math.floor(canonical.length/batchSize)*batchSize;
 for(let offset=0;offset<fullCount;offset+=batchSize){
  const selected=canonical.slice(offset,offset+batchSize);
  ready.push({atlasId:`atlas-extension-${hash(JSON.stringify(selected.map(e=>e.key)))}`,status:'pending',columns:10,rows:10,cells:selected.map((entry,index)=>({id:ingredientId(entry.key),key:entry.key,name:entry.name,names:entry.names,recipes:entry.recipes,index,row:Math.floor(index/10),column:index%10}))});
 }
 return {ready,remaining:canonical.slice(fullCount)};
}
export function atlasBatchPrompt(batch:AtlasBatch):string {
 return `Create an original ingredient illustration sheet for RANDOM life: a square 10 × 10 grid of equal square cells, one ingredient per occupied cell, no labels or text. Use a warm light background and consistent editorial illustration style. Follow the exact row-major ordering below, left to right then top to bottom; do not substitute similar ingredients. Leave every unused cell blank. This is a separate extension atlas; preserve all existing ingredient tags and original atlas coordinates.\nAtlas: ${batch.atlasId}\n`+batch.cells.map(cell=>`${cell.index+1}. Row ${cell.row+1}, column ${cell.column+1}: ${cell.name}${cell.names.en?` (English: ${cell.names.en})`:''}${cell.names.bs?` (Bosnian: ${cell.names.bs})`:''}`).join('\n')+`\nUnused cells: ${batch.cells.length<100?`${batch.cells.length+1}–100`:'none'}. Generated artwork requires human review before approval or integration.`;
}
export function atlasBatchManifest(batch:AtlasBatch,image?:string){
 return {version:1,atlasId:batch.atlasId,status:'pending' as const,approved:false,columns:batch.columns,rows:batch.rows,image:image??null,cells:batch.cells.map(cell=>({...cell,names:{...cell.names},recipes:[...cell.recipes]}))};
}
export function atlasBatchManifestJson(batch:AtlasBatch,image?:string):string{return JSON.stringify(atlasBatchManifest(batch,image),null,2);}
