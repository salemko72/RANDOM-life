export const PERFORMANCE_KEY='random-life.performance.v1';
export type PerformanceEvent={name:string;at:number;metrics:Record<string,number>};
const names=new Set(['native_start','profile_loaded','assets_ready','webview_loaded','web_boot','ui_ready','catalog','catalog_sync','spin','long_task','page_error','image_loaded']);
const metrics=new Set(['durationMs','elapsedMs','frames','p95Ms','maxMs','slowFrames','hidden','count','backup','width','height','reduced','failed','launch','cached','downloadBytes']);
export function parsePerformanceMessage(raw:string):PerformanceEvent|null{
 if(raw.length>4000)return null;
 try{const x=JSON.parse(raw);if(x.type!==PERFORMANCE_KEY||!names.has(x.name)||!Number.isFinite(x.at)||x.at<0||!x.metrics||typeof x.metrics!=='object')return null;const clean:Record<string,number>={};for(const[k,v]of Object.entries(x.metrics))if(metrics.has(k)&&typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<1e12)clean[k]=Math.round(v*100)/100;return{name:x.name,at:Math.round(x.at),metrics:clean};}catch{return null;}
}
export class PerformanceLog{
 rows:PerformanceEvent[]=[];
 constructor(raw?:string|null){try{const rows=JSON.parse(raw??'[]');if(Array.isArray(rows))for(const row of rows.slice(-80)){const clean=parsePerformanceMessage(JSON.stringify({...row,type:PERFORMANCE_KEY}));if(clean)this.add(clean);}}catch{}}
 add(event:PerformanceEvent){this.rows.push(event);if(this.rows.length>80)this.rows.splice(0,this.rows.length-80);}
}
