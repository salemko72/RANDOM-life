import React, {useState} from 'react';
import {ActivityIndicator, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {WebView} from 'react-native-webview';
import preview from './src/generated/preview.json';

// Temporary Expo Go preview bridge. The browser UI is embedded locally;
// this is not the final native implementation and does not call a backend.
export default function App(){
 const [error,setError]=useState('');
 return <SafeAreaView style={styles.screen}>
  <StatusBar style="dark"/>
  {error?<View style={styles.error}><Text>{error}</Text></View>:<WebView
   source={{html:preview.html,baseUrl:'https://random-preview.invalid/'}}
   originWhitelist={['https://random-preview.invalid']}
   javaScriptEnabled domStorageEnabled startInLoadingState
   renderLoading={()=><View style={styles.loading}><ActivityIndicator color="#af6c68"/></View>}
   onShouldStartLoadWithRequest={r=>r.url==='about:blank'||r.url.startsWith('https://random-preview.invalid/')}
   onError={()=>setError('Preview se nije učitao. Zatvori i ponovo otvori RANDOM u Expo Go.')}
   style={styles.web}
  />}
 </SafeAreaView>;
}
const styles=StyleSheet.create({screen:{flex:1,backgroundColor:'#fbefe7'},web:{flex:1,backgroundColor:'#fbefe7'},loading:{position:'absolute',top:0,bottom:0,left:0,right:0,justifyContent:'center',alignItems:'center',backgroundColor:'#fbefe7'},error:{padding:30}});
