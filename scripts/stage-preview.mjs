import {build} from 'esbuild';
import {cp,mkdir,rm,writeFile,access} from 'node:fs/promises';
import {resolve} from 'node:path';
import {readFile} from 'node:fs/promises';
import {zipSync,strToU8} from 'fflate';
const source=resolve('apps/client/preview-dist');const target=resolve('apps/client/preview-site');
await rm(target,{recursive:true,force:true});await mkdir(target,{recursive:true});
for(const file of ['index.html','studio.html','standalone.js','standalone.css'])await cp(resolve(source,file),resolve(target,file));
await cp(resolve(source,'assets'),resolve(target,'assets'),{recursive:true});
await writeFile(resolve(target,'_headers'),'/*\n  Cache-Control: no-cache\n  X-Content-Type-Options: nosniff\n');
await build({entryPoints:['services/artwork/worker.ts'],bundle:true,format:'esm',platform:'browser',target:'es2022',outfile:resolve(target,'_worker.js')});
await writeFile(resolve(target,'_routes.json'),JSON.stringify({version:1,include:['/api/*','/media/*'],exclude:[]}));
try{await access('/workspace/shared/downloads/recipes');await cp('/workspace/shared/downloads/recipes',resolve(target,'downloads/recipes'),{recursive:true});}catch(error){if(error.code!=='ENOENT')throw error;}
console.log('Staged Pages preview with artwork routes; static pages remain assets.');

const contract=await build({stdin:{contents:"export {readContentPackage} from './apps/studio/src/content-package';export {createChatGPTPrompt} from './packages/shared/src/prompt';",resolveDir:resolve('.')},bundle:true,format:'esm',platform:'node',write:false});
const kit=zipSync({'random-content-contract.mjs':contract.outputFiles[0].contents,'ahmed-content-import.mjs':new Uint8Array(await readFile('scripts/ahmed-content-import.mjs')),'README.md':new Uint8Array(await readFile('docs/AHMED_CONTENT_WORKFLOW.md')),'package.json':strToU8(JSON.stringify({name:'random-content-kit',private:true,type:'module',engines:{node:'>=22'},dependencies:{sharp:'^0.35.5'}}))});
await mkdir(resolve(target,'downloads'),{recursive:true});await writeFile(resolve(target,'downloads/RANDOM-Ahmed-content-kit.zip'),kit);

await import('./build-original-recovery.mjs');
