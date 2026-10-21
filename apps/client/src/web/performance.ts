import appConfig from '../../app.json';
import {PerformanceLog,PERFORMANCE_KEY} from '../native/performance-log';
const sessionKey=PERFORMANCE_KEY+'.web.'+appConfig.expo.version;
let stored:string|null=null;try{stored=sessionStorage.getItem(sessionKey);}catch{}
const log=new PerformanceLog(stored);let longTasksLogged=0;
export function motionReduced(){return window.matchMedia('(prefers-reduced-motion: reduce)').matches;}
const bridge=()=> (window as Window&{ReactNativeWebView?:{postMessage:(data:string)=>void}}).ReactNativeWebView;
export function performanceEvent(name:string,metrics:Record<string,number>={}){
 const event={name,at:Date.now(),metrics};log.add(event);try{sessionStorage.setItem(sessionKey,JSON.stringify(log.rows));}catch{}try{bridge()?.postMessage(JSON.stringify({type:PERFORMANCE_KEY,...event}));}catch{}
}
export function installPerformance(){
 performanceEvent('web_boot',{elapsedMs:performance.now(),width:innerWidth,height:innerHeight,reduced:Number(motionReduced()),revision:2});
 try{if(PerformanceObserver.supportedEntryTypes?.includes('longtask')){const observer=new PerformanceObserver(list=>{for(const entry of list.getEntries())if(longTasksLogged++<20)performanceEvent('long_task',{durationMs:entry.duration});});observer.observe({entryTypes:['longtask']});}}catch{}
 window.addEventListener('error',()=>performanceEvent('page_error',{count:1}));
 window.addEventListener('unhandledrejection',()=>performanceEvent('page_error',{count:1}));
}
export async function exportPerformance(){
 if(bridge()){bridge()!.postMessage(JSON.stringify({type:'random-life.performance.export.v1'}));return;}
 const report=JSON.stringify({schema:1,version:appConfig.expo.version,build:appConfig.expo.android.versionCode,exportedAt:new Date().toISOString(),viewport:{width:innerWidth,height:innerHeight},events:log.rows},null,2);
 const url=URL.createObjectURL(new Blob([report],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='LifeSpinner-diagnostics.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function summarizeFrames(frames:number[],hidden:boolean,reduced:boolean,durationMs:number){
 const sorted=[...frames].sort((a,b)=>a-b);return{durationMs,frames:frames.length,p95Ms:sorted[Math.max(0,Math.ceil(sorted.length*.95)-1)]??0,maxMs:sorted.at(-1)??0,slowFrames:frames.filter(ms=>ms>34).length,hidden:Number(hidden),reduced:Number(reduced)};
}
