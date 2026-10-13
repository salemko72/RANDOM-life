import {runInNewContext} from 'node:vm';
import {describe,expect,it} from 'vitest';
import {applyStorageMessage,createSnapshotWriter,PROFILE_KEY,readSnapshot,seedPreviewHtml} from '../apps/client/src/native/profile-bridge';

describe('native profile persistence',()=>{
 it('restores safely before preview code with unavailable origin storage',()=>{
  const value='</script><script>globalThis.attacked=true</script>\u2028';
  const html=seedPreviewHtml('<html><script>app()</script></html>',{[PROFILE_KEY]:value});
  const code=html.slice(html.indexOf('<script>')+8,html.indexOf('</script>'));
  const messages:string[]=[];
  const window:any={ReactNativeWebView:{postMessage:(m:string)=>messages.push(m)}};
  Object.defineProperty(window,'localStorage',{configurable:true,get(){throw new Error('opaque origin');}});
  runInNewContext(code,{window});
  expect(window.localStorage.getItem(PROFILE_KEY)).toBe(value);
  expect(html.indexOf('app()')).toBeGreaterThan(html.indexOf('</script>'));
  window.localStorage.setItem(PROFILE_KEY,'updated');
  expect(applyStorageMessage({},messages.pop()!)).toEqual({[PROFILE_KEY]:'updated'});
  window.localStorage.setItem('auth.token','secret');
  expect(messages).toHaveLength(0);
  window.localStorage.removeItem(PROFILE_KEY);
  expect(applyStorageMessage({[PROFILE_KEY]:value},messages.pop()!)).toEqual({});
  window.localStorage.clear();
  expect(applyStorageMessage({[PROFILE_KEY]:value},messages.pop()!)).toEqual({});
 });
 it('rejects malformed, unrelated and excessive state',()=>{
  for(const raw of ['bad','null','{}',JSON.stringify({type:'random-life.local-state.v1',operation:'set',key:'auth.token',value:'secret'}),JSON.stringify({type:'random-life.local-state.v1',operation:'set',key:PROFILE_KEY,value:'x'.repeat(128*1024+1)})])expect(applyStorageMessage({},raw)).toBeNull();
  expect(readSnapshot('{"auth.token":"secret"}')).toEqual({});
  expect(readSnapshot(JSON.stringify({[PROFILE_KEY]:'hello'}))).toEqual({[PROFILE_KEY]:'hello'});
  const full=Object.fromEntries(Array.from({length:4},(_,i)=>['random-life.experience.'+i,'x'.repeat(128*1024-100)]));
  expect(applyStorageMessage(full,JSON.stringify({type:'random-life.local-state.v1',operation:'set',key:PROFILE_KEY,value:'x'.repeat(1000)}))).toBeNull();
 });
 it('replaces stale WebView storage with the stable native snapshot',()=>{
  const data:Record<string,string>={[PROFILE_KEY]:'stale','random-life.experience.old':'old','unrelated':'keep'};
  const storage={get length(){return Object.keys(data).length;},key:(i:number)=>Object.keys(data)[i],getItem:(k:string)=>data[k]??null,setItem:(k:string,v:string)=>{data[k]=v;},removeItem:(k:string)=>{delete data[k];},clear:()=>{for(const k of Object.keys(data))delete data[k];}};
  const window:any={localStorage:storage};
  const html=seedPreviewHtml('<script>app()</script>',{[PROFILE_KEY]:'current'});
  runInNewContext(html.slice(8,html.indexOf('</script>')),{window});
  expect(window.localStorage.getItem(PROFILE_KEY)).toBe('current');
  expect(window.localStorage.getItem('random-life.experience.old')).toBeNull();
  expect(window.localStorage.getItem('unrelated')).toBe('keep');
  expect(data[PROFILE_KEY]).toBe('current');
 });
 it('serializes writes and recovers from rejected writes',async()=>{
  const written:string[]=[];let release!:()=>void;
  const gate=new Promise<void>(resolve=>{release=resolve;});
  const writer=createSnapshotWriter(async value=>{written.push(value);if(written.length===1)await gate;},()=>{});
  const first=writer({[PROFILE_KEY]:'first'});const last=writer({[PROFILE_KEY]:'last'});
  await Promise.resolve();expect(written).toHaveLength(1);
  release();await Promise.all([first,last]);
  expect(JSON.parse(written[1])[PROFILE_KEY]).toBe('last');
  let attempts=0,errors=0;
  const recover=createSnapshotWriter(async()=>{if(++attempts===1)throw new Error('disk');},()=>{errors++;});
  await Promise.all([recover({}),recover({})]);expect(attempts).toBe(2);expect(errors).toBe(1);
 });
});
