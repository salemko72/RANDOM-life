import type{Locale}from'@random/shared';
export const APP_SHARE_ORIGIN='https://random-life-preview.pages.dev';
export const appShareUrl=(locale:Locale)=>`${APP_SHARE_ORIGIN}/get-app?lang=${locale}`;
const description=(locale:Locale)=>locale==='en'?'LifeSpinner — discover recipes, books, films and ideas for your next moment.':'LifeSpinner — otkrij recepte, knjige, filmove i ideje za svoj sljedeći trenutak.';
export function parseAppShare(raw:string):{title:string;message:string;url:string}|null{
 if(raw.length>300)return null;try{const x=JSON.parse(raw);if(!x||x.type!=='lifespinner.app-share.v1'||!['en','bs'].includes(x.locale)||Object.keys(x).some(k=>!['type','locale'].includes(k)))return null;const url=appShareUrl(x.locale);return{title:'LifeSpinner',message:description(x.locale)+'\n'+url,url};}catch{return null;}
}
export async function shareApp(locale:Locale):Promise<'shared'|'copied'|'cancelled'|'manual'>{
 const payload={type:'lifespinner.app-share.v1',locale},share=parseAppShare(JSON.stringify(payload))!;
 const bridge=(window as Window&{ReactNativeWebView?:{postMessage:(value:string)=>void}}).ReactNativeWebView;
 if(bridge){bridge.postMessage(JSON.stringify(payload));return 'shared';}
 if(navigator.share)try{await navigator.share({title:share.title,text:description(locale),url:share.url});return 'shared';}catch(e){if(e instanceof Error&&e.name==='AbortError')return 'cancelled';}
 try{await navigator.clipboard.writeText(share.message);return 'copied';}catch{return 'manual';}
}
