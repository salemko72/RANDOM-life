/** Two durable file slots: a failed write cannot destroy the committed catalog. */
const MAX=8*1024*1024,KEY='random-life.consumer-catalog.slot.v1';
type Files={documentDirectory:string|null;readAsStringAsync:(uri:string)=>Promise<string>;writeAsStringAsync:(uri:string,value:string)=>Promise<void>;deleteAsync?:(uri:string,options:{idempotent:boolean})=>Promise<void>};
type Pointer={getItem:(key:string)=>Promise<string|null>;setItem:(key:string,value:string)=>Promise<void>};
export function parseCatalogMessage(raw:string):string|null{try{if(raw.length>MAX)return null;const message=JSON.parse(raw);const s=message.snapshot;if(message.type!=='random-life.consumer-catalog.save.v1'||!s||s.schema!==1||!Array.isArray(s.items)||s.items.length>10000||!(s.version===null||typeof s.version==='string'&&/^[a-f0-9]{64}$/.test(s.version))||!Number.isFinite(s.checkedAt)||s.checkedAt<0||!Number.isFinite(s.savedAt)||s.savedAt<0)return null;return JSON.stringify(s);}catch{return null;}}
export function parseCatalogClearMessage(raw:string):string|null{try{if(raw.length>300)return null;const m=JSON.parse(raw);return m.type==='random-life.consumer-catalog.clear.v1'&&typeof m.requestId==='string'&&/^[a-z0-9-]{8,80}$/.test(m.requestId)?m.requestId:null;}catch{return null;}}
export function createNativeCatalogStorage(files:Files,pointer:Pointer){
 const path=(slot:string)=>{if(!files.documentDirectory)throw Error('CATALOG_DIRECTORY');return files.documentDirectory+'lifespinner-consumer-catalog-'+slot+'.json';};let queue=Promise.resolve();
 return{
 async read():Promise<string|null>{try{const slot=await pointer.getItem(KEY);if(slot!=='a'&&slot!=='b')return null;const raw=await files.readAsStringAsync(path(slot));return parseCatalogMessage(JSON.stringify({type:'random-life.consumer-catalog.save.v1',snapshot:JSON.parse(raw)}));}catch{return null;}},
 clear():Promise<void>{queue=queue.catch(()=>{}).then(async()=>{await pointer.setItem(KEY,'');if(!files.deleteAsync)throw Error('CATALOG_CLEAR_UNAVAILABLE');await Promise.all(['a','b'].map(slot=>files.deleteAsync!(path(slot),{idempotent:true})));});return queue;},
 write(raw:string):Promise<void>{queue=queue.catch(()=>{}).then(async()=>{const current=await pointer.getItem(KEY),slot=current==='a'?'b':'a';await files.writeAsStringAsync(path(slot),raw);await pointer.setItem(KEY,slot);});return queue;}
 };
}
