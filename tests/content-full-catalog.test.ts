import{expect,test}from'vitest';import{readFileSync}from'node:fs';
import{contentSchema,publicationIssues,localizeContent}from'@random/shared';
import{createContentDraftTranslator,contentDraftLocales,type ContentDraftEntry}from'../packages/shared/src/content-draft-translations';
import{withGenericArtwork}from'../packages/shared/src/generic-artwork';import{applyRecipeWording}from'../apps/client/src/web/recipe-wording';
const source=JSON.parse(readFileSync('content/i18n-2026-11-18/source-catalog.json','utf8'));
const bundle=JSON.parse(readFileSync('content/i18n-2026-11-18/draft-overlay.json','utf8'));
const reserve=JSON.parse(readFileSync('apps/client/src/web/backup/catalog.json','utf8'));
const apply=createContentDraftTranslator(bundle.items as ContentDraftEntry[]);
test('all467 records have4 complete localizable drafts with existing EN/BHS and data intact',()=>{
 expect(source.items).toHaveLength(467);expect(bundle.items).toHaveLength(467);
 const before=JSON.stringify(source);for(const record of source.items){const result=apply(record);expect(contentSchema.safeParse(result).success,record.id).toBe(true);expect(publicationIssues(result),record.id).toEqual([]);expect({...result,translations:record.translations}).toEqual(record);
  for(const locale of contentDraftLocales){const translated=result.translations[locale];expect(translated?.reviewed,record.id).toBe(false);const display=localizeContent(result,locale);expect(display.language).toBe(locale);expect(display.summary).toBe(translated.summary);
   if(record.category==='EAT'){expect(display.ingredients.map((item:any)=>item.quantity)).toEqual(record.ingredients.map((item:any)=>item.quantity));expect(display.servings).toBe(record.servings);expect(display.allergens).toEqual(record.allergens);expect(display.phosphateAssessment).toEqual(record.phosphateAssessment);expect(display.dietaryAssessment).toEqual(record.dietaryAssessment);}
   if(record.category==='BOOK'||record.category==='WATCH')expect(display.title).toBe(record.translations.en.title);
  }
 }expect(JSON.stringify(source)).toBe(before);
});
test('cold reserve and serialized cached input receive all400draft translations without changing source objects',()=>{
 const before=JSON.stringify(reserve);for(const record of reserve.items){const projected=withGenericArtwork(applyRecipeWording(record));const fromReserve=apply(projected);const fromCache=apply(JSON.parse(JSON.stringify(projected)));for(const locale of contentDraftLocales){expect(fromReserve.translations[locale],record.id).toBeDefined();expect(fromCache.translations[locale]).toEqual(fromReserve.translations[locale]);}}
 expect(JSON.stringify(reserve)).toBe(before);
});
test('complete overlay stays within existing catalogue and reserve data budgets',()=>{
 const publicBytes=Buffer.byteLength(JSON.stringify({items:source.items.map(apply)}));expect(publicBytes).toBeLessThan(8*1024*1024);
 expect(Buffer.byteLength(JSON.stringify(reserve))+reserve.imageBytes+Buffer.byteLength(JSON.stringify(bundle))).toBeLessThan(10*1024*1024);
});
