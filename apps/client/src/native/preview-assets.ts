import {profileBootstrapScript,type LocalState} from './profile-bridge';

type InstalledAsset={hash:string|null;localUri:string|null;downloadAsync:()=>Promise<unknown>};
type Files={
 cacheDirectory:string|null;
 makeDirectoryAsync:(uri:string,options:{intermediates:boolean})=>Promise<unknown>;
 getInfoAsync:(uri:string)=>Promise<{exists:boolean}>;
 copyAsync:(options:{from:string;to:string})=>Promise<unknown>;
 writeAsStringAsync:(uri:string,contents:string)=>Promise<unknown>;
};

// HTML stays in the installed asset/file system. It never becomes a React prop
// or a second 49 MB JavaScript string on its way to the native WebView.
export async function prepareNativePreview(asset:InstalledAsset,files:Files,state:LocalState,insets:{top:number;bottom:number}):Promise<string>{
 await asset.downloadAsync();
 if(!asset.localUri?.startsWith('file://')||!files.cacheDirectory)throw new Error('Installed RANDOM UI is unavailable.');
 if(!asset.hash||!/^[a-f0-9]+$/i.test(asset.hash))throw new Error('Installed RANDOM UI has no content hash.');
 const directory=`${files.cacheDirectory}random-preview-${asset.hash}/`,uri=directory+'index.html';
 await files.makeDirectoryAsync(directory,{intermediates:true});
 if(!(await files.getInfoAsync(uri)).exists)await files.copyAsync({from:asset.localUri,to:uri});
 const safe=(n:number)=>Number.isFinite(n)?Math.max(0,Math.min(200,n)):0;
 const script=profileBootstrapScript(state)+`\ndocument.documentElement.style.setProperty('--native-safe-top','${safe(insets.top)}px');document.documentElement.style.setProperty('--native-safe-bottom','${safe(insets.bottom)}px');`;
 await files.writeAsStringAsync(directory+'native-state.js',script);
 return uri;
}
