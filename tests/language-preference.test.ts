import{expect,test}from'vitest';
import{chooseSupportedLocale,readLanguagePreference,LANGUAGE_PREFERENCE_KEY}from'../packages/shared/src/language-preference';
const ready=['en','bs']as const;
test('honors ordered supported device languages and ignores unfinished UI locales',()=>{
 expect(chooseSupportedLocale(['de-DE','bs-BA','en-US'],ready,'en')).toBe('bs');
 expect(chooseSupportedLocale(['de-DE'],ready,'en')).toBe('en');
 expect(chooseSupportedLocale(['en-GB','bs-BA'],ready,'en')).toBe('en');
});
test('normalizes regions, case, separators and BHS device families',()=>{
 for(const tag of ['bs-BA','BS_ba','hr-HR','sr-Latn-RS','sr-Cyrl-RS'])expect(chooseSupportedLocale([tag],ready,'en')).toBe('bs');
 expect(chooseSupportedLocale(['en-US-u-ca-gregory'],ready,'en')).toBe('en');
});
test('can select future reviewed language families without activating them globally',()=>{
 const future=['en','bs','es','pt-BR','de','it']as const;
 for(const[tag,expected]of [['es-MX','es'],['pt-PT','pt-BR'],['pt_BR','pt-BR'],['de-AT','de'],['it-CH','it']]as const)expect(chooseSupportedLocale([tag],future,'en')).toBe(expected);
 expect(chooseSupportedLocale(['pt-PT'],['pt-BR','pt-PT']as const,'pt-BR')).toBe('pt-PT');
});
test('handles malformed tags and never returns a locale outside the ready list',()=>{
 expect(chooseSupportedLocale(['<script>','en--US','*','x'.repeat(500),'bs-BA'],ready,'en')).toBe('bs');
 expect(chooseSupportedLocale(['fr-FR'],ready,'en')).toBe('en');
 expect(()=>chooseSupportedLocale([],[]as string[],'en')).toThrow();
});
test('preserves legacy explicit en/bs and stored auto without freezing a resolved language',()=>{
 expect(LANGUAGE_PREFERENCE_KEY).toBe('random-life.locale.v1');
 for(const value of ['en','bs','auto']as const)expect(readLanguagePreference({getItem:()=>value},ready)).toBe(value);
});
test('new installs, unavailable storage and corrupt choices default to automatic',()=>{
 for(const value of [null,'','undefined','{"locale":"bs"}','es'])expect(readLanguagePreference({getItem:()=>value},ready)).toBe('auto');
 expect(readLanguagePreference({getItem:()=>{throw Error('blocked')}},ready)).toBe('auto');
});
