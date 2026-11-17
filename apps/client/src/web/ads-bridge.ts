import type {AdEvent} from '../native/ads-policy';
declare global{interface Window{__lifespinnerAds?:boolean;}}
let sequence=0;
export function hasNativeAds(){return window.__lifespinnerAds===true;}
export function adEvent(event:AdEvent){if(!hasNativeAds())return;const bridge=(window as Window&{ReactNativeWebView?:{postMessage(raw:string):void}}).ReactNativeWebView;try{bridge?.postMessage(JSON.stringify({type:'lifespinner.ads.v1',event,seq:++sequence}));}catch{}}
