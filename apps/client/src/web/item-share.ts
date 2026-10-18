import type {Locale} from '@random/shared';
export const SHARE_ORIGIN='https://random-life-preview.pages.dev';
export function itemShareUrl(id:string,locale:Locale){return `${SHARE_ORIGIN}/item/${encodeURIComponent(id)}?lang=${locale}`;}
export function parseNativeShare(raw:string):{title:string;message:string;url:string}|null{
 if(raw.length>6000)return null;
 try{const m=JSON.parse(raw),url=new URL(m.url);if(m.type!=='random-life.share.v1'||url.origin!==SHARE_ORIGIN||!/^\/item\/[a-zA-Z0-9_-]{1,180}$/.test(url.pathname)||!['en','bs'].includes(url.searchParams.get('lang')??'')||typeof m.title!=='string'||m.title.length>500||typeof m.message!=='string'||m.message.length>2000)return null;return{title:m.title,message:m.message,url:url.href};}catch{return null;}
}
export async function shareItem(title:string,url:string):Promise<'shared'|'copied'|'cancelled'|'manual'>{
 const message=`${title}\n${url}`;
 const bridge=(window as Window&{ReactNativeWebView?:{postMessage:(value:string)=>void}}).ReactNativeWebView;
 if(bridge){bridge.postMessage(JSON.stringify({type:'random-life.share.v1',title,message,url}));return 'shared';}
 if(navigator.share){try{await navigator.share({title,url});return 'shared';}catch(error){if(error instanceof Error&&error.name==='AbortError')return 'cancelled';}}
 try{await navigator.clipboard.writeText(url);return 'copied';}catch{return 'manual';}
}
