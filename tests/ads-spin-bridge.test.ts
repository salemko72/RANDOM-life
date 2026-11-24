import {afterEach,expect,it,vi} from 'vitest';
import {adEvent,requestSpin} from '../apps/client/src/web/ads-bridge';
function fixture(native=true){
 const messages:any[]=[];
 const window=Object.assign(new EventTarget(),{__lifespinnerAds:native,ReactNativeWebView:{postMessage:(raw:string)=>messages.push(JSON.parse(raw))}});
 vi.stubGlobal('window',window);
 const reply=(seq:number,stage:string)=>window.dispatchEvent(new CustomEvent('lifespinner.ads.response.v1',{detail:{seq,stage}}));
 return{window,messages,reply};
}
afterEach(()=>{vi.unstubAllGlobals();vi.useRealTimers();});
it('a web-only Spin needs no ad handshake',async()=>{const f=fixture(false);expect(await requestSpin()).toBe(true);expect(f.messages).toEqual([]);});
it('waits for its own native continuation and does not continue at showing',async()=>{
 const f=fixture();let done=false;const request=requestSpin().then(value=>{done=value;return value;});
 const m=f.messages[0];expect(m).toMatchObject({type:'lifespinner.ads.v1',event:'request'});expect(Object.keys(m).sort()).toEqual(['event','seq','type']);
 f.reply(m.seq+1,'continue');await Promise.resolve();expect(done).toBe(false);
 f.reply(m.seq,'showing');await Promise.resolve();expect(done).toBe(false);
 f.reply(m.seq,'continue');expect(await request).toBe(true);
});
it('cancels an unanswered request at timeout without starting the wheel, ignores late native continue',async()=>{
 vi.useFakeTimers();const f=fixture();const request=requestSpin();const seq=f.messages[0].seq;
 await vi.advanceTimersByTimeAsync(15000);expect(await request).toBe(false);expect(f.messages.at(-1).event).toBe('busy');
 f.reply(seq,'continue');expect(await request).toBe(false);
});
it('does not expire a request while the native full-screen ad is open',async()=>{
 vi.useFakeTimers();const f=fixture();let done=false;const request=requestSpin().then(value=>{done=true;return value;});const seq=f.messages[0].seq;
 f.reply(seq,'showing');await vi.advanceTimersByTimeAsync(120000);expect(done).toBe(false);
 f.reply(seq,'continue');expect(await request).toBe(true);
});
it('keeps navigation and privacy as events without creating an ad request',()=>{
 const f=fixture();for(const name of ['busy','home','privacy','ready'] as const)adEvent(name);
 expect(f.messages.map(m=>m.event)).toEqual(['busy','home','privacy','ready']);
});
it('cancels a pending Spin when navigation interrupts it and ignores the old continuation',async()=>{
 const f=fixture();const request=requestSpin();const seq=f.messages[0].seq;
 adEvent('busy');expect(await Promise.race([request,Promise.resolve('still-waiting')])).toBe(false);
 f.reply(seq,'continue');expect(await request).toBe(false);
});
