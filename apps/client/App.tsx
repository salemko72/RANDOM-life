import {PerformanceLog,PERFORMANCE_KEY,parsePerformanceMessage,type PerformanceEvent} from './src/native/performance-log';
import appConfig from './app.json';
import {SafeAreaProvider,useSafeAreaInsets} from 'react-native-safe-area-context';
import React, {useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator, Platform, Share, StyleSheet, Text, View} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {WebView} from 'react-native-webview';
import {Asset} from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import {applyStorageMessage, createSnapshotWriter, LocalState, NATIVE_STATE_KEY, readSnapshot} from './src/native/profile-bridge';
import {prepareNativePreview} from './src/native/preview-assets';
import {parseNativeShare} from './src/web/item-share';

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
  if(!diagnosticsLoaded.current){diagnosticsLoaded.current=true;diagnosticQueue.current=AsyncStorage.getItem(PERFORMANCE_KEY).then(raw=>{diagnostics.current=new PerformanceLog(raw);}).catch(()=>{});}
  diagnosticQueue.current=diagnosticQueue.current.then(async()=>{diagnostics.current.add(event);await AsyncStorage.setItem(PERFORMANCE_KEY,JSON.stringify(diagnostics.current.rows));}).catch(()=>{});
 }
 function nativeMetric(name:string){recordDiagnostic({name,at:Date.now(),metrics:{elapsedMs:Date.now()-nativeStartedAt.current}});}
 async function shareDiagnostics(){
  await diagnosticQueue.current;
  const constants=Platform.constants as unknown as Record<string,unknown>;
  const message=JSON.stringify({schema:1,version:appConfig.expo.version,build:appConfig.expo.android.versionCode,exportedAt:new Date().toISOString(),device:{os:Platform.OS,android:Platform.Version,model:constants.Model??null,manufacturer:constants.Manufacturer??null},events:diagnostics.current.rows},null,2);
  await Share.share({title:'RANDOM diagnostic log',message});
 }

 const [error,setError]=useState('');
 const [uri,setUri]=useState<string | null>(null);
 const state=useRef<LocalState>({});
 const writer=useRef(createSnapshotWriter(value=>AsyncStorage.setItem(NATIVE_STATE_KEY,value),()=>setError('Lokalni podaci nisu spremljeni. Provjeri slobodan prostor i ponovo otvori RANDOM.')));
 useEffect(()=>{
  let active=true;nativeStartedAt.current=Date.now();nativeMetric('native_start');
  AsyncStorage.getItem(NATIVE_STATE_KEY).then(async raw=>{
   if(!active)return;
   state.current=readSnapshot(raw);nativeMetric('profile_loaded');
   const asset=Asset.fromModule(require('./src/generated/preview.html'));
   const local=await prepareNativePreview(asset,FileSystem,state.current,insets);
   nativeMetric('assets_ready');if(active)setUri(local);
  }).catch(()=>{if(active)setError('RANDOM se nije mogao pokrenuti. Provjeri slobodan prostor i ponovo otvori aplikaciju.');});
  return ()=>{active=false;};
 },[insets.top,insets.bottom]);
 return <View style={styles.screen}>
  <StatusBar style="dark"/>
  {error?<View style={styles.error}><Text>{error}</Text></View>:uri===null?<View style={styles.loading}><ActivityIndicator color="#af6c68"/></View>:<WebView
   source={{uri}}
   originWhitelist={['file://*']}
   allowFileAccess
   allowingReadAccessToURL={uri.slice(0,uri.lastIndexOf('/')+1)}
   javaScriptEnabled domStorageEnabled startInLoadingState
   renderLoading={()=><View style={styles.loading}><ActivityIndicator color="#af6c68"/></View>}
   onShouldStartLoadWithRequest={r=>r.url==='about:blank'||r.url.split('#')[0]===uri}
   onLoadEnd={()=>nativeMetric('webview_loaded')}
   onError={()=>{nativeMetric('page_error');setError('RANDOM se nije učitao. Zatvori i ponovo otvori aplikaciju.');}}
   onMessage={event=>{
    const raw=event.nativeEvent.data;
    if(raw.length<100&&raw===JSON.stringify({type:'random-life.performance.export.v1'})){void shareDiagnostics().catch(()=>{});return;}
    const metric=parsePerformanceMessage(raw);if(metric){recordDiagnostic(metric);return;}
    const share=parseNativeShare(raw);
    if(share){void Share.share({title:share.title,message:share.message}).catch(()=>{});return;}
    const next=applyStorageMessage(state.current,event.nativeEvent.data);
    if(next){state.current=next;void writer.current(next);}
   }}
   style={styles.web}
  />}
 </View>;
}
const styles=StyleSheet.create({screen:{flex:1,backgroundColor:'#fbefe7'},web:{flex:1,backgroundColor:'#fbefe7'},loading:{position:'absolute',top:0,bottom:0,left:0,right:0,justifyContent:'center',alignItems:'center',backgroundColor:'#fbefe7'},error:{padding:30}});
