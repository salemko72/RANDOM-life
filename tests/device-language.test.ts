import{expect,test}from'vitest';
import{runInNewContext}from'node:vm';
import{deviceLanguageScript}from'../apps/client/src/native/device-language';
import{preferredDeviceLanguages}from'../apps/client/src/web/device-language';
test('native language assignment is bounded and safe, with foreground event only when requested',()=>{
 const window:any={draft:'preserved',events:[],dispatchEvent(event:any){this.events.push(event.type);}};
 const input=['bs_BA','en-US','</script><script>alert(1)</script>','bs-ba',null,...Array(30).fill('de-DE')];
 runInNewContext(deviceLanguageScript(input as any),{window});
 expect(Array.from(window.__lifespinnerDeviceLanguages)).toEqual(['bs-BA','en-US','de-DE']);expect(window.events).toEqual([]);
 runInNewContext(deviceLanguageScript(['it-IT'],true),{window,Event:class{constructor(public type:string){}}});
 expect(window.events).toEqual(['languagechange']);expect(window.draft).toBe('preserved');
});
test('valid native languages take priority, invalid native languages fall back to browser list',()=>{
 expect(preferredDeviceLanguages(['bs_BA'],{languages:['en-US']})).toEqual(['bs-BA']);
 for(const native of [undefined,[],['<script>'],'bs'])expect(preferredDeviceLanguages(native,{languages:['de-DE','en-US']})).toEqual(['de-DE','en-US']);
 expect(preferredDeviceLanguages(null,{language:'bs-BA'})).toEqual(['bs-BA']);
 expect(preferredDeviceLanguages(null,{})).toEqual([]);
});
