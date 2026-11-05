import{it,expect,vi,afterEach}from'vitest';
import{appShareUrl,shareApp,parseAppShare}from'../apps/client/src/web/app-share';
afterEach(()=>vi.unstubAllGlobals());
it('shares the permanent app page, never a private TestFlight invitation or profile',async()=>{
 const postMessage=vi.fn();vi.stubGlobal('window',{ReactNativeWebView:{postMessage}});await shareApp('bs');const raw=postMessage.mock.calls[0][0],data=parseAppShare(raw);expect(data?.url).toBe(appShareUrl('bs'));expect(data?.message).toContain(data!.url);expect(data?.message).not.toContain('testflight.apple.com');expect(data?.title).toBe('LifeSpinner');
});
it('rejects untrusted app-share destinations and invalid locale/query values',()=>{
 const x={type:'lifespinner.app-share.v1',locale:'en'};expect(parseAppShare(JSON.stringify(x))?.url).toBe(appShareUrl('en'));for(const p of [{...x,locale:'xx'},{...x,type:'other'}, {...x,url:'https://evil.test'}])expect(parseAppShare(JSON.stringify(p))).toBeNull();
});
it('uses browser sharing and handles cancellation without treating it as failure',async()=>{vi.stubGlobal('window',{});const share=vi.fn().mockRejectedValue(new DOMException('cancel','AbortError'));vi.stubGlobal('navigator',{share});expect(await shareApp('en')).toBe('cancelled');expect(share.mock.calls[0][0].url).toBe(appShareUrl('en'));});
