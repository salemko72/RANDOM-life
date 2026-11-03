/** Explicit operator-triggered build/submit. Uses EAS credentials; never reads/copies Apple key material. */
import{spawnSync}from'node:child_process';import{readFile,writeFile,open,unlink}from'node:fs/promises';import{fileURLToPath}from'node:url';import path from'node:path';import{nextIosBuild}from'./lib/ios-release-plan.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),client=path.join(root,'apps/client'),appFile=path.join(client,'app.json'),lock=path.join(root,'.ios-release.lock');
const npx=process.platform==='win32'?'npx.cmd':'npx',npm=process.platform==='win32'?'npm.cmd':'npm';
function run(cmd,args,cwd,collect=false){const r=spawnSync(cmd,args,{cwd,env:process.env,stdio:collect?['ignore','pipe','inherit']:'inherit',encoding:'utf8',maxBuffer:8*1024*1024});if(r.error)throw r.error;if(r.status!==0)throw Error(`${cmd} failed (${r.status}); release stopped`);return r.stdout;}
let handle;
try{
 const extra=process.argv.slice(2);if(extra.some(a=>!['--no-wait','--json'].includes(a)))throw Error('Only --no-wait and --json are supported');
 try{handle=await open(lock,'wx');}catch(e){if(e.code==='EEXIST')throw Error('An iOS update is already running in this checkout. Check that process before removing .ios-release.lock.');throw e;}
 await handle.writeFile(String(process.pid));
 const config=JSON.parse(await readFile(appFile,'utf8'));
 if(config.expo?.extra?.eas?.projectId!=='04bf570d-5e7b-4c51-b1ae-65e6fc60cf5a'||config.expo?.ios?.bundleIdentifier!=='com.salemko.randomlife')throw Error('Unexpected Expo project or iOS bundle ID');
 console.log('Checking existing iOS builds on EAS…');
 const builds=JSON.parse(run(npx,['--yes','eas-cli@27.3.0','build:list','--platform','ios','--limit','100','--json','--non-interactive'],client,true));
 const next=nextIosBuild(config.expo.ios.buildNumber,builds);
 run(npm,['run','typecheck'],root);run(npm,['test'],root);run(process.execPath,['--test','tests/ios-release-plan.check.mjs'],root);
 config.expo.ios.buildNumber=next;await writeFile(appFile,JSON.stringify(config,null,2)+'\n');
 console.log(`Preparing LifeSpinner ${config.expo.version} (${next}) for TestFlight…`);
 run(npm,['run','build:preview'],root);

 run(npx,['--yes','eas-cli@27.3.0','build','--platform','ios','--profile','testflight','--auto-submit','--non-interactive',...extra],client);
 console.log('EAS build and automatic submission requested. Verify EAS/Apple processing before telling testers to update.');
}catch(e){console.error(e.message);process.exitCode=1;}
finally{if(handle){await handle.close();await unlink(lock);}}
