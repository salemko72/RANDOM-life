// Executes the actual App.tsx in React DOM with native boundary doubles.
// This simulates both native process callbacks; it is not physical-device QA.
import {build} from 'esbuild';
import {chromium} from 'playwright-core';
import {createServer} from 'node:http';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const nativeConfig=JSON.parse(await readFile('apps/client/app.json','utf8')).expo;
const mock=`
import React,{useEffect,useImperativeHandle,forwardRef} from 'react';
const env=()=>window.nativeTest;
export const View=({children,style})=>React.createElement('div',{style},children);
export const Text=({children,style})=>React.createElement('span',{style},children);
export const Pressable=({children,onPress})=>React.createElement('button',{onClick:onPress},children);
export const ActivityIndicator=()=>React.createElement('span',{'data-loading':true},'Loading');
export const StatusBar=()=>null;
export const SafeAreaProvider=View;
export const useSafeAreaInsets=()=>({top:24,bottom:16});
export const StyleSheet={create:x=>x};
export const Platform={OS:new URLSearchParams(location.search).get('platform')||'ios',Version:'test',constants:{}};
export const getLocales=()=>env().languages.map(languageTag=>({languageTag,...env().region}));
export const AppState={get currentState(){return env().active;},addEventListener:(_,fn)=>{env().listeners.push(fn);return{remove:()=>{env().listeners=env().listeners.filter(x=>x!==fn);}};}};
export const BackHandler={addEventListener:()=>({remove(){}}),exitApp(){}};
export const Share={share:async value=>{env().shared=value;}};
export const storage={getItem:async k=>{if(k==='RANDOM-life.local-state.v1'&&env().readFailures-->0)throw Error('temporary storage');return env().storage[k]??null;},setItem:async(k,v)=>{if(k==='RANDOM-life.local-state.v1'&&env().holdStateWrites)await new Promise(r=>env().releaseWrites.push(r));if(k==='random-life.consumer-catalog.slot.v1'&&v===''&&env().holdCatalogClear)await new Promise(r=>env().releaseClear=r);env().storage[k]=v;}};
export const cacheDirectory='file:///cache/',documentDirectory='file:///docs/';
export const makeDirectoryAsync=async()=>{};
export const getInfoAsync=async p=>({exists:p in env().files});
export const copyAsync=async({to})=>{env().files[to]='installed HTML';};
export const writeAsStringAsync=async(p,v)=>{if(env().failFiles)throw Error('disk');env().fileWrites.push({path:p,value:v});env().files[p]=v;};
export const readAsStringAsync=async p=>{if(!(p in env().files))throw Error('missing');return env().files[p];};
export const deleteAsync=async p=>{delete env().files[p];};
export const Asset={fromModule:()=>({hash:'abc123',localUri:'file:///bundle/ui.html',downloadAsync:async()=>{}})};
export function createAdsRuntime(){env().adsInstances++;return{active(){},receive(m,onShowing){if(m.event==='request'){onShowing?.();return new Promise(resolve=>{env().resumeAdRequest=resolve;});}},resetDocument(){env().adDocumentResets++;},dispose(){env().adsDisposals++;}};}
export const WebView=forwardRef((props,ref)=>{
 useImperativeHandle(ref,()=>({injectJavaScript:script=>{env().injections.push(script);}}));
 useEffect(()=>{env().mounts++;env().view=props;props.onLoadStart?.();props.onLoadEnd?.();return()=>{env().oldViews.push(props);env().terminate(props);};},[]);
 return React.createElement('div',{'data-webview':true},'App document');
});
export default storage;
`;
const bundle=await build({stdin:{contents:`import React from 'react';import{createRoot}from'react-dom/client';import App from './apps/client/App.tsx';window.nativeTest={platform:new URLSearchParams(location.search).get('platform')||'ios',languages:['en-US'],region:{regionCode:'US',measurementSystem:'us'},injections:[],fileWrites:[],holdCatalogClear:false,releaseClear:null,terminate(view,crashed=false){if(this.platform==='android')view.onRenderProcessGone({nativeEvent:{didCrash:crashed}});else view.onContentProcessDidTerminate();},active:'active',listeners:[],storage:{},files:{},mounts:0,oldViews:[],adsInstances:0,adsDisposals:0,adDocumentResets:0,holdStateWrites:false,releaseWrites:[],readFailures:location.search.includes('readFailure')?1:0};createRoot(document.getElementById('root')).render(React.createElement(App));`,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'native-test-boundaries',setup(b){b.onResolve({filter:/^(react-native|react-native-webview|react-native-safe-area-context|expo-localization|expo-status-bar|expo-asset|expo-file-system\/legacy|@react-native-async-storage\/async-storage)$/},a=>({path:a.path,namespace:'native-mock'}));b.onResolve({filter:/^\.\/src\/native\/ads-runtime$/},()=>({path:'ads',namespace:'native-mock'}));b.onLoad({filter:/.*/,namespace:'native-mock'},()=>({contents:mock,loader:'jsx',resolveDir:process.cwd()}));b.onLoad({filter:/preview\.html$/},()=>({contents:'export default 1;',loader:'js'}));}}]});
const server=createServer((req,res)=>{res.setHeader('Content-Type',req.url==='/app.js'?'application/javascript':'text/html');res.end(req.url==='/app.js'?bundle.outputFiles[0].text:'<div id="root"></div><script src="/app.js"></script>');});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH??'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{for(const platform of ['ios','android']){
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/?platform=${platform}`);await page.waitForSelector('[data-webview]');
 const initial=await page.evaluate(()=>window.nativeTest.mounts);assert.equal(initial,1);
 // Native responses from a same-WebView reload must not target the next document.
 await page.evaluate(()=>{const e=window.nativeTest;e.view.onMessage({nativeEvent:{data:JSON.stringify({type:'lifespinner.ads.v1',event:'request',seq:100})}});e.view.onLoadStart();e.resumeAdRequest();});
 await page.waitForTimeout(30);
 assert(!await page.evaluate(()=>window.nativeTest.injections.some(script=>script.includes('"seq":100')&&script.includes('"stage":"continue"'))),'An old request cannot continue a new document after same-view reload');

 // Healthy background/resume keeps the same mounted document.
 await page.evaluate(()=>{const e=window.nativeTest;e.languages=['bs-BA','en-US'];e.region={regionCode:'BA',measurementSystem:'metric'};for(const s of ['inactive','background','active']){e.active=s;e.listeners.forEach(fn=>fn(s));}});
 assert.equal(await page.evaluate(()=>window.nativeTest.mounts),1);
 assert(await page.evaluate(()=>window.nativeTest.injections.some(script=>script.includes('lifespinner.regionchange')&&script.includes('\"regionCode\":\"BA\"'))),'Foreground injects latest regional settings without remount');
 // Simulate profile/favourite/history/locale messages with the disk write pending.
 await page.evaluate(()=>{const e=window.nativeTest;e.holdStateWrites=true;for(const[key,value]of Object.entries({'random-life.local-profile.v1':'new preferences','random-life.experience.favorites':'new favorites','random-life.experience.history':'new history','random-life.locale.v1':'bs'}))e.view.onMessage({nativeEvent:{data:JSON.stringify({type:'random-life.local-state.v1',operation:'set',key,value})}});e.view.onMessage({nativeEvent:{data:JSON.stringify({type:'random-life.consumer-catalog.save.v1',snapshot:{schema:1,version:null,items:[],checkedAt:500,savedAt:500}})}});e.active='background';e.listeners.forEach(fn=>fn('background'));e.terminate(e.view);});
 await page.waitForSelector('[data-loading]');assert.equal(await page.evaluate(()=>window.nativeTest.mounts),1);
 // iOS can purge the cache directory while backgrounded.
 await page.evaluate(()=>{const e=window.nativeTest;delete e.files['file:///cache/random-preview-abc123/index.html'];e.active='active';e.listeners.forEach(fn=>fn('active'));});
 await page.waitForSelector('[data-webview]');assert.equal(await page.evaluate(()=>window.nativeTest.mounts),2);
 const restored=await page.evaluate(()=>{const e=window.nativeTest,w={ReactNativeWebView:{postMessage(){}}};new Function('window','document',e.files['file:///cache/random-preview-abc123/native-state.js'])(w,{documentElement:{style:{setProperty(){}}}});return{profile:w.localStorage.getItem('random-life.local-profile.v1'),favorites:w.localStorage.getItem('random-life.experience.favorites'),history:w.localStorage.getItem('random-life.experience.history'),locale:w.localStorage.getItem('random-life.locale.v1'),catalog:e.files['file:///cache/random-preview-abc123/catalog-cache.js'],html:e.files['file:///cache/random-preview-abc123/index.html'],region:w.__lifespinnerRegionalSettings,languages:w.__lifespinnerDeviceLanguages,build:w.__lifespinnerBuild,ads:e.adsInstances,disposals:e.adsDisposals};});
 assert.deepEqual({...restored,catalog:undefined},{profile:'new preferences',favorites:'new favorites',history:'new history',locale:'bs',catalog:undefined,html:'installed HTML',region:{regionCode:'BA',measurementSystem:'metric'},languages:['bs-BA','en-US'],build:{version:nativeConfig.version,build:String(platform==='android'?nativeConfig.android.versionCode:nativeConfig.ios.buildNumber),platform},ads:1,disposals:0});assert.match(restored.catalog,/'?checkedAt"?:500/);
 // Late callbacks from the old unmounted view cannot overwrite state or restart.
 await page.evaluate(()=>{const p=window.nativeTest.oldViews[0];window.nativeTest.terminate(p);p.onError();p.onMessage({nativeEvent:{data:JSON.stringify({type:'random-life.local-state.v1',operation:'clear'})}});});
 assert.equal(await page.evaluate(()=>window.nativeTest.mounts),2);
 // Failed file preparation displays a visible retry instead of a blank screen.
 await page.evaluate(()=>{const e=window.nativeTest;e.failFiles=true;e.terminate(e.view,true);});
 await page.getByRole('button',{name:'Try again / Pokušaj ponovo'}).waitFor();
 await page.evaluate(()=>{window.nativeTest.failFiles=false;});await page.getByRole('button',{name:'Try again / Pokušaj ponovo'}).click();
 await page.waitForSelector('[data-webview]');assert.equal(await page.evaluate(()=>window.nativeTest.mounts),3);
 if(platform==='android'){
  for(let i=0;i<2;i++){
   await page.evaluate(()=>window.nativeTest.terminate(window.nativeTest.view,true));
   await page.waitForSelector('[data-webview]');
   await page.waitForFunction(count=>window.nativeTest.mounts===count,4+i);
  }
  await page.evaluate(()=>window.nativeTest.terminate(window.nativeTest.view,true));
  await page.getByRole('button',{name:'Try again / Pokušaj ponovo'}).waitFor();
  assert.equal(await page.evaluate(()=>window.nativeTest.mounts),5,'Third automatic restart is blocked');
  await page.getByRole('button',{name:'Try again / Pokušaj ponovo'}).click();await page.waitForSelector('[data-webview]');
  await page.evaluate(()=>window.nativeTest.view.onMessage({nativeEvent:{data:JSON.stringify({type:'random-life.performance.export.v1'})}}));
  await page.waitForFunction(()=>window.nativeTest.shared);
  const diagnostics=await page.evaluate(()=>JSON.parse(window.nativeTest.shared.message).events.filter(row=>row.name==='android_render_process_gone'));
  assert.deepEqual(diagnostics.map(row=>row.metrics.failed),[0,1,1,1,1]);
 }

 // A clear already received by a dying document must not rewrite a new bootstrap.
 const beforeClear=await page.evaluate(()=>{const e=window.nativeTest;return{mounts:e.mounts,writes:e.fileWrites.filter(row=>row.path.endsWith('/catalog-cache.js')).length};});
 await page.evaluate(()=>{const e=window.nativeTest;e.holdCatalogClear=true;e.view.onMessage({nativeEvent:{data:JSON.stringify({type:'random-life.consumer-catalog.clear.v1',requestId:'clear-recovery-001'})}});});
 await page.waitForFunction(()=>!!window.nativeTest.releaseClear);
 await page.evaluate(()=>window.nativeTest.terminate(window.nativeTest.view));
 await page.waitForSelector('[data-loading]');
 await page.evaluate(()=>{const e=window.nativeTest;e.holdCatalogClear=false;e.releaseClear();});
 await page.waitForFunction(count=>window.nativeTest.mounts===count,beforeClear.mounts+1);
 assert.equal(await page.evaluate(()=>window.nativeTest.fileWrites.filter(row=>row.path.endsWith('/catalog-cache.js')).length),beforeClear.writes+1,'Only the fresh document may write its catalog bootstrap');
 assert(!await page.evaluate(()=>window.nativeTest.injections.some(script=>script.includes('clear-recovery-001'))),'Stale document must not acknowledge a clear to its replacement');
 await page.goto(`http://127.0.0.1:${server.address().port}/?readFailure=1&platform=${platform}`);
 await page.getByRole('button',{name:'Try again / Pokušaj ponovo'}).waitFor();
 await page.getByRole('button',{name:'Try again / Pokušaj ponovo'}).click();
 await page.waitForSelector('[data-webview]',{timeout:2000});
 assert.equal(await page.evaluate(()=>window.nativeTest.mounts),1);
 assert.deepEqual(errors,[]);await page.close();console.log(`PASS ${platform}: actual App.tsx healthy resume/process callback, cache purge, queued writes, latest state/language/build/catalog, stale callbacks, stable ad runtime and visible retry. Physical QA still required.`);
}}finally{await browser.close();await new Promise(r=>server.close(r));}
