import{expect,test}from'vitest';import{readFileSync}from'node:fs';
import{memoizeCatalogProjection}from'../apps/client/src/web/catalog-projection';
import{createContentDraftTranslator}from'../packages/shared/src/content-draft-translations';
const source=JSON.parse(readFileSync('content/i18n-2026-11-18/source-catalog.json','utf8')).items;
const bundle=JSON.parse(readFileSync('content/i18n-2026-11-18/draft-overlay.json','utf8'));
test('repeated reads reuse the projection but new editorial arrays are checked again',()=>{
 const project=memoizeCatalogProjection(createContentDraftTranslator(bundle.items)),rows=[source[0]],first=project(rows);
 expect(first[0].translations?.de).toBeDefined();expect(project(rows)).toBe(first);
 const changed={...source[0],translations:{...source[0].translations,en:{...source[0].translations.en,summary:'Changed editorial text'}}};const next=project([changed]);
 expect(next).not.toBe(first);expect(next[0]).toBe(changed);expect(next[0].translations?.de).toBeUndefined();expect(source[0].translations.de).toBeUndefined();
});
