import{sanitizeLanguageTags}from'@random/shared';
export function preferredDeviceLanguages(native:unknown,browser:{languages?:readonly string[];language?:string}):string[]{
 const tags=sanitizeLanguageTags(native);
 if(tags.length)return tags;
 const languages=sanitizeLanguageTags(browser.languages);
 return languages.length?languages:sanitizeLanguageTags([browser.language]);
}
