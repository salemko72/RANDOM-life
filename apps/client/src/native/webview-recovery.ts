export type WebViewSnapshot={generation:number;phase:'starting'|'recovering'|'waiting'|'ready'|'failed';uri:string|null};
type Options={active:boolean;prepare:()=>Promise<string>;changed:(state:WebViewSnapshot)=>void;metric:(name:string)=>void;now?:()=>number};

// A generation identifies one native WebView. WKWebView also emits termination
// from destroyWebView, so callbacks from an unmounted generation must be ignored.
export function createWebViewRecovery(options:Options){
 let state:WebViewSnapshot={generation:0,phase:'starting',uri:null};
 let active=options.active,disposed=false,started=false,busy=false,pending=false;
 let attempts:number[]=[];
 const now=options.now??Date.now;
 const publish=(patch:Partial<WebViewSnapshot>)=>{state={...state,...patch};if(!disposed)options.changed({...state});};
 const current=(generation:number)=>!disposed&&state.phase==='ready'&&state.generation===generation;
 async function prepare(){
  if(disposed||busy||!pending)return;
  if(!active){publish({phase:'waiting'});return;}
  pending=false;busy=true;
  const generation=state.generation;
  publish({phase:started?'recovering':'starting'});started=true;
  try{
   const uri=await options.prepare();
   if(disposed||generation!==state.generation)return;
   // The OS can background us during file I/O. Do not mount a document there;
   // reread the durable catalogue and latest in-memory preferences on return.
   if(!active){pending=true;publish({phase:'waiting'});return;}
   publish({phase:'ready',uri});options.metric('webview_prepared');
  }catch{
   if(!disposed&&generation===state.generation){pending=false;publish({phase:'failed'});options.metric('webview_recovery_failed');}
  }finally{busy=false;}
 }
 return{
  snapshot:()=>({...state}),current,
  start(){if(started||disposed)return;pending=true;void prepare();},
  active(value:boolean){active=value;if(active&&pending)void prepare();},
  terminated(generation:number){
   if(!current(generation))return;
   options.metric('web_content_terminated');
   const time=now();attempts=attempts.filter(at=>time-at<60000);attempts.push(time);
   // Invalidate BEFORE React unmounts the old view and the SDK calls us again.
   publish({generation:generation+1,phase:attempts.length>2?'failed':active?'recovering':'waiting'});
   if(attempts.length>2){options.metric('webview_recovery_failed');return;}
   pending=true;void prepare();
  },
  failed(generation:number){if(!current(generation))return;pending=false;publish({generation:generation+1,phase:'failed'});options.metric('page_error');},
  retry(){if(disposed||state.phase!=='failed')return;attempts=[];publish({generation:state.generation+1,phase:'recovering'});pending=true;void prepare();},
  dispose(){disposed=true;pending=false;},
 };
}
