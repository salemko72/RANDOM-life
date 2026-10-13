import {z} from 'zod';
import type {ContentInput} from './content';
import {resolveIngredient} from './ingredient-tags';
export const supportedLocales=['en','bs','fr','de','es','zh-Hans','ar'] as const;
export type Locale='en'|'bs';
const line=z.string().trim().min(1).max(2000);
export const translationSchema=z.object({
 title:line.max(160),summary:line,imageAlt:line.max(300),sourceLabel:line.max(200),rightsNote:line,
 reviewed:z.boolean().default(false),
 steps:z.array(line).max(60).optional(),ingredientNames:z.array(line.max(160)).max(100).optional(),ingredientUnits:z.array(line.max(40)).max(100).optional(),
 genres:z.array(line.max(60)).max(20).optional(),recommendationReason:line.optional(),equipment:z.array(line.max(160)).max(50).optional(),durationLabel:line.max(60).optional(),authors:z.array(line.max(160)).max(20).optional(),
}).strict();
export type ContentTranslation=z.infer<typeof translationSchema>;
export const translationsSchema=z.partialRecord(z.enum(supportedLocales),translationSchema);
export function bilingualIssues(item:ContentInput):string[]{
 const issues:string[]=[];
 for(const locale of ['en','bs'] as const){
  const t=item.translations?.[locale];
  if(!t){issues.push(`Missing ${locale.toUpperCase()} translation.`);continue;}
  if(!t.reviewed)issues.push(`${locale.toUpperCase()} translation requires human review.`);
  if(item.category==='EAT'){
   if(t.ingredientNames?.length!==item.ingredients.length||t.ingredientUnits?.length!==item.ingredients.length)issues.push(`${locale.toUpperCase()} ingredient names and units must match all ingredients.`);
   if(t.steps?.length!==item.steps.length)issues.push(`${locale.toUpperCase()} cooking steps must match the source.`);
  }else{
   if(!t.recommendationReason||!t.genres?.length)issues.push(`${locale.toUpperCase()} recommendation and genres are required.`);
   if(item.category==='WATCH'&&!t.durationLabel)issues.push(`${locale.toUpperCase()} duration label is required.`);
   if(item.category==='MOVE'||item.category==='GO'){
    if(t.steps?.length!==item.steps.length||t.equipment?.length!==item.equipment.length)issues.push(`${locale.toUpperCase()} steps and equipment must match the source.`);
   }
  }
 }
 return issues;
}
export function resolveLocale(item:ContentInput,requested:Locale):string{
 if(item.translations?.[requested])return requested;
 if(item.translations?.en)return 'en';
 return item.language;
}
export function localizeContent<T extends ContentInput>(item:T,requested:Locale):T{
 const t=item.translations?.[requested]??item.translations?.en;
 if(!t)return item;
 const result:any={...item,title:t.title,summary:t.summary,language:resolveLocale(item,requested),image:{...item.image,alt:t.imageAlt},source:{...item.source,label:t.sourceLabel,rightsNote:t.rightsNote}};
 if(t.genres)result.genres=t.genres;
 if(t.recommendationReason)result.recommendationReason=t.recommendationReason;
 if(t.authors)result.authors=t.authors;
 if(t.steps)result.steps=t.steps;
 if(t.equipment)result.equipment=t.equipment;
 if(t.durationLabel)result.durationLabel=t.durationLabel;
 if(item.category==='EAT')result.ingredients=item.ingredients.map((ingredient,index)=>({...ingredient,tag:ingredient.tag??resolveIngredient(ingredient.name)?.id,name:t.ingredientNames?.[index]??ingredient.name,unit:t.ingredientUnits?.[index]??ingredient.unit}));
 return result as T;
}
