import {describe,expect,it,vi} from 'vitest';
import {runInNewContext} from 'node:vm';
import {prepareNativePreview} from '../apps/client/src/native/preview-assets';
import {PROFILE_KEY} from '../apps/client/src/native/profile-bridge';

describe('installed UI startup',()=>{
 it('copies the installed HTML natively and transfers only the small profile bootstrap as text',async()=>{
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
  expect(fs.copyAsync).not.toHaveBeenCalled();expect(fs.writeAsStringAsync).toHaveBeenCalledOnce();
 });
 it('fails before showing WebView if the installed file or cache is unavailable',async()=>{
  const fs={cacheDirectory:null,makeDirectoryAsync:vi.fn(),getInfoAsync:vi.fn(),copyAsync:vi.fn(),writeAsStringAsync:vi.fn()};
  await expect(prepareNativePreview({hash:null,localUri:null,downloadAsync:vi.fn()},fs,{}, {top:0,bottom:0})).rejects.toThrow();
  expect(fs.writeAsStringAsync).not.toHaveBeenCalled();
 });
});
