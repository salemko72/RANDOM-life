export const NATIVE_STATE_KEY = 'RANDOM-life.local-state.v1';
export const LOCALE_KEY = 'random-life.locale.v1';
export const PROFILE_KEY = 'random-life.local-profile.v1';
export const EXPERIENCE_PREFIX = 'random-life.experience.';
const MAX_VALUE = 128 * 1024;
const MAX_STATE = 512 * 1024;
export type LocalState = Record<string, string>;
export function allowedKey(key: string): boolean {
 return key === 'random-life.sfx.v1' || key === PROFILE_KEY || key === LOCALE_KEY || (key.startsWith(EXPERIENCE_PREFIX) && key.length <= 200);
}
export function readSnapshot(raw: string | null): LocalState {
 try {
  const parsed: unknown = JSON.parse(raw || '{}');
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
  const result: LocalState = {};
  for (const [key,value] of Object.entries(parsed)) {
   if (!allowedKey(key) || typeof value !== 'string' || value.length > MAX_VALUE) return {};
   result[key] = value;
  }
  return JSON.stringify(result).length <= MAX_STATE ? result : {};
 } catch { return {}; }
}
export function applyStorageMessage(state: LocalState, raw: string): LocalState | null {
 if (raw.length > MAX_STATE) return null;
 try {
  const message = JSON.parse(raw);
  if (!message || message.type !== 'random-life.local-state.v1') return null;
  if (message.operation === 'clear') return {};
  if (typeof message.key !== 'string' || !allowedKey(message.key)) return null;
  const next = {...state};
  if (message.operation === 'remove') delete next[message.key];
  else if (message.operation === 'set' && typeof message.value === 'string' && message.value.length <= MAX_VALUE) next[message.key] = message.value;
  else return null;
  return JSON.stringify(next).length <= MAX_STATE ? next : null;
 } catch { return null; }
}
// Capture each snapshot now; serialize writes so a slow older write cannot win.
export function createSnapshotWriter(write: (value: string) => Promise<unknown>, onError: () => void) {
 let queue = Promise.resolve();
 return (state: LocalState) => {
  const value = JSON.stringify(state);
  queue = queue.then(() => write(value)).then(() => undefined).catch(() => { onError(); });
  return queue;
 };
}
export function seedPreviewHtml(html: string, state: LocalState): string {
 const safeState = JSON.stringify(readSnapshot(JSON.stringify(state))).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
 const bootstrap = `<script>(function(){
 var seed=${safeState}, memory=Object.create(null), nativeStore=null;
 var allowed=function(k){return k===${JSON.stringify(PROFILE_KEY)}||k===${JSON.stringify(LOCALE_KEY)}||(k.indexOf(${JSON.stringify(EXPERIENCE_PREFIX)})===0&&k.length<=200);};
 try {nativeStore=window.localStorage;var probe='random-life.bridge-probe';nativeStore.setItem(probe,'1');nativeStore.removeItem(probe);}catch(e){nativeStore=null;}
 if(nativeStore){try{for(var i=nativeStore.length-1;i>=0;i--){var key=nativeStore.key(i);if(key&&allowed(key))nativeStore.removeItem(key);}}catch(e){nativeStore=null;}}
 Object.keys(seed).forEach(function(k){memory[k]=seed[k];if(nativeStore){try{nativeStore.setItem(k,seed[k]);}catch(e){}}});
 function send(op,k,v){if(window.ReactNativeWebView)window.ReactNativeWebView.postMessage(JSON.stringify({type:'random-life.local-state.v1',operation:op,key:k,value:v}));}
 var facade={getItem:function(k){k=String(k);if(allowed(k))return Object.prototype.hasOwnProperty.call(memory,k)?memory[k]:null;try{return nativeStore?nativeStore.getItem(k):(Object.prototype.hasOwnProperty.call(memory,k)?memory[k]:null);}catch(e){return null;}},setItem:function(k,v){k=String(k);v=String(v);memory[k]=v;try{if(nativeStore)nativeStore.setItem(k,v);}catch(e){}if(allowed(k))send('set',k,v);},removeItem:function(k){k=String(k);delete memory[k];try{if(nativeStore)nativeStore.removeItem(k);}catch(e){}if(allowed(k))send('remove',k);},clear:function(){memory=Object.create(null);try{if(nativeStore)nativeStore.clear();}catch(e){}send('clear');},key:function(i){var keys=Object.keys(memory);return keys[i]||null;}};
 Object.defineProperty(facade,'length',{get:function(){return Object.keys(memory).length;}});
 Object.defineProperty(window,'localStorage',{configurable:true,value:facade});
})();</script>`;
 const firstScript = html.search(/<script\b/i);
 if (firstScript >= 0) return html.slice(0, firstScript) + bootstrap + html.slice(firstScript);
 return html + bootstrap;
}
