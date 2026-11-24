import type {AdEvent} from '../native/ads-policy';
declare global{interface Window{__lifespinnerAds?:boolean;}}
let sequence=0;
let cancelPending:(()=>void)|null=null;
export function hasNativeAds(){return window.__lifespinnerAds===true;}
export function adEvent(event:AdEvent){if(event==='busy')cancelPending?.();if(!hasNativeAds())return;const bridge=(window as Window&{ReactNativeWebView?:{postMessage(raw:string):void}}).ReactNativeWebView;try{bridge?.postMessage(JSON.stringify({type:'lifespinner.ads.v1',event,seq:++sequence}));}catch{}}

// A Spin request is an explicit opportunity. Only a native continuation permits
// the wheel to start; completion counts are sent separately after a result.
export function requestSpin():Promise<boolean>{
 const bridge=(window as Window&{ReactNativeWebView?:{postMessage(raw:string):void}}).ReactNativeWebView;
 if(!hasNativeAds()||!bridge)return Promise.resolve(true);
 const seq=++sequence;
 return new Promise(resolve=>{
  let finished=false;
  const cancel=()=>finish(false);
  const finish=(continueSpin:boolean)=>{if(finished)return;finished=true;if(cancelPending===cancel)cancelPending=null;clearTimeout(timer);window.removeEventListener('lifespinner.ads.response.v1',receive);resolve(continueSpin);};
  const receive=(event:Event)=>{const detail=(event as CustomEvent).detail;if(!detail||detail.seq!==seq)return;if(detail.stage==='showing'){clearTimeout(timer);if(cancelPending===cancel)cancelPending=null;}else if(detail.stage==='continue')finish(true);};
  const timer=setTimeout(()=>{adEvent('busy');finish(false);},15000);
  cancelPending?.();cancelPending=cancel;
  window.addEventListener('lifespinner.ads.response.v1',receive);
  try{bridge.postMessage(JSON.stringify({type:'lifespinner.ads.v1',event:'request',seq}));}catch{finish(true);}
 });
}
