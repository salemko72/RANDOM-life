import type{Locale}from'@random/shared';
import es from'./i18n/es.json';
import ptBR from'./i18n/pt-BR.json';
import de from'./i18n/de.json';
import it from'./i18n/it.json';
/** Draft UI assets are separate from the ready, selectable content locales. */
export const draftUiLocales=['es','pt-BR','de','it'] as const;
export type UiLocale=Locale|typeof draftUiLocales[number];
const dictionaries:Record<string,Record<string,string>>={es,'pt-BR':ptBR,de,it};
export function uiText(en:string,bs:string,locale:UiLocale|string):string{
 if(locale==='bs')return bs;
 const dictionary=Object.hasOwn(dictionaries,locale)?dictionaries[locale]:undefined;
 return dictionary&&Object.hasOwn(dictionary,en)?dictionary[en]:en;
}
/** Named text substitution only. Render as React text/attributes, never raw HTML. */
export function formatUi(key:string,locale:UiLocale|string,values:Record<string,string|number>):string{
 return uiText(key,key,locale).replace(/\{([a-zA-Z0-9_]+)\}/g,(token,name:string)=>Object.hasOwn(values,name)?String(values[name]):token);
}

const localeCodes:Record<string,string>={en:'ENG',bs:'BHS',es:'ESP','pt-BR':'POR',de:'DEU',it:'ITA'};
export function uiLocaleCode(locale:UiLocale|string):string{return Object.hasOwn(localeCodes,locale)?localeCodes[locale]:'ENG';}
