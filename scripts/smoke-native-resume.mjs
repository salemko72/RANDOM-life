// Executes the actual App.tsx in React DOM with native boundary doubles.
// This simulates native process notifications; it is not an iPhone/Xcode test.
import {build} from 'esbuild';
import {chromium} from 'playwright-core';
import {createServer} from 'node:http';
import assert from 'node:assert/strict';
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
export const Platform={OS:'ios',Version:'test',constants:{}};
export const AppState={get currentState(){return env().active;},addEventListener:(_,fn)=>{env().listeners.push(fn);return{remove:()=>{env().listeners=env().listeners.filter(x=>x!==fn);}};}};
export const BackHandler={addEventListener:()=>({remove(){}}),exitApp(){}};
export const Share={share:async()=>{}};
export const storage={getItem:async k=>{if(k==='RANDOM-life.local-state.v1'&&env().readFailures-->0)throw Error('temporary storage');return env().storage[k]??null;},setItem:async(k,v)=>{if(k==='RANDOM-life.local-state.v1'&&env().holdStateWrites)await new Promise(r=>env().releaseWrites.push(r));env().storage[k]=v;}};
export const cacheDirectory='file:///cache/',documentDirectory='file:///docs/';
export const makeDirectoryAsync=async()=>{};
export const getInfoAsync=async p=>({exists:p in env().files});
export const copyAsync=async({to})=>{env().files[to]='installed HTML';};
export const writeAsStringAsync=async(p,v)=>{if(env().failFiles)throw Error('disk');env().files[p]=v;};
export const readAsStringAsync=async p=>{if(!(p in env().files))throw Error('missing');return env().files[p];};
export const deleteAsync=async p=>{delete env().files[p];};
export const Asset={fromModule:()=>({hash:'abc123',localUri:'file:///bundle/ui.html',downloadAsync:async()=>{}})};
export function createAdsRuntime(){env().adsInstances++;return{active(){},receive(){},resetDocument(){env().adDocumentResets++;},dispose(){env().adsDisposals++;}};}
export const WebView=forwardRef((props,ref)=>{
 useImperativeHandle(ref,()=>({injectJavaScript:()=>{}}));
 useEffect(()=>{env().mounts++;env().view=props;props.onLoadStart?.();props.onLoadEnd?.();return()=>{env().oldViews.push(props);props.onContentProcessDidTerminate?.();};},[]);
 return React.createElement('div',{'data-webview':true},'App document');
});
export default storage;
`;
const bundle=await build({stdin:{contents:`import React from 'react';import{createRoot}from'react-dom/client';import App from './apps/client/App.tsx';window.nativeTest={active:'active',listeners:[],storage:{},files:{},mounts:0,oldViews:[],adsInstances:0,adsDisposals:0,adDocumentResets:0,holdStateWrites:false,releaseWrites:[],readFailures:location.search.includes('readFailure')?1:0};createRoot(document.getElementById('root')).render(React.createElement(App));`,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'native-test-boundaries',setup(b){b.onResolve({filter:/^(react-native|react-native-webview|react-native-safe-area-context|expo-status-bar|expo-asset|expo-file-system\/legacy|@react-native-async-storage\/async-storage)$/},a=>({path:a.path,namespace:'native-mock'}));b.onResolve({filter:/^\.\/src\/native\/ads-runtime$/},()=>({path:'ads',namespace:'native-mock'}));b.onLoad({filter:/.*/,namespace:'native-mock'},()=>({contents:mock,loader:'jsx',resolveDir:process.cwd()}));b.onLoad({filter:/preview\.html$/},()=>({contents:'export default 1;',loader:'js'}));}}]});
const server=createServer((req,res)=>{res.setHeader('Content-Type',req.url==='/app.js'?'application/javascript':'text/html');res.end(req.url==='/app.js'?bundle.outputFiles[0].text:'<div id="root"></div><script src="/app.js"></script>');});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH??'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(`http://127.0.0.1:${server.address().port}`);await page.waitForSelector('[data-webview]');
 const initial=await page.evaluate(()=>window.nativeTest.mounts);assert.equal(initial,1);
 // Healthy background/resume keeps the same mounted document.
 await page.evaluate(()=>{const e=window.nativeTest;for(const s of ['inactive','background','active']){e.active=s;e.listeners.forEach(fn=>fn(s));}});
 assert.equal(await page.evaluate(()=>window.nativeTest.mounts),1);
 // Simulate profile/favourite/history/locale messages with the disk write pending.
 await page.evaluate(()=>{const e=window.nativeTest;e.holdStateWrites=true;for(const[key,value]of Object.entries({'random-life.local-profile.v1':'new preferences','random-life.experience.favorites':'new favorites','random-life.experience.history':'new history','random-life.locale.v1':'bs'}))e.view.onMessage({nativeEvent:{data:JSON.stringify({type:'random-life.local-state.v1',operation:'set',key,value})}});e.view.onMessage({nativeEvent:{data:JSON.stringify({type:'random-life.consumer-catalog.save.v1',snapshot:{schema:1,version:null,items:[],checkedAt:500,savedAt:500}})}});e.active='background';e.listeners.forEach(fn=>fn('background'));e.view.onContentProcessDidTerminate();});
 await page.waitForSelector('[data-loading]');assert.equal(await page.evaluate(()=>window.nativeTest.mounts),1);
 // iOS can purge the cache directory while backgrounded.
 await page.evaluate(()=>{const e=window.nativeTest;delete e.files['file:///cache/random-preview-abc123/index.html'];e.active='active';e.listeners.forEach(fn=>fn('active'));});
 await page.waitForSelector('[data-webview]');assert.equal(await page.evaluate(()=>window.nativeTest.mounts),2);
 const restored=await page.evaluate(()=>{const e=window.nativeTest,w={ReactNativeWebView:{postMessage(){}}};new Function('window','document',e.files['file:///cache/random-preview-abc123/native-state.js'])(w,{documentElement:{style:{setProperty(){}}}});return{profile:w.localStorage.getItem('random-life.local-profile.v1'),favorites:w.localStorage.getItem('random-life.experience.favorites'),history:w.localStorage.getItem('random-life.experience.history'),locale:w.localStorage.getItem('random-life.locale.v1'),catalog:e.files['file:///cache/random-preview-abc123/catalog-cache.js'],html:e.files['file:///cache/random-preview-abc123/index.html'],ads:e.adsInstances,disposals:e.adsDisposals};});
 assert.deepEqual({...restored,catalog:undefined},{profile:'new preferences',favorites:'new favorites',history:'new history',locale:'bs',catalog:undefined,html:'installed HTML',ads:1,disposals:0});assert.match(restored.catalog,/'?checkedAt"?:500/);
 // Late callbacks from the old unmounted view cannot overwrite state or restart.
 await page.evaluate(()=>{const p=window.nativeTest.oldViews[0];p.onContentProcessDidTerminate();p.onError();p.onMessage({nativeEvent:{data:JSON.stringify({type:'random-life.local-state.v1',operation:'clear'})}});});
 assert.equal(await page.evaluate(()=>window.nativeTest.mounts),2);
 // Failed file preparation displays a visible retry instead of a blank screen.
 await page.evaluate(()=>{const e=window.nativeTest;e.failFiles=true;e.view.onContentProcessDidTerminate();});
 await page.getByRole('button',{name:'Try again / Pokušaj ponovo'}).waitFor();
 await page.evaluate(()=>{window.nativeTest.failFiles=false;});await page.getByRole('button',{name:'Try again / Pokušaj ponovo'}).click();
 await page.waitForSelector('[data-webview]');assert.equal(await page.evaluate(()=>window.nativeTest.mounts),3);
 await page.goto(`http://127.0.0.1:${server.address().port}/?readFailure=1`);
 await page.getByRole('button',{name:'Try again / Pokušaj ponovo'}).waitFor();
 await page.getByRole('button',{name:'Try again / Pokušaj ponovo'}).click();
 await page.waitForSelector('[data-webview]',{timeout:2000});
 assert.equal(await page.evaluate(()=>window.nativeTest.mounts),1);
 assert.deepEqual(errors,[]);console.log('PASS: actual App.tsx lifecycle wiring; healthy resume, background termination, cache purge, queued preference writes, latest profile/history/favorites/locale/catalog, stale SDK callbacks, stable ad runtime and visible retry. Native iOS QA still required.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
