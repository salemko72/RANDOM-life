import {readFile,stat,writeFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
let contract;
async function contracts(){
 if(contract)return contract;
 try{contract=await import('./random-content-contract.mjs');}
 catch(error){if(error.code!=='ERR_MODULE_NOT_FOUND')throw error;const {build}=await import('esbuild');const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');const output=await build({stdin:{contents:"export {readContentPackage} from './apps/studio/src/content-package';export {createChatGPTPrompt} from './packages/shared/src/prompt';",resolveDir:root},bundle:true,format:'esm',platform:'node',write:false});contract=await import('data:text/javascript;base64,'+Buffer.from(output.outputFiles[0].text).toString('base64'));}
 return contract;
}
export async function importZip(file,{password,baseUrl='https://random-life-preview.pages.dev',fetcher=fetch,session}={}){
 if(!password)throw Error('Set RANDOM_STUDIO_PASSWORD securely before importing. Never put it in the command or ZIP.');
 const base=new URL(baseUrl);if(base.protocol!=='https:'&&!['localhost','127.0.0.1'].includes(base.hostname))throw Error('HTTPS is required.');
 if((await stat(file)).size>25*1024*1024)throw Error('ZIP exceeds 25 MB.');
 const {readContentPackage}=await contracts();const pack=readContentPackage(new Uint8Array(await readFile(file)),{repair:true});
 let image;
 if(pack.image.bytes.length){
  image=await sharp(pack.image.bytes,{limitInputPixels:40000000}).rotate().resize({width:1440,height:1440,fit:'inside',withoutEnlargement:true}).webp({quality:84}).toBuffer();
  if(image.length>1024*1024)throw Error('Optimized image exceeds 1 MB.');
  pack.input.image.path='/media/import-'+createHash('sha256').update(image).digest('hex')+'.webp';
 }
 // Parser resets all human approvals. An automated contributor can never mark these verified.
 const ownSession=!session;session??={};let cookie=session.cookie??'';
 async function request(path,method,body,type='application/json'){
  const response=await fetcher(base.origin+path,{method,redirect:'error',headers:{Origin:base.origin,'Content-Type':type,...(cookie?{Cookie:cookie}:{})},body:type==='application/json'?JSON.stringify(body):body});
  if(!response.ok){const error=await response.json().catch(()=>({}));throw Error(`${response.status}: ${error.error??'Online request failed'}`);}
  return response;
 }
 if(!cookie){const login=await request('/api/database/login','POST',{password});cookie=login.headers.get('set-cookie')?.split(';')[0]??'';if(!cookie)throw Error('Missing editor session.');session.cookie=cookie;}
 try{
  if(image)await request('/api/database/media/'+pack.input.image.path.slice(7),'PUT',image,'image/webp');
  const response=await request('/api/content','POST',{input:pack.input});const result=await response.json();
  return {id:result.item.id,title:result.item.title,status:result.item.status,duplicate:!!result.duplicate,needsArtwork:!!pack.needsArtwork};
 }finally{if(ownSession){await request('/api/database/logout','POST',{}).catch(()=>{});session.cookie='';cookie='';}}
}
async function main(){
 const args=process.argv.slice(2);
 if(args[0]==='--prompt'){
  const [category,source,output='RANDOM-prompt.txt']=args.slice(1);if(!['EAT','BOOK','WATCH','MOVE','GO'].includes(category)||!source)throw Error('Usage: --prompt EAT|BOOK|WATCH|MOVE|GO "source or idea" [output.txt]');
  await writeFile(output,(await contracts()).createChatGPTPrompt(category,source));console.log('Prompt saved: '+output);return;
 }
 if(!args.length){console.log('Usage: node ahmed-content-import.mjs item.zip [more.zip ...]\nGenerate prompt: node ahmed-content-import.mjs --prompt BOOK "Atomic Habits by James Clear"');return;}
 let failures=0;const session={};
 for(const file of args){try{const result=await importZip(file,{password:process.env.RANDOM_STUDIO_PASSWORD,session});console.log(JSON.stringify({file,...result}));}catch(error){failures++;console.error(file+': '+error.message);}}
 if(session.cookie)await fetch('https://random-life-preview.pages.dev/api/database/logout',{method:'POST',headers:{Origin:'https://random-life-preview.pages.dev',Cookie:session.cookie}}).catch(()=>{});session.cookie='';
 if(failures)process.exitCode=1;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)main().catch(error=>{console.error(error.message);process.exitCode=1;});
