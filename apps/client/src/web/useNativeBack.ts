import{useEffect,useRef}from'react';
import{NATIVE_BACK_EVENT,validBackRequest}from'../native/back-navigation';
/** An acknowledgement only answers an existing hardware request; false permits Android's root exit. */
export function useNativeBack(handler:()=>boolean,{capture=false,enabled=true}={}){
 const current=useRef(handler);current.current=handler;
 useEffect(()=>{if(!enabled)return;const listener=(event:Event)=>{const requestId=(event as CustomEvent)?.detail?.requestId;if(!validBackRequest(requestId))return;event.stopImmediatePropagation();const handled=current.current();(window as Window&{ReactNativeWebView?:{postMessage:(value:string)=>void}}).ReactNativeWebView?.postMessage(JSON.stringify({type:'lifespinner.back-result.v1',requestId,handled}));};window.addEventListener(NATIVE_BACK_EVENT,listener,capture);return()=>window.removeEventListener(NATIVE_BACK_EVENT,listener,capture);},[capture,enabled]);
}
