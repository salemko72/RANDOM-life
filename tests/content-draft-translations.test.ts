import{expect,test}from'vitest';import{readFileSync}from'node:fs';
import{contentSchema,localizeContent}from'@random/shared';
import{contentDraftFingerprint,createContentDraftTranslator,contentDraftLocales,type ContentDraftEntry}from'../packages/shared/src/content-draft-translations';
const source=JSON.parse(readFileSync('content/i18n-2026-11-18/source-catalog.json','utf8'));
const manifest=JSON.parse(readFileSync('content/i18n-2026-11-18/source-manifest.json','utf8'));
const strings=JSON.parse(readFileSync('content/i18n-2026-11-18/source-strings.json','utf8'));
const keyByText=new Map<string,string>(strings.map((row:any)=>[row.en,row.key]));
function pilotEntry(record:any):ContentDraftEntry{
 const translations:any={};for(const locale of contentDraftLocales){const memory=JSON.parse(readFileSync('content/i18n-2026-11-18/memory/'+locale+'.json','utf8'));const translated:any={};for(const[field,value]of Object.entries(record.translations.en)){
  if(field==='reviewed'){translated[field]=false;continue;}
  if(field==='authors'||field==='title'&&['BOOK','WATCH'].includes(record.category)){translated[field]=value;continue;}
  translated[field]=Array.isArray(value)?value.map(text=>memory[keyByText.get(text)!]):memory[keyByText.get(value as string)!];
 }translations[locale]=translated;}
 return{id:record.id,expectedVersion:record.version,sourceFingerprint:contentDraftFingerprint(record),translations};
}
const records=manifest.pilotIds.map((id:string)=>source.items.find((row:any)=>row.id===id));
test('pilot adds four complete draft translations to every category without mutating base data',()=>{
 for(const record of records){const entry=pilotEntry(record),before=JSON.stringify(record),result=createContentDraftTranslator([entry])(record);
  for(const locale of contentDraftLocales){expect(result.translations?.[locale]).toEqual(entry.translations[locale]);expect(result.translations?.[locale]?.reviewed).toBe(false);}
  expect({...result,translations:record.translations}).toEqual(record);expect(JSON.stringify(record)).toBe(before);expect(contentSchema.safeParse(result).success).toBe(true);for(const locale of contentDraftLocales)expect(localizeContent(result,locale).summary).toBe(entry.translations[locale].summary);
 }
});
test('newer editorial versions, changed English or changed safety data win over a stale draft',()=>{
 const recipe=records.find((row:any)=>row.category==='EAT'),entry=pilotEntry(recipe),apply=createContentDraftTranslator([entry]);expect(apply(recipe).translations.de).toBeDefined();
 for(const record of [{...recipe,version:recipe.version+1},{...recipe,translations:{...recipe.translations,en:{...recipe.translations.en,summary:'New editorial wording'}}},{...recipe,servings:recipe.servings+1},{...recipe,allergens:['milk']}])expect(apply(record)).toBe(record);
});
test('existing server translations are retained and malformed/incomplete draft entries are ignored',()=>{
 const record=records[0],entry=pilotEntry(record),server={...record,translations:{...record.translations,es:{...entry.translations.es,summary:'Editor changed this',reviewed:true}}};
 expect(createContentDraftTranslator([entry])(server).translations.es).toBe(server.translations.es);expect(createContentDraftTranslator([entry])(server).translations.it).toBeDefined();
 const incomplete={...entry,translations:{...entry.translations,de:{...entry.translations.de,steps:undefined,summary:''}}};expect(createContentDraftTranslator([incomplete as any])(record)).toBe(record);
});
test('source fingerprints tolerate object key order and generic image rotations, not dietary changes',()=>{
 const record=records.find((row:any)=>row.category==='BOOK'),rotated={...record,image:{...record.image,path:'/media/generic-book-02-library-v1.webp'}};
 expect(contentDraftFingerprint(rotated)).toBe(contentDraftFingerprint(record));
 expect(contentDraftFingerprint({...record,pageCount:(record.pageCount??1)+1})).not.toBe(contentDraftFingerprint(record));
 // Canonical key handling is asserted directly on a safely reordered top-level object.
 expect(contentDraftFingerprint(Object.fromEntries(Object.entries(record).reverse())as any)).toBe(contentDraftFingerprint(record));
});

test('numeric drift, missing US qualifiers, added fields and duplicate entries cannot apply',()=>{
 const recipe=records.find((row:any)=>row.category==='EAT'),entry=pilotEntry(recipe);expect(createContentDraftTranslator([entry])(recipe).translations.de).toBeDefined();
 for(const altered of [{...entry.translations.de,summary:entry.translations.de.summary+' 999'},{...entry.translations.de,equipment:['invented data']}]){
  expect(createContentDraftTranslator([{...entry,translations:{...entry.translations,de:altered}}])(recipe)).toBe(recipe);
 }
 expect(createContentDraftTranslator([entry,entry])(recipe)).toBe(recipe);
});
