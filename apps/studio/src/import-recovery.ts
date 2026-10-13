import {bilingualIssues,contentSchema, type ContentInput, type ContentRecord} from '@random/shared';
const translationKeys=new Set(['title','summary','imageAlt','sourceLabel','rightsNote','reviewed','steps','ingredientNames','ingredientUnits','genres','recommendationReason','equipment','durationLabel','authors']);
export function inspectImport(json:string){
 try { const raw=JSON.parse(json);const parsed=contentSchema.safeParse(raw);return {raw,errors:parsed.success?[]:parsed.error.issues.map(i=>`${i.path.join('.')||'JSON'}: ${i.message}`)}; }
 catch(e){return {raw:null,errors:[`JSON: ${e instanceof Error?e.message:'Invalid syntax'}`]};}
}
/** Repair metadata only. Never infer recipe facts or create translated prose. */
export function recoverImport(raw:any){
 const data=structuredClone(raw);const corrections:string[]=[];
 if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('JSON must be an object.');
 const unchecked=(owner:any,key:string,path:string)=>{if(owner&&owner[key]===undefined){owner[key]=false;corrections.push(`${path}: false (requires review)`);}};
 unchecked(data,'factsVerified','factsVerified');unchecked(data.image,'rightsConfirmed','image.rightsConfirmed');unchecked(data.image,'generated','image.generated');
 if(data.category==='EAT')unchecked(data,'allergensVerified','allergensVerified');
 for(const [code,t] of Object.entries(data.translations??{}) as [string,any][]){
  if(!t||typeof t!=='object'||Array.isArray(t))continue;
  unchecked(t,'reviewed',`translations.${code}.reviewed`);
  for(const [field,source] of [['sourceLabel','label'],['rightsNote','rightsNote']])if(t[field]===undefined&&typeof data.source?.[source]==='string'){t[field]=data.source[source];corrections.push(`translations.${code}.${field}: retained original source metadata; review its language`);}
  for(const key of Object.keys(t))if(!translationKeys.has(key)){delete t[key];corrections.push(`translations.${code}.${key}: removed unsupported field (original JSON retained in recovery backup)`);}
 }
 return {data,corrections};
}
/** Local WIP accepts incomplete translation objects; shared publication validation stays strict. */
export function draftInput(raw:any):ContentInput{
 const base=contentSchema.parse({...raw,translations:undefined});
 if(raw.translations!==undefined&&(raw.translations===null||typeof raw.translations!=='object'||Array.isArray(raw.translations)))throw new Error('translations: expected a language map');
 for(const [code,value] of Object.entries(raw.translations??{}))if(!value||typeof value!=='object'||Array.isArray(value))throw new Error(`translations.${code}: expected a translation object`);
 const retained={...raw};for(const key of ['id','status','version','updatedAt','approvedAt','approvedBy','dedupKey','revision_token'])delete retained[key];
 return {...retained,...base,source:{...raw.source,...base.source},image:{...raw.image,...base.image},...(raw.translations===undefined?{}:{translations:structuredClone(raw.translations)})};
}
export function needsTranslationRepair(row:ContentRecord){if(row.category!=='EAT')return false;return !contentSchema.safeParse(row).success||bilingualIssues(row).length>0;}
export function legacyRecordMetadata(row:any):ContentRecord{return {...row,...(row.status===undefined?{status:'draft'}:{}),...(row.version===undefined?{version:1}:{})};}
export function batchTranslationPrompt(items:ContentRecord[]){return `Translate these existing recipes into ENG (en) and BHS (bs). Return JSON {"items":[{"id":"unchanged","version":1,"translations":{"en":{},"bs":{}}}]}. Include title, summary, imageAlt, sourceLabel, rightsNote, ingredientNames, ingredientUnits, steps, reviewed:false in each translation. Preserve quantities, facts, order, source and images. Do not invent facts. Return translations only, never replacement recipes. Originals:\n${JSON.stringify(items,null,2)}`;}
export function prepareTranslationBatch(raw:any,items:ContentRecord[]){
 if(!Array.isArray(raw?.items)||!raw.items.length)throw new Error('items: expected a nonempty batch');
 const seen=new Set<string>();return raw.items.map((entry:any)=>{
  if(!entry||typeof entry!=='object'||Array.isArray(entry))throw new Error('Batch entry must be an object');
  const extra=Object.keys(entry).filter(key=>!['id','version','translations'].includes(key));if(extra.length)throw new Error(`Batch must contain translations only: ${extra.join(', ')}`);
  if(seen.has(entry.id))throw new Error(`Duplicate id: ${entry.id}`);seen.add(entry.id);
  const stored=items.find(i=>i.id===entry.id);const row=stored?legacyRecordMetadata(stored):undefined;if(!row||row.category!=='EAT')throw new Error(`Unknown recipe: ${entry.id}`);
  if(row.version!==entry.version)throw new Error(`${entry.id}: version changed; generate a fresh prompt`);
  if(!entry.translations?.en||!entry.translations?.bs)throw new Error(`${entry.id}: both ENG and BHS required`);
  const translations=Object.fromEntries(Object.entries(entry.translations).map(([code,t])=>[code,{...(t as object),reviewed:false}]));
  const input=contentSchema.parse({...row,translations,factsVerified:false,allergensVerified:false,image:{...row.image,rightsConfirmed:false}});
  for(const code of ['en','bs'] as const){const t=input.translations![code]!;if(t.steps?.length!==row.steps.length||t.ingredientNames?.length!==row.ingredients.length||t.ingredientUnits?.length!==row.ingredients.length)throw new Error(`${row.id}: translations.${code} steps, ingredient names and units must match every original entry`);}
  return {id:row.id,version:row.version,input:draftInput({...row,translations:input.translations,factsVerified:false,allergensVerified:false,image:{...row.image,rightsConfirmed:false}})};
 });
}
