import {readFile,writeFile,mkdir,access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
import {spawn,execFile} from 'node:child_process';
import {promisify} from 'node:util';
const exec=promisify(execFile),root=dirname(fileURLToPath(import.meta.url));
const pkg='com.salemko.randomlife';
const sdk={url:'https://dl.google.com/android/repository/platform-tools_r37.0.1-win.zip',sha1:'e03e78b1d80b396f1c3358e31251cb31740e1110',bytes:8044989};
async function run(file,args,options={}){return(await exec(file,args,{encoding:'utf8',timeout:30000,maxBuffer:1024*1024,...options})).stdout.trim();}
try{
 if(process.platform!=='win32'||Number(process.versions.node.split('.')[0])<24)throw Error('Potreban je Windows i Node.js 24 LTS.');
 const folder=resolve(root,'.android-tools');await mkdir(folder,{recursive:true});
 const archive=resolve(folder,'platform-tools.zip');let valid=false;
 try{const data=await readFile(archive);valid=data.length===sdk.bytes&&createHash('sha1').update(data).digest('hex')===sdk.sha1;}catch{}
 if(!valid){console.log('Preuzimam sluzbeni Android ADB alat (8 MB)...');const r=await fetch(sdk.url);if(!r.ok)throw Error('Google download: '+r.status);const bytes=Buffer.from(await r.arrayBuffer());if(bytes.length!==sdk.bytes||createHash('sha1').update(bytes).digest('hex')!==sdk.sha1)throw Error('ADB arhiva nije prosla provjeru integriteta.');await writeFile(archive,bytes);}
 await exec('powershell.exe',['-NoProfile','-NonInteractive','-Command','Expand-Archive -LiteralPath $env:RANDOM_ADB_ARCHIVE -DestinationPath $env:RANDOM_ADB_FOLDER -Force'],{env:{...process.env,RANDOM_ADB_ARCHIVE:archive,RANDOM_ADB_FOLDER:folder},timeout:60000});
 const adb=resolve(folder,'platform-tools/adb.exe');await access(adb);
 console.log('Spoji telefon USB kablom, ukljuci USB debugging i dozvoli pristup na telefonu.');
 const devices=(await run(adb,['devices'])).split(/\r?\n/).slice(1).map(x=>x.trim().split(/\s+/)).filter(x=>x[0]);
 if(devices.some(x=>x[1]==='unauthorized'))throw Error('Potvrdi Allow USB debugging na telefonu, pa ponovo pokreni PRIKUPI-GRESKU.cmd.');
 const connected=devices.filter(x=>x[1]==='device');if(connected.length!==1)throw Error('Potrebno je spojiti tacno jedan odobren telefon. Provjeri USB kabl i dozvolu; odspoji druge telefone/emulatore.');
 const serial=connected[0][0];const shell=(...args)=>run(adb,['-s',serial,'shell',...args]);
 const currentUser=(await shell('am','get-current-user')).trim();if(!/^\d+$/.test(currentUser))throw Error('Nije moguce utvrditi aktivnog Android korisnika.');
 const listing=await shell('cmd','package','list','packages','-U','--user',currentUser,pkg);const uid=/^package:com\.salemko\.randomlife uid:(\d+)\s*$/m.exec(listing)?.[1];if(!uid)throw Error('RANDOM life nije pronadjen pod paketom '+pkg+'. Ne brisi aplikaciju; posalji ovu poruku lokalnom Codexu.');
 const props={};for(const name of ['ro.product.manufacturer','ro.product.model','ro.build.version.release','ro.build.version.sdk','ro.product.cpu.abilist'])props[name]=await shell('getprop',name);
 const info=await shell('dumpsys','package',pkg);const version=info.split('\n').filter(line=>/versionName=|versionCode=/.test(line)).map(line=>line.trim()).join('\n');
 console.log('Prikupljam samo log ovog app korisnika. Ne brisem podatke aplikacije.');
 await shell('am','force-stop',pkg);
 const log=spawn(adb,['-s',serial,'logcat','--uid='+uid,'-v','threadtime','-T','1'],{stdio:['ignore','pipe','pipe']});let output='',errors='',truncated=false;
 log.stdout.on('data',data=>{if(output.length+data.length<=4*1024*1024)output+=data.toString();else truncated=true;});log.stderr.on('data',data=>{if(errors.length<10000)errors+=data.toString();});
 let spawnError;log.on('error',error=>{spawnError=error;});
 let launch='';try{launch=await shell('am','start','-W','-n',pkg+'/.MainActivity');}catch(error){launch=error.stderr||error.message;}
 console.log('RANDOM je pokrenut. Sacekaj oko 20 sekundi, cak i ako se zatvori.');
 await new Promise(r=>setTimeout(r,20000));log.kill();
 await new Promise(resolveDone=>{if(log.exitCode!==null||log.signalCode!==null||spawnError)return resolveDone();log.once('close',resolveDone);setTimeout(resolveDone,2000);});
 if(spawnError)throw spawnError;
 let exitInfo='';try{exitInfo=await shell('dumpsys','activity','exit-info',pkg);}catch{exitInfo='Android ne nudi exit-info za ovaj paket.';}
 const report=['RANDOM life Android startup diagnostic',new Date().toISOString(),'Package: '+pkg,JSON.stringify(props,null,2),version,'\nLAUNCH\n'+launch,'\nAPP LOG (UID-filtered)\n'+output,'\nLOGCAT STATUS\n'+errors+(truncated?'\nLog limited to 4 MB.':''),'\nEXIT INFO\n'+exitInfo].join('\n');
 const path=resolve(root,'RANDOM-Android-report.txt');await writeFile(path,report);console.log('\nGotovo. Posalji RANDOM-Android-report.txt iz ove mape.');console.log('Novi APK nije napravljen; baza i podaci aplikacije nisu obrisani.');
}catch(error){console.error('\n'+error.message);process.exitCode=1;}
