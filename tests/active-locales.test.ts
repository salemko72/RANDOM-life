import{expect,it}from'vitest';
import*as localization from'../packages/shared/src/localization';
import{chooseSupportedLocale,readLanguagePreference}from'../packages/shared/src/language-preference';
import{parseAppShare,appShareUrl}from'../apps/client/src/web/app-share';
import{itemShareUrl,parseNativeShare}from'../apps/client/src/web/item-share';
const six=['en','bs','es','pt-BR','de','it']as const;
it('offers all six application locales and resolves device language families',()=>{
 expect(localization.appLocales).toEqual(six);
 for(const[tag,code]of [['es-MX','es'],['pt-PT','pt-BR'],['de-AT','de'],['it-CH','it']]as const){expect(chooseSupportedLocale([tag],localization.appLocales,'en')).toBe(code);expect(readLanguagePreference({getItem:()=>code},localization.appLocales)).toBe(code);}
});
it('accepts native app sharing in every active locale while public links retain old-server compatibility',()=>{
 for(const locale of six){const share=parseAppShare(JSON.stringify({type:'lifespinner.app-share.v1',locale}));expect(share).not.toBeNull();expect(share?.url).toBe('https://random-life-preview.pages.dev/get-app?lang='+(locale==='bs'?'bs':'en'));}
 expect(parseAppShare(JSON.stringify({type:'lifespinner.app-share.v1',locale:'fr'}))).toBeNull();
});
it('keeps item and install links functional for active locales without requiring a backend migration',()=>{
 for(const locale of six){const url=itemShareUrl('abc-123',locale);expect(new URL(url).searchParams.get('lang')).toBe(locale==='bs'?'bs':'en');expect(parseNativeShare(JSON.stringify({type:'random-life.share.v1',title:'title',message:'message',url}))?.url).toBe(url);expect(appShareUrl(locale)).toContain('lang='+(locale==='bs'?'bs':'en'));}
});
