import{expect,test}from'vitest';import{readFileSync}from'node:fs';
import{withGenericArtwork}from'../packages/shared/src/generic-artwork';
test('generic artwork alt remains generic in each new locale instead of overwriting it with BHS',()=>{
 const book=JSON.parse(readFileSync('content/i18n-2026-11-18/source-catalog.json','utf8')).items.find((row:any)=>row.category==='BOOK');
 for(const locale of ['es','pt-BR','de','it']){
  const input={...book,translations:{...book.translations,[locale]:{...book.translations.en,imageAlt:'Unverified poster/cover'}}};const result=withGenericArtwork(input);
  expect(result.translations[locale].imageAlt).not.toBe(book.translations.bs.imageAlt);expect(result.translations[locale].imageAlt).not.toBe('Unverified poster/cover');
  expect(result.image.path).toMatch(/^\/media\/generic-book-/);expect(result.image.provenance).toBeUndefined();
 }
});
