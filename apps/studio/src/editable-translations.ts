import {contentSchema,type ContentInput,type ContentTranslation} from '@random/shared';
/** Permit temporarily empty translated text while keeping publication validation strict. */
export function editableSource(json:string):ContentInput|null{
 try{
  const raw=JSON.parse(json);const base=contentSchema.safeParse({...raw,translations:undefined});if(!base.success)return null;
  const translations:Partial<Record<'en'|'bs',ContentTranslation>>={};
  for(const code of ['en','bs'] as const){
   const value=raw.translations?.[code];if(!value||typeof value!=='object'||Array.isArray(value))continue;
   const text=(field:string)=>typeof value[field]==='string'?value[field]:'';
   const array=(field:string)=>Array.isArray(value[field])&&value[field].every((v:unknown)=>typeof v==='string')?value[field]:undefined;
   translations[code]={title:text('title'),summary:text('summary'),imageAlt:text('imageAlt'),sourceLabel:text('sourceLabel'),rightsNote:text('rightsNote'),reviewed:value.reviewed===true,steps:array('steps'),ingredientNames:array('ingredientNames'),ingredientUnits:array('ingredientUnits'),genres:array('genres'),equipment:array('equipment'),authors:array('authors'),recommendationReason:typeof value.recommendationReason==='string'?value.recommendationReason:undefined,durationLabel:typeof value.durationLabel==='string'?value.durationLabel:undefined};
  }
  return {...base.data,translations} as ContentInput;
 }catch{return null;}
}
