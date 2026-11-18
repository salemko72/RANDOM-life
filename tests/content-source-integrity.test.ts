import{test,expect}from'vitest';import{readFileSync}from'node:fs';import{createRequire}from'node:module';
const{assertTranslationSource}=createRequire(import.meta.url)('../scripts/lib/content-translation-source.mjs');
const source=JSON.parse(readFileSync('content/i18n-2026-11-18/source-catalog.json','utf8')),manifest=JSON.parse(readFileSync('content/i18n-2026-11-18/source-manifest.json','utf8'));
test('compiler verifies the actual source projection, version, count and unique IDs',()=>{
 expect(()=>assertTranslationSource(source,manifest)).not.toThrow();
 const edited=structuredClone(source);edited.items[0].summary+=' drift';expect(()=>assertTranslationSource(edited,manifest)).toThrow();
 expect(()=>assertTranslationSource({...source,serverVersion:'wrong'},manifest)).toThrow();
 expect(()=>assertTranslationSource({...source,items:source.items.slice(1)},manifest)).toThrow();
 const duplicate=structuredClone(source);duplicate.items[1]=duplicate.items[0];expect(()=>assertTranslationSource(duplicate,manifest)).toThrow();
});
