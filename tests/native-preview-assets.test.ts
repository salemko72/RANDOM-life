import {describe,expect,it,vi} from 'vitest';
import {runInNewContext} from 'node:vm';
import {prepareNativePreview} from '../apps/client/src/native/preview-assets';
import {PROFILE_KEY} from '../apps/client/src/native/profile-bridge';

describe('installed UI startup',()=>{
 it('copies installed HTML natively and keeps the profile bootstrap small',async()=>{
  const fs={cacheDirectory:'file:///cache/',makeDirectoryAsync:vi.fn(),getInfoAsync:vi.fn().mockResolvedValue({exists:false}),copyAsync:vi.fn(),writeAsStringAsync:vi.fn()};
  const asset={hash:'abc123',localUri:'file:///bundle/preview.html',downloadAsync:vi.fn()};
  const uri=await prepareNativePreview(asset,fs,{[PROFILE_KEY]:'Ahmed'},{top:24,bottom:16});
  expect(uri).toBe('file:///cache/random-preview-abc123/index.html');
  expect(asset.downloadAsync).toHaveBeenCalledOnce();
  expect(fs.copyAsync).toHaveBeenCalledWith({from:asset.localUri,to:uri});
  const [path,script]=fs.writeAsStringAsync.mock.calls[0];
  expect(path).toBe('file:///cache/random-preview-abc123/native-state.js');
  expect(script.length).toBeLessThan(6000);
  const css=vi.fn(),window:any={ReactNativeWebView:{postMessage:vi.fn()}};
  runInNewContext(script,{window,document:{documentElement:{style:{setProperty:css}}}});
  expect(window.localStorage.getItem(PROFILE_KEY)).toBe('Ahmed');
  expect(css.mock.calls).toEqual([['--native-safe-top','24px'],['--native-safe-bottom','16px']]);
 });
 it('reuses the versioned HTML but refreshes state on every launch',async()=>{
  const fs={cacheDirectory:'file:///cache/',makeDirectoryAsync:vi.fn(),getInfoAsync:vi.fn().mockResolvedValue({exists:true}),copyAsync:vi.fn(),writeAsStringAsync:vi.fn()};
  await prepareNativePreview({hash:'def456',localUri:'file:///bundle/ui.html',downloadAsync:vi.fn()},fs,{}, {top:0,bottom:0});
  expect(fs.copyAsync).not.toHaveBeenCalled();expect(fs.writeAsStringAsync).toHaveBeenCalledTimes(2);
  expect(fs.writeAsStringAsync).toHaveBeenLastCalledWith('file:///cache/random-preview-def456/catalog-cache.js','');
 });

 it('restores the public catalog through a separate local script without changing the profile',async()=>{
  const fs={cacheDirectory:'file:///cache/',makeDirectoryAsync:vi.fn(),getInfoAsync:vi.fn().mockResolvedValue({exists:true}),copyAsync:vi.fn(),writeAsStringAsync:vi.fn()};
  const snapshot={schema:1,version:null,items:[],checkedAt:100,savedAt:100};
  await prepareNativePreview({hash:'abc123',localUri:'file:///bundle/ui.html',downloadAsync:vi.fn()},fs,{}, {top:0,bottom:0},JSON.stringify(snapshot));
  const [path,script]=fs.writeAsStringAsync.mock.calls[1];expect(path).toContain('catalog-cache.js');const context:any={};runInNewContext(script,context);expect(JSON.stringify(context.__randomConsumerCatalog)).toBe(JSON.stringify(snapshot));
 });
 it('fails before showing WebView if the installed file or cache is unavailable',async()=>{
  const fs={cacheDirectory:null,makeDirectoryAsync:vi.fn(),getInfoAsync:vi.fn(),copyAsync:vi.fn(),writeAsStringAsync:vi.fn()};
  await expect(prepareNativePreview({hash:null,localUri:null,downloadAsync:vi.fn()},fs,{}, {top:0,bottom:0})).rejects.toThrow();
  expect(fs.writeAsStringAsync).not.toHaveBeenCalled();
 });
});

it('passes installed package version/build to the WebView independently from catalog data',async()=>{
 const fs={cacheDirectory:'file:///cache/',makeDirectoryAsync:vi.fn(),getInfoAsync:vi.fn().mockResolvedValue({exists:true}),copyAsync:vi.fn(),writeAsStringAsync:vi.fn()};
 const info={version:'1.0.1',build:'5',platform:'ios'};
 await prepareNativePreview({hash:'abc123',localUri:'file:///bundle/ui.html',downloadAsync:vi.fn()},fs,{}, {top:0,bottom:0},null,{ads:true,buildInfo:info} as any);
 const window:any={},css=vi.fn();runInNewContext(fs.writeAsStringAsync.mock.calls[0][1],{window,document:{documentElement:{style:{setProperty:css}}}});
 expect(window.__lifespinnerBuild).toEqual(info);expect(window.__lifespinnerAds).toBe(true);
});

it('boots reviewed device preferences alongside existing build, ads and local profile state',async()=>{
 const fs={cacheDirectory:'file:///cache/',makeDirectoryAsync:vi.fn(),getInfoAsync:vi.fn().mockResolvedValue({exists:true}),copyAsync:vi.fn(),writeAsStringAsync:vi.fn()};
 await prepareNativePreview({hash:'abc123',localUri:'file:///bundle/ui.html',downloadAsync:vi.fn()},fs,{[PROFILE_KEY]:'kept'},{top:0,bottom:0},null,{ads:true,deviceLanguages:['bs_BA','en-US','</script>'],buildInfo:{version:'1.0.1',build:'5',platform:'ios'}});
 const window:any={};runInNewContext(fs.writeAsStringAsync.mock.calls[0][1],{window,document:{documentElement:{style:{setProperty:vi.fn()}}}});
 expect(Array.from(window.__lifespinnerDeviceLanguages)).toEqual(['bs-BA','en-US']);expect(window.localStorage.getItem(PROFILE_KEY)).toBe('kept');expect(window.__lifespinnerAds).toBe(true);expect(window.__lifespinnerBuild.build).toBe('5');
});
 it('seeds recovery from the latest native state after asynchronous asset preparation',async()=>{
  let finish!:()=>void;const download=new Promise<void>(r=>finish=r);
  let current={ [PROFILE_KEY]:'old', 'random-life.experience.favorites':'old-favorite' };
  const writes:Record<string,string>={};
  const fs={cacheDirectory:'file:///cache/',makeDirectoryAsync:async()=>{},getInfoAsync:async()=>({exists:true}),copyAsync:async()=>{},writeAsStringAsync:async(path:string,text:string)=>{writes[path]=text;}};
  const pending=prepareNativePreview({hash:'abc123',localUri:'file:///bundle/ui.html',downloadAsync:()=>download},fs,()=>current,{top:0,bottom:0},null,{deviceLanguages:['de-DE','en-US'],buildInfo:{version:'1.0.1',build:'12',platform:'android'},ads:true});
  current={[PROFILE_KEY]:'latest', 'random-life.experience.favorites':'latest-favorite'};finish();await pending;
  const window:any={ReactNativeWebView:{postMessage:()=>{}}};
  runInNewContext(writes['file:///cache/random-preview-abc123/native-state.js'],{window,document:{documentElement:{style:{setProperty:()=>{}}}}});
  expect(window.localStorage.getItem(PROFILE_KEY)).toBe('latest');
  expect(window.localStorage.getItem('random-life.experience.favorites')).toBe('latest-favorite');
  expect(Array.from(window.__lifespinnerDeviceLanguages)).toEqual(['de-DE','en-US']);
  expect(window.__lifespinnerBuild).toEqual({version:'1.0.1',build:'12',platform:'android'});
  expect(window.__lifespinnerAds).toBe(true);
 });
