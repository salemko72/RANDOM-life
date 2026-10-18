import {SafeAreaProvider,useSafeAreaInsets} from 'react-native-safe-area-context';
import React, {useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator, Share, StyleSheet, Text, View} from 'react-native';
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
 const [error,setError]=useState('');
 const [uri,setUri]=useState<string | null>(null);
 const state=useRef<LocalState>({});
 const writer=useRef(createSnapshotWriter(value=>AsyncStorage.setItem(NATIVE_STATE_KEY,value),()=>setError('Lokalni podaci nisu spremljeni. Provjeri slobodan prostor i ponovo otvori RANDOM.')));
 useEffect(()=>{
  let active=true;
  AsyncStorage.getItem(NATIVE_STATE_KEY).then(async raw=>{
   if(!active)return;
   state.current=readSnapshot(raw);
   const asset=Asset.fromModule(require('./src/generated/preview.html'));
   const local=await prepareNativePreview(asset,FileSystem,state.current,insets);
   if(active)setUri(local);
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
   onError={()=>setError('RANDOM se nije učitao. Zatvori i ponovo otvori aplikaciju.')}
   onMessage={event=>{
    const share=parseNativeShare(event.nativeEvent.data);
    if(share){void Share.share({title:share.title,message:share.message}).catch(()=>{});return;}
    const next=applyStorageMessage(state.current,event.nativeEvent.data);
    if(next){state.current=next;void writer.current(next);}
   }}
   style={styles.web}
  />}
 </View>;
}
const styles=StyleSheet.create({screen:{flex:1,backgroundColor:'#fbefe7'},web:{flex:1,backgroundColor:'#fbefe7'},loading:{position:'absolute',top:0,bottom:0,left:0,right:0,justifyContent:'center',alignItems:'center',backgroundColor:'#fbefe7'},error:{padding:30}});
