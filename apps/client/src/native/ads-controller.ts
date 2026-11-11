import {AdPolicy,type AdMessage} from './ads-policy';
export interface AdsAdapter{
 consent():Promise<boolean>;privacy():Promise<boolean>;initialize():Promise<void>;
 preload(events:{loaded():void;closed():void;failed():void}):{show():Promise<void>;dispose():void};
}
export function createAdController(deps:{sdk:AdsAdapter;read():Promise<string|null>;write(raw:string):Promise<void>;now():number}){
 let policy:AdPolicy,dead=false,active=false,ready=false,allowed=false,initialized=false,booting=false,showing=false,loaded=false,lastSeq=0,generation=0,nextLoadAt=0,adGeneration=0,loadedAt=0;
 let ad:ReturnType<AdsAdapter['preload']>|null=null;
 let writes:Promise<void>=Promise.resolve();
 const hydrated=deps.read().then(raw=>{policy=new AdPolicy(raw,deps.now());policy.setActive(active,deps.now());}).catch(()=>{policy=new AdPolicy(null,deps.now());policy.setActive(active,deps.now());});
 function persist(){const raw=policy.serialize(deps.now());writes=writes.catch(()=>{}).then(()=>deps.write(raw));return writes;}
 function drop(){++adGeneration;ad?.dispose();ad=null;loaded=false;}
 function preload(){
  if(ad&&!showing&&loaded&&deps.now()-loadedAt>3300000)drop();
  if(dead||!active||!ready||!allowed||!initialized||ad||showing||deps.now()<nextLoadAt)return;
  // Never show from these callbacks: only an explicit wheel-return can display an ad.
  const epoch=++adGeneration;
  ad=deps.sdk.preload({loaded:()=>{if(!dead&&epoch===adGeneration){loaded=true;loadedAt=deps.now();}},closed:()=>{if(epoch!==adGeneration)return;showing=false;drop();},failed:()=>{if(epoch!==adGeneration)return;showing=false;drop();nextLoadAt=deps.now()+60000;}});
 }
 async function boot(privacy=false){
  if(dead||booting||showing||!active||!ready)return;booting=true;allowed=false;drop();
  try{const consent=await(privacy?deps.sdk.privacy():deps.sdk.consent());if(dead)return;allowed=consent;if(!allowed)nextLoadAt=deps.now()+60000;if(allowed){if(!initialized){await deps.sdk.initialize();initialized=true;}preload();}}catch{allowed=false;nextLoadAt=deps.now()+60000;}finally{booting=false;}
 }
 async function opportunity(token:number){
  if(dead||!active||!ready||!allowed||!loaded||!ad||showing||deps.now()-loadedAt>3300000||!policy.eligible(deps.now()))return;
  showing=true;const candidate=ad;policy.reserve(deps.now());
  try{await persist();if(dead||token!==generation||!active||!allowed||candidate!==ad){showing=false;return;}loaded=false;await candidate.show();}catch{showing=false;drop();nextLoadAt=deps.now()+60000;}
 }
 return{
  receive(m:AdMessage){
   if(dead||m.seq<=lastSeq)return;lastSeq=m.seq;const token=++generation;
   void hydrated.then(()=>{
    if(dead)return;
    if(m.event==='ready'){ready=true;policy.ready(deps.now());if(!initialized&&!booting)void boot();else preload();}
    else if(m.event==='spin'){policy.spin(deps.now());void persist().catch(()=>{});preload();}
    else if(m.event==='home'){if(token===generation)void opportunity(token);preload();}
    else if(m.event==='privacy'){void boot(true);}
   }).catch(()=>{});
  },
  active(value:boolean){active=value;++generation;void hydrated.then(()=>{if(dead)return;policy.setActive(value,deps.now());if(!value)void persist().catch(()=>{});else if(ready&&!initialized&&deps.now()>=nextLoadAt)void boot();else preload();});},
  resetDocument(){lastSeq=0;++generation;ready=false;},
  dispose(){dead=true;++generation;drop();},
 };
}
