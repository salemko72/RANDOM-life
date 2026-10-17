import {readFile,mkdir,writeFile,rm,access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
import {spawn} from 'node:child_process';
const root=dirname(fileURLToPath(import.meta.url));
const version=Number(process.versions.node.split('.')[0]);
if(process.platform!=='win32'||version<24){console.error('Potreban je Windows i Node.js 24 LTS ili noviji: https://nodejs.org/');process.exit(1);}
const client=resolve(root,'apps/client');
const env={...process.env,EAS_NO_VCS:'1',EAS_PROJECT_ROOT:root};
function run(command,args,{cwd=root,allowFailure=false}={}){return new Promise((done,reject)=>{const p=spawn(command,args,{cwd,env,stdio:'inherit',shell:false});p.on('error',reject);p.on('exit',code=>{if(code!==0&&!allowFailure)reject(Error(`${command} zavrsio s kodom ${code}.`));else done(code);});});}
// cmd.exe handles npm/npx .cmd launchers on Windows. Every command below is fixed text.
const npm=(args,options)=>run(process.env.ComSpec||'cmd.exe',['/d','/s','/c',args],options);
try{
 const manifest=JSON.parse(await readFile(resolve(root,'assets-manifest.json'),'utf8'));
 const folder=resolve(root,'.random-downloads');await mkdir(folder,{recursive:true});
 console.log('\n[1/4] Preuzimam slike i provjeravam SHA-256...');
 for(const part of manifest.parts){
  if(!/^assets-\d{2}-[a-f0-9]{12}\.zip$/.test(part.name)||!/^[a-f0-9]{64}$/.test(part.sha256))throw Error('Neispravan manifest.');
  const archive=resolve(folder,part.name);let valid=false;
  try{const data=await readFile(archive);valid=createHash('sha256').update(data).digest('hex')===part.sha256;}catch{}
  if(!valid){const response=await fetch(`https://random-life-preview.pages.dev/downloads/expo-windows/${part.name}`);if(!response.ok)throw Error(`Download ${response.status}: ${part.name}`);const data=Buffer.from(await response.arrayBuffer());if(data.length!==part.bytes||createHash('sha256').update(data).digest('hex')!==part.sha256)throw Error('Preuzeti ZIP nije prosao provjeru: '+part.name);await writeFile(archive,data);}
  // Paths are passed through environment variables, never inserted into PowerShell source.
  const unpackEnv={...env,RANDOM_ARCHIVE:archive,RANDOM_DESTINATION:root};
  await new Promise((done,reject)=>{const p=spawn('powershell.exe',['-NoProfile','-NonInteractive','-Command','Expand-Archive -LiteralPath $env:RANDOM_ARCHIVE -DestinationPath $env:RANDOM_DESTINATION -Force'],{cwd:root,env:unpackEnv,stdio:'inherit'});p.on('error',reject);p.on('exit',code=>code===0?done():reject(Error('Raspakivanje nije uspjelo.')));});
 }
 console.log('\n[2/4] Instaliram zavisnosti i pripremam trenutni UI...');
 await npm('npm ci --no-audit --no-fund');
 console.log('\n[3/4] Provjera Expo prijave (koristi salemko)...');
 if(await npm('npx --yes eas-cli@24.14.0 whoami',{cwd:client,allowFailure:true})!==0)await npm('npx --yes eas-cli@24.14.0 login',{cwd:client});
 console.log('\n[4/4] Expo APK build. Ako trazi Android keystore, izaberi generisanje.');
 console.log('Koristi samo besplatnu kvotu. Ako trazi placanje/nadogradnju, prekini sa Ctrl+C.');
 await npm('npx --yes eas-cli@24.14.0 project:info',{cwd:client});
 await npm('npx --yes eas-cli@24.14.0 build --platform android --profile preview',{cwd:client});
 console.log('\nExpo je iznad prikazao status i link za build/APK.');
}catch(error){console.error('\n'+error.message);process.exitCode=1;}
