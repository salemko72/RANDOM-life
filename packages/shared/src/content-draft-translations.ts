import type{ContentRecord}from'./content';
import{translationSchema,type ContentTranslation}from'./localization';
export const contentDraftLocales=['es','pt-BR','de','it']as const;
export type ContentDraftLocale=typeof contentDraftLocales[number];
export type ContentDraftEntry={id:string;expectedVersion:number;sourceFingerprint:string;translations:Record<ContentDraftLocale,ContentTranslation>};
const canonical=(value:unknown):unknown=>Array.isArray(value)?value.map(canonical):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).filter(([,value])=>value!==undefined).sort(([a],[b])=>a.localeCompare(b)).map(([key,value])=>[key,canonical(value)])):value;
/** Include protected source fields, excluding approvals and other-language edits.
 * Generic artwork rotates per session; its path is deliberately not a content revision. */
export function contentDraftFingerprint(record:ContentRecord):string{
 const{translations,approvedAt,approvedBy,image,...fields}=record;
 return JSON.stringify(canonical({...fields,english:translations?.en,image:{...image,path:/^\/media\/generic-/.test(image.path)?'<generic>':image.path}}));
}
const numbers=(text:string)=>(text.match(/\d+(?:[.,]\d+)?|[¼½¾⅐⅑⅒⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/g)??[]).map(value=>value.replace(',','.')).sort().join('|');
const urls=(text:string)=>(text.match(/https?:\/\/[^\s]+/g)??[]).map(value=>value.replace(/[.,;:)]*$/,'')).sort().join('|');
export function draftTranslationMatches(record:ContentRecord,translation:ContentTranslation):boolean{
 if(!translationSchema.safeParse(translation).success||translation.reviewed!==false)return false;
 const english=record.translations?.en;if(!english)return false;
 if(Object.keys(translation).sort().join('|')!==Object.keys(english).sort().join('|'))return false;
 for(const[field,value]of Object.entries(english)){
  if(field==='reviewed')continue;
  const target=translation[field as keyof ContentTranslation];
  if(field==='authors'||field==='title'&&(record.category==='BOOK'||record.category==='WATCH')){if(JSON.stringify(target)!==JSON.stringify(value))return false;continue;}
  const sourceLines=Array.isArray(value)?value:[value],targetLines=Array.isArray(target)?target:[target];
  if(sourceLines.length!==targetLines.length)return false;
  for(let index=0;index<sourceLines.length;index++){
   const from=sourceLines[index],to=targetLines[index];if(typeof from!=='string'||typeof to!=='string'||!to.trim()||numbers(from)!==numbers(to)||urls(from)!==urls(to))return false;
   if(field==='ingredientUnits'&&/\bUS\b/.test(from)&&!/(?:\b(?:US|USA|EUA)\b|EE\.?\s*UU\.?)/.test(to))return false;
  }
 }
 return true;
}
/** Consumer-only projection. Server snapshots/checksums and stored cache bytes stay untouched. */
export function createContentDraftTranslator(entries:readonly ContentDraftEntry[]){
 const map=new Map<string,ContentDraftEntry>(),duplicates=new Set<string>();
 for(const entry of entries){if(map.has(entry.id))duplicates.add(entry.id);map.set(entry.id,entry);}for(const id of duplicates)map.delete(id);
 return<T extends ContentRecord>(record:T):T=>{
  const entry=map.get(record.id);if(!entry||entry.expectedVersion!==record.version||entry.sourceFingerprint!==contentDraftFingerprint(record))return record;
  if(!contentDraftLocales.every(locale=>draftTranslationMatches(record,entry.translations?.[locale])))return record;
  const additions=Object.fromEntries(contentDraftLocales.filter(locale=>!record.translations?.[locale]).map(locale=>[locale,entry.translations[locale]]));
  return Object.keys(additions).length?{...record,translations:{...record.translations,...additions}}as T:record;
 };
}
