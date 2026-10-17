import{readFile,writeFile,mkdir}from'node:fs/promises';import{createHash}from'node:crypto';import{resolve,basename}from'node:path';
// APK must already be signed and verified. No keystores/passwords belong in this directory.
const source=resolve(process.argv[2]??'apps/client/android/app/build/outputs/apk/release/app-release.apk');const destination=resolve(process.argv[3]??'/workspace/shared/android-download');
const data=await readFile(source);if(data.length<4||data[0]!==80||data[1]!==75)throw Error('Expected a signed APK ZIP archive.');
if(data.length>250*1024*1024)throw Error('APK exceeds download limit.');const sha256=createHash('sha256').update(data).digest('hex');
await mkdir(destination,{recursive:true});
const parts=[];for(let start=0;start<data.length;start+=20*1024*1024){const block=data.subarray(start,Math.min(start+20*1024*1024,data.length));const name=`apk-${sha256}-part-${String(parts.length+1).padStart(2,'0')}.bin`;await writeFile(resolve(destination,name),block);parts.push({path:'/downloads/android/'+name,bytes:block.length});}
const metadata={bytes:data.length,sha256,parts,fileName:'RANDOM-life-android.apk',builtAt:new Date().toISOString(),sourceFile:basename(source),architecture:'arm64-v8a',distribution:'internal test; no Expo Go or Metro server required'};
// Publish manifest last so consumers never see references to unfinished parts.
await writeFile(resolve(destination,'apk-manifest.json'),JSON.stringify(metadata,null,2));await writeFile(resolve(destination,'SHA256SUMS.txt'),`${sha256}  RANDOM-life-android.apk\n`);
console.log(JSON.stringify({bytes:data.length,sha256,parts:parts.length,destination}));
