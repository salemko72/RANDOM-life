import{sanitizeLanguageTags}from'@random/shared';
/** Foreground updates notify React without reloading the current screen. */
export function deviceLanguageScript(tags:readonly string[],notify=false):string{
 return `window.__lifespinnerDeviceLanguages=${JSON.stringify(sanitizeLanguageTags(tags))};${notify?"window.dispatchEvent(new Event('languagechange'));":''}true;`;
}
