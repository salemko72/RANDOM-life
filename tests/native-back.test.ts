import{it,expect}from'vitest';
import{backAction,parseBackResult,nativeBackScript}from'../apps/client/src/native/back-navigation';
const home={busy:false,image:false,panel:false,details:false,result:false,editing:false,onboarding:false};
it('closes the most local surface before allowing an exit',()=>{
 expect(backAction({...home,image:true,panel:true,details:true,result:true})).toBe('image');
 expect(backAction({...home,panel:true,details:true,result:true})).toBe('panel');expect(backAction({...home,details:true,result:true})).toBe('details');expect(backAction({...home,result:true})).toBe('home');expect(backAction(home)).toBe('exit');
});
it('never exits mid spin or bypasses a profile draft',()=>{expect(backAction({...home,busy:true})).toBe('consume');expect(backAction({...home,editing:true})).toBe('profile');expect(backAction({...home,onboarding:true})).toBe('profile');});
it('accepts only a bounded response to a real pending hardware request',()=>{
 const raw=JSON.stringify({type:'lifespinner.back-result.v1',requestId:'back-1',handled:false});expect(parseBackResult(raw,'back-1')).toBe(false);expect(parseBackResult(raw,'back-2')).toBeNull();expect(parseBackResult(raw,null)).toBeNull();expect(parseBackResult(JSON.stringify({type:'lifespinner.back-result.v1',requestId:'back-1',handled:'false'}),'back-1')).toBeNull();expect(parseBackResult('x'.repeat(501),'back-1')).toBeNull();
});
it('does not inject untrusted text as javascript',()=>{expect(nativeBackScript('back-1')).toContain('lifespinner.native-back');expect(nativeBackScript('back-1')).toContain('document.dispatchEvent');expect(nativeBackScript('back-1')).toContain('bubbles:true');expect(()=>nativeBackScript("';alert(1)//")).toThrow();});
