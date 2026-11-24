import{regionalSettingsScript}from'./src/native/regional-settings';
import {getLocales} from 'expo-localization';
import {deviceLanguageScript} from './src/native/device-language';
import {createWebViewRecovery,type WebViewSnapshot} from './src/native/webview-recovery';
import {createAdsRuntime} from './src/native/ads-runtime';
import {parseAdMessage} from './src/native/ads-policy';
import{nativeBackScript,parseBackResult}from'./src/native/back-navigation';
import{parseAppShare}from'./src/web/app-share';
import{allowWebNavigation}from'./src/native/web-navigation';
import {createNativeCatalogStorage,parseCatalogMessage,parseCatalogClearMessage} from './src/native/catalog-storage';
import {PerformanceLog,PERFORMANCE_KEY,parsePerformanceMessage,type PerformanceEvent} from './src/native/performance-log';
import appConfig from './app.json';
import {SafeAreaProvider,useSafeAreaInsets} from 'react-native-safe-area-context';
import React, {useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator, AppState, BackHandler, Platform, Pressable, Share, StyleSheet, Text, View} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {WebView} from 'react-native-webview';
import {Asset} from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import {applyStorageMessage, createSnapshotWriter, LocalState, NATIVE_STATE_KEY, readSnapshot} from './src/native/profile-bridge';
import {prepareNativePreview} from './src/native/preview-assets';
import {parseNativeShare} from './src/web/item-share';

const nativeBuild=Platform.OS==='ios'?appConfig.expo.ios.buildNumber:appConfig.expo.android.versionCode;
const PERFORMANCE_STORAGE_KEY=`${PERFORMANCE_KEY}.${appConfig.expo.version}.${nativeBuild}`;

// Expo shell embeds the current UI and keeps device preferences across launches.
// D1 is primary; the installed UI includes its own reserve catalog and images.
export default function App(){return <SafeAreaProvider style={{flex:1,backgroundColor:'#fbefe7'}}><NativeExperience/></SafeAreaProvider>;}
function NativeExperience(){
 const insets=useSafeAreaInsets();
 const nativeStartedAt=useRef(Date.now());
 const diagnostics=useRef(new PerformanceLog());
 const diagnosticQueue=useRef<Promise<unknown>>(Promise.resolve());
 const diagnosticsLoaded=useRef(false);
 function recordDiagnostic(event:PerformanceEvent){
  if(!diagnosticsLoaded.current){diagnosticsLoaded.current=true;diagnosticQueue.current=AsyncStorage.getItem(PERFORMANCE_STORAGE_KEY).then(raw=>{diagnostics.current=new PerformanceLog(raw);}).catch(()=>{});}
  diagnosticQueue.current=diagnosticQueue.current.then(async()=>{diagnostics.current.add(event);await AsyncStorage.setItem(PERFORMANCE_STORAGE_KEY,JSON.stringify(diagnostics.current.rows));}).catch(()=>{});
 }
 function nativeMetric(name:string,metrics:Record<string,number>={}){recordDiagnostic({name,at:Date.now(),metrics:{elapsedMs:Date.now()-nativeStartedAt.current,...metrics}});}
 async function shareDiagnostics(){
  await diagnosticQueue.current;
  const constants=Platform.constants as unknown as Record<string,unknown>;
  const message=JSON.stringify({schema:1,version:appConfig.expo.version,build:nativeBuild,exportedAt:new Date().toISOString(),device:{os:Platform.OS,osVersion:Platform.Version,...(Platform.OS==='android'?{android:Platform.Version}:{ios:Platform.Version}),model:constants.Model??null,manufacturer:constants.Manufacturer??null},events:diagnostics.current.rows},null,2);
  await Share.share({title:'LifeSpinner diagnostic log',message});
 }

 const ads=useRef<ReturnType<typeof createAdsRuntime>|null>(null);
 useEffect(()=>{if(Platform.OS!=='android'&&Platform.OS!=='ios')return;const runtime=createAdsRuntime();ads.current=runtime;runtime.active(AppState.currentState==='active');const listener=AppState.addEventListener('change',next=>runtime.active(next==='active'));return()=>{listener.remove();runtime.dispose();ads.current=null;};},[]);
 const [error,setError]=useState('');
 const [view,setView]=useState<WebViewSnapshot>({generation:0,phase:'starting',uri:null});
 const {uri,generation}=view;
 const recovery=useRef<ReturnType<typeof createWebViewRecovery>|null>(null);
 const currentInsets=useRef(insets);currentInsets.current=insets;
 const state=useRef<LocalState>({});
 const webView=useRef<WebView>(null);
 const adDocument=useRef(0);
 useEffect(()=>{const listener=AppState.addEventListener('change',next=>{if(next==='active'){const locales=getLocales();webView.current?.injectJavaScript(deviceLanguageScript(locales.map(locale=>locale.languageTag),true)+regionalSettingsScript(locales[0],true));}});return()=>listener.remove();},[]);
 const pendingBack=useRef<string|null>(null),backSequence=useRef(0);
 useEffect(()=>{if(Platform.OS!=='android')return;const subscription=BackHandler.addEventListener('hardwareBackPress',()=>{if(!webView.current||!uri||error||!recovery.current?.current(generation))return false;const requestId='back-'+(++backSequence.current);pendingBack.current=requestId;webView.current.injectJavaScript(nativeBackScript(requestId));return true;});return()=>subscription.remove();},[uri,error,generation]);
 const catalogStorage=useRef(createNativeCatalogStorage(FileSystem,AsyncStorage));
 const writer=useRef(createSnapshotWriter(value=>AsyncStorage.setItem(NATIVE_STATE_KEY,value),()=>setError('Lokalni podaci nisu spremljeni. Provjeri slobodan prostor i ponovo otvori RANDOM.')));
 useEffect(()=>{
  let mounted=true;nativeStartedAt.current=Date.now();nativeMetric('native_start');
  // Read the persisted snapshot only at cold launch. Recovery must use the
  // newer in-memory bridge state, even if its AsyncStorage write is queued.
  let hydrated=false,loading:Promise<void>|null=null;
  const loadState=()=>{
   if(hydrated)return Promise.resolve();
   if(!loading)loading=AsyncStorage.getItem(NATIVE_STATE_KEY).then(raw=>{
    if(mounted){state.current=readSnapshot(raw);hydrated=true;nativeMetric('profile_loaded');}
   }).catch(cause=>{loading=null;throw cause;});
   return loading;
  };
  const controller=createWebViewRecovery({
   active:AppState.currentState!=='background'&&AppState.currentState!=='inactive',
   prepare:async()=>{
    await loadState();
    const catalog=await catalogStorage.current.read();
    const asset=Asset.fromModule(require('./src/generated/preview.html'));
    return prepareNativePreview(asset,FileSystem,()=>state.current,currentInsets.current,catalog,{deviceLanguages:getLocales().map(locale=>locale.languageTag),regionalSettings:getLocales()[0],ads:Platform.OS==='android'||Platform.OS==='ios',buildInfo:Platform.OS==='ios'||Platform.OS==='android'?{version:appConfig.expo.version,build:String(nativeBuild),platform:Platform.OS}:undefined});
   },
   changed:next=>{if(mounted){if(next.phase!=='ready')pendingBack.current=null;setView(next);}},
   metric:nativeMetric,
  });
  recovery.current=controller;
  const listener=AppState.addEventListener('change',next=>{nativeMetric(next==='active'?'native_foreground':'native_background');controller.active(next==='active');});
  controller.start();
  return()=>{mounted=false;listener.remove();controller.dispose();recovery.current=null;};
 },[]);
 return <View style={styles.screen}>
  <StatusBar style="dark"/>
  {error?<View style={styles.error}><Text>{error}</Text></View>:view.phase==='failed'?<View style={styles.error}><Text>LifeSpinner could not load. / LifeSpinner se nije učitao.</Text><Pressable accessibilityRole="button" onPress={()=>recovery.current?.retry()} style={styles.retry}><Text style={styles.retryText}>Try again / Pokušaj ponovo</Text></Pressable></View>:view.phase!=='ready'||uri===null?<View style={styles.loading}><ActivityIndicator color="#af6c68"/></View>:<WebView
   key={generation}
   ref={webView}
   source={{uri}}
   originWhitelist={['file://*']}
   allowFileAccess
   setBuiltInZoomControls={false}
   setDisplayZoomControls={false}
   allowingReadAccessToURL={uri.slice(0,uri.lastIndexOf('/')+1)}
   javaScriptEnabled domStorageEnabled startInLoadingState
   renderLoading={()=><View style={styles.loading}><ActivityIndicator color="#af6c68"/></View>}
   onShouldStartLoadWithRequest={r=>allowWebNavigation(r,uri)}
   onLoadStart={()=>{if(recovery.current?.current(generation)){adDocument.current++;ads.current?.resetDocument();}}}
   onLoadEnd={()=>{if(recovery.current?.current(generation))nativeMetric('webview_loaded');}}
   onContentProcessDidTerminate={()=>recovery.current?.terminated(generation)}
   onRenderProcessGone={event=>{if(!recovery.current?.current(generation))return;nativeMetric('android_render_process_gone',{failed:event.nativeEvent.didCrash?1:0});recovery.current.terminated(generation);}}
   onError={()=>recovery.current?.failed(generation)}
   onMessage={event=>{
    if(!recovery.current?.current(generation))return;
    const raw=event.nativeEvent.data;
    const adMessage=parseAdMessage(raw);if(adMessage){
     const documentToken=adDocument.current;
     const notify=(stage:'showing'|'continue')=>{if(adDocument.current===documentToken&&recovery.current?.current(generation))webView.current?.injectJavaScript('window.dispatchEvent(new CustomEvent("lifespinner.ads.response.v1",{detail:'+JSON.stringify({seq:adMessage.seq,stage})+'}));true;');};
     const result=ads.current?.receive(adMessage,()=>notify('showing'));
     if(adMessage.event==='request')void Promise.resolve(result).then(()=>notify('continue')).catch(()=>notify('continue'));
     return;
    }
    const back=parseBackResult(raw,pendingBack.current);if(back!==null){pendingBack.current=null;if(!back&&Platform.OS==='android')BackHandler.exitApp();return;}
    const clearId=parseCatalogClearMessage(raw);if(clearId){const notify=(ok:boolean)=>{if(recovery.current?.current(generation))webView.current?.injectJavaScript('window.dispatchEvent(new CustomEvent(\"random-life.catalog-clear-result\",{detail:'+JSON.stringify({requestId:clearId,ok})+'}));true;');};void catalogStorage.current.clear().then(()=>{if(recovery.current?.current(generation))return FileSystem.writeAsStringAsync(uri.slice(0,uri.lastIndexOf('/')+1)+'catalog-cache.js','');}).then(()=>notify(true)).catch(()=>notify(false));return;}
    const catalog=parseCatalogMessage(raw);if(catalog){void catalogStorage.current.write(catalog).catch(()=>{});return;}
    if(raw.length<100&&raw===JSON.stringify({type:'random-life.performance.export.v1'})){void shareDiagnostics().catch(()=>{});return;}
    const metric=parsePerformanceMessage(raw);if(metric){recordDiagnostic(metric);return;}
    const share=parseNativeShare(raw)??parseAppShare(raw);
    if(share){void Share.share({title:share.title,message:share.message}).catch(()=>{});return;}
    const next=applyStorageMessage(state.current,event.nativeEvent.data);
    if(next){state.current=next;void writer.current(next);}
   }}
   style={styles.web}
  />}
 </View>;
}
const styles=StyleSheet.create({screen:{flex:1,backgroundColor:'#fbefe7'},web:{flex:1,backgroundColor:'#fbefe7'},loading:{position:'absolute',top:0,bottom:0,left:0,right:0,justifyContent:'center',alignItems:'center',backgroundColor:'#fbefe7'},error:{padding:30},retry:{marginTop:20,padding:16,borderRadius:20,backgroundColor:'#af6c68'},retryText:{color:'#fff',textAlign:'center',fontSize:18}});
