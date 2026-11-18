import {describe,it,expect,vi} from 'vitest';
import {createWebViewRecovery} from '../apps/client/src/native/webview-recovery';

function deferred<T>(){let resolve!:(x:T)=>void;const promise=new Promise<T>(r=>resolve=r);return{promise,resolve};}
const flush=async()=>{for(let i=0;i<8;i++)await Promise.resolve();};
function harness(active=true){
 const updates:any[]=[];let prepares=0;
 const recovery=createWebViewRecovery({active,prepare:async()=>{prepares++;return'file:///cache/index.html';},changed:s=>updates.push(s),metric:vi.fn(),now:()=>100});
 return{recovery,updates,get prepares(){return prepares;}};
}
describe('native WebView process recovery',()=>{
 it('does not prepare a cold background launch until the first foreground',async()=>{
  const h=harness(false);h.recovery.start();await flush();expect(h.prepares).toBe(0);expect(h.recovery.snapshot().phase).toBe('waiting');
  h.recovery.active(true);await flush();expect(h.prepares).toBe(1);expect(h.recovery.snapshot().phase).toBe('ready');
 });
 it('defers a manual retry requested while backgrounded',async()=>{
  const h=harness();h.recovery.start();await flush();h.recovery.failed(h.recovery.snapshot().generation);
  h.recovery.active(false);h.recovery.retry();await flush();expect(h.prepares).toBe(1);expect(h.recovery.snapshot().phase).toBe('waiting');
  h.recovery.active(true);await flush();expect(h.prepares).toBe(2);expect(h.recovery.snapshot().phase).toBe('ready');
 });
 it('allows recovery again when old terminations age out of the one-minute budget',async()=>{
  let time=0,prepares=0;
  const r=createWebViewRecovery({active:true,now:()=>time,prepare:async()=>{prepares++;return'file:///cache/index.html';},changed:()=>{},metric:()=>{}});
  r.start();await flush();for(let i=0;i<2;i++){r.terminated(r.snapshot().generation);await flush();}
  time=60001;r.terminated(r.snapshot().generation);await flush();expect(r.snapshot().phase).toBe('ready');expect(prepares).toBe(4);
 });

 it('keeps a healthy document across background, inactive and foreground',async()=>{
  const h=harness();h.recovery.start();await flush();const before=h.recovery.snapshot();
  h.recovery.active(false);h.recovery.active(true);await flush();
  expect(h.recovery.snapshot()).toEqual(before);expect(h.prepares).toBe(1);
 });
 it('defers terminated background content until active and refreshes before mounting',async()=>{
  const h=harness();h.recovery.start();await flush();const old=h.recovery.snapshot().generation;
  h.recovery.active(false);h.recovery.terminated(old);await flush();
  expect(h.recovery.snapshot().phase).toBe('waiting');expect(h.prepares).toBe(1);
  expect(h.recovery.current(old)).toBe(false);
  h.recovery.active(true);await flush();
  expect(h.recovery.snapshot()).toMatchObject({phase:'ready',generation:old+1,uri:'file:///cache/index.html'});expect(h.prepares).toBe(2);
 });
 it('deduplicates notifications and ignores the old WebView unmount termination',async()=>{
  const h=harness();h.recovery.start();await flush();const old=h.recovery.snapshot().generation;
  h.recovery.terminated(old);h.recovery.terminated(old);await flush();
  h.recovery.terminated(old);h.recovery.failed(old);await flush();
  expect(h.prepares).toBe(2);expect(h.recovery.snapshot().phase).toBe('ready');
 });
 it('never mounts while backgrounded during preparation; refreshes again at foreground',async()=>{
  const gate=deferred<string>();let calls=0;
  const recovery=createWebViewRecovery({active:true,prepare:()=>++calls===1?gate.promise:Promise.resolve('file:///cache/new.html'),changed:()=>{},metric:()=>{}});
  recovery.start();recovery.active(false);gate.resolve('file:///cache/old.html');await flush();
  expect(recovery.snapshot().phase).toBe('waiting');
  recovery.active(true);await flush();expect(calls).toBe(2);expect(recovery.snapshot()).toMatchObject({phase:'ready',uri:'file:///cache/new.html'});
 });
 it('bounds repeated current-process failures and allows an explicit retry',async()=>{
  const h=harness();h.recovery.start();await flush();
  for(let i=0;i<3;i++){h.recovery.terminated(h.recovery.snapshot().generation);await flush();}
  expect(h.recovery.snapshot().phase).toBe('failed');expect(h.prepares).toBe(3);
  h.recovery.active(false);h.recovery.active(true);await flush();expect(h.prepares).toBe(3);
  h.recovery.retry();await flush();expect(h.recovery.snapshot().phase).toBe('ready');expect(h.prepares).toBe(4);
 });
 it('shows a recoverable failure instead of mounting stale files after preparation failure',async()=>{
  let fail=true;
  const r=createWebViewRecovery({active:true,prepare:async()=>{if(fail)throw Error('disk');return'file:///cache/index.html';},changed:()=>{},metric:()=>{}});
  r.start();await flush();expect(r.snapshot().phase).toBe('failed');expect(r.snapshot().uri).toBeNull();
  fail=false;r.retry();await flush();expect(r.snapshot().phase).toBe('ready');
 });
 it('invalidates late work on dispose and ignores old native errors',async()=>{
  const gate=deferred<string>(),changed=vi.fn();
  const r=createWebViewRecovery({active:true,prepare:()=>gate.promise,changed,metric:()=>{}});
  r.start();r.dispose();const count=changed.mock.calls.length;gate.resolve('file:///cache/index.html');await flush();
  expect(changed).toHaveBeenCalledTimes(count);expect(r.current(r.snapshot().generation)).toBe(false);
 });
});
