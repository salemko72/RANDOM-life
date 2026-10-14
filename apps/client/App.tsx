import {SafeAreaProvider,useSafeAreaInsets} from 'react-native-safe-area-context';
import React, {useEffect, useRef, useState, useMemo} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {WebView} from 'react-native-webview';
import preview from './src/generated/preview.json';
import {applyStorageMessage, createSnapshotWriter, LocalState, NATIVE_STATE_KEY, readSnapshot, seedPreviewHtml} from './src/native/profile-bridge';

// Temporary Expo Go preview bridge. The browser UI is embedded locally;
// this is not the final native implementation and does not call a backend.
export default function App(){return <SafeAreaProvider style={{flex:1,backgroundColor:'#fbefe7'}}><NativeExperience/></SafeAreaProvider>;}
function NativeExperience(){
 const insets=useSafeAreaInsets();
 const [error,setError]=useState('');
 const [html,setHtml]=useState<string | null>(null);
 const state=useRef<LocalState>({});
 const writer=useRef(createSnapshotWriter(value=>AsyncStorage.setItem(NATIVE_STATE_KEY,value),()=>setError('Lokalni podaci nisu spremljeni. Provjeri slobodan prostor i ponovo otvori RANDOM.')));
 useEffect(()=>{
  let active=true;
  AsyncStorage.getItem(NATIVE_STATE_KEY).then(raw=>{
   if(!active)return;
   state.current=readSnapshot(raw);
   setHtml(seedPreviewHtml(preview.html,state.current));
  }).catch(()=>{if(active)setError('Lokalni podaci nisu dostupni. Ponovo otvori RANDOM.');});
  return ()=>{active=false;};
 },[]);
 const renderedHtml=useMemo(()=>{
  if(html===null)return null;
  const safe=seedPreviewHtml(preview.html,state.current);
  const css=`<style>html,body{background:#fbefe7}</style><script>document.documentElement.style.setProperty('--native-safe-top','${insets.top}px');document.documentElement.style.setProperty('--native-safe-bottom','${insets.bottom}px');</script>`;
  return safe.replace('</head>',css+'</head>').replace('initial-scale=1','initial-scale=1,viewport-fit=cover');
 },[html,insets.top,insets.bottom]);
 return <View style={styles.screen}>
  <StatusBar style="dark"/>
  {error?<View style={styles.error}><Text>{error}</Text></View>:html===null?<View style={styles.loading}><ActivityIndicator color="#af6c68"/></View>:<WebView
   source={{html:renderedHtml??'',baseUrl:'https://random-preview.invalid/'}}
   originWhitelist={['https://random-preview.invalid']}
   javaScriptEnabled domStorageEnabled startInLoadingState
   renderLoading={()=><View style={styles.loading}><ActivityIndicator color="#af6c68"/></View>}
   onShouldStartLoadWithRequest={r=>r.url==='about:blank'||r.url.startsWith('https://random-preview.invalid/')}
   onError={()=>setError('Preview se nije učitao. Zatvori i ponovo otvori RANDOM u Expo Go.')}
   onMessage={event=>{
    const next=applyStorageMessage(state.current,event.nativeEvent.data);
    if(next){state.current=next;void writer.current(next);}
   }}
   style={styles.web}
  />}
 </View>;
}
const styles=StyleSheet.create({screen:{flex:1,backgroundColor:'#fbefe7'},web:{flex:1,backgroundColor:'#fbefe7'},loading:{position:'absolute',top:0,bottom:0,left:0,right:0,justifyContent:'center',alignItems:'center',backgroundColor:'#fbefe7'},error:{padding:30}});
