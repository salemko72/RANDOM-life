export const NATIVE_BACK_EVENT='lifespinner.native-back';
export type BackState={busy:boolean;image:boolean;panel:boolean;details:boolean;result:boolean;editing:boolean;onboarding:boolean};
export function backAction(s:BackState){if(s.busy)return 'consume';if(s.image)return 'image';if(s.editing||s.onboarding)return 'profile';if(s.panel)return 'panel';if(s.details)return 'details';if(s.result)return 'home';return 'exit';}
export function validBackRequest(value:unknown):value is string{return typeof value==='string'&&/^back-[a-zA-Z0-9-]{1,80}$/.test(value);}
export function nativeBackScript(requestId:string){if(!validBackRequest(requestId))throw Error('Invalid back request');return `document.dispatchEvent(new CustomEvent('${NATIVE_BACK_EVENT}',{bubbles:true,detail:{requestId:${JSON.stringify(requestId)}}}));true;`;}
export function parseBackResult(raw:string,pending:string|null):boolean|null{if(!pending||raw.length>500)return null;try{const x=JSON.parse(raw);return x.type==='lifespinner.back-result.v1'&&x.requestId===pending&&validBackRequest(x.requestId)&&typeof x.handled==='boolean'?x.handled:null;}catch{return null;}}
