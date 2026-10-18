import {build} from 'esbuild';
import {cp,mkdir,rm,writeFile,access} from 'node:fs/promises';
import {resolve} from 'node:path';
import {readFile} from 'node:fs/promises';
import {zipSync,strToU8} from 'fflate';
const source=resolve('apps/client/preview-dist');const target=resolve('apps/client/preview-site');
await rm(target,{recursive:true,force:true});await mkdir(target,{recursive:true});
for(const file of ['index.html','studio.html','standalone.js','standalone.css'])await cp(resolve(source,file),resolve(target,file));
await cp(resolve(source,'assets'),resolve(target,'assets'),{recursive:true});
for(const file of ['privacy.html','delete-data.html','terms.html'])await cp(resolve('apps/client/public/legal',file),resolve(target,file));
await writeFile(resolve(target,'_headers'),'/*\n  Cache-Control: no-cache\n  X-Content-Type-Options: nosniff\n');
await build({entryPoints:['services/artwork/worker.ts'],bundle:true,format:'esm',platform:'browser',target:'es2022',outfile:resolve(target,'_worker.js')});
await writeFile(resolve(target,'_routes.json'),JSON.stringify({version:1,include:['/item/*','/api/*','/media/*','/downloads/RANDOM-life-android.apk'],exclude:[]}));
try{await access('/workspace/shared/downloads/recipes');await cp('/workspace/shared/downloads/recipes',resolve(target,'downloads/recipes'),{recursive:true});}catch(error){if(error.code!=='ENOENT')throw error;}
console.log('Staged Pages preview with artwork routes; static pages remain assets.');

const contract=await build({stdin:{contents:"export {readContentPackage} from './apps/studio/src/content-package';export {createChatGPTPrompt} from './packages/shared/src/prompt';export {CONTENT_CONTRACT_VERSION,contentContract,defaultAccessLinks} from './packages/shared/src/access-links';",resolveDir:resolve('.')},bundle:true,format:'esm',platform:'node',write:false});
const contractModule=await import('data:text/javascript;base64,'+Buffer.from(contract.outputFiles[0].contents).toString('base64'));
const kit=zipSync({'random-content-contract.mjs':contract.outputFiles[0].contents,'content-contract.json':strToU8(JSON.stringify(contractModule.contentContract,null,2)),'ahmed-content-import.mjs':new Uint8Array(await readFile('scripts/ahmed-content-import.mjs')),'README.md':new Uint8Array(await readFile('docs/AHMED_CONTENT_WORKFLOW.md')),'CHATGPT-INSTRUCTIONS.txt':new Uint8Array(await readFile('docs/content/CHATGPT-INSTRUCTIONS.txt')),'CONTENT-FORMAT-v2.md':new Uint8Array(await readFile('docs/content/ACCESS_LINKS_V2.md')),'package.json':strToU8(JSON.stringify({name:'random-content-kit',version:'2.0.0',private:true,type:'module',engines:{node:'>=22'},dependencies:{sharp:'^0.35.5'}}))});
await mkdir(resolve(target,'downloads'),{recursive:true});await writeFile(resolve(target,'downloads/RANDOM-Ahmed-content-kit.zip'),kit);
await writeFile(resolve(target,'downloads/RANDOM-content-workflow.md'),await readFile('docs/AHMED_CONTENT_WORKFLOW.md'));
await writeFile(resolve(target,'downloads/RANDOM-content-format-v2.md'),await readFile('docs/content/ACCESS_LINKS_V2.md'));
await writeFile(resolve(target,'downloads/RANDOM-ChatGPT-instructions-v2.txt'),await readFile('docs/content/CHATGPT-INSTRUCTIONS.txt'));

await import('./build-original-recovery.mjs');
const atlasRoot=resolve('content/ingredient-atlas-extension-74');
const atlasFiles={};for(const name of ['atlas.png','manifest.json','README.md'])atlasFiles[name]=new Uint8Array(await readFile(resolve(atlasRoot,name)));
await writeFile(resolve(target,'downloads/RANDOM-ingredient-atlas-74.zip'),zipSync(atlasFiles));

const atlas50Root=resolve('content/ingredient-atlas-extension-50');const atlas50Files={};for(const name of ['atlas.png','manifest.json','README.md'])atlas50Files[name]=new Uint8Array(await readFile(resolve(atlas50Root,name)));await writeFile(resolve(target,'downloads/RANDOM-ingredient-atlas-50.zip'),zipSync(atlas50Files));

// Keep the reviewed-format GO batch downloadable after future rebuilds.
await mkdir(resolve(target,'downloads/recipes/go-actions'),{recursive:true});
for(const name of ['RANDOM-GO-20-catalog.zip','RANDOM-GO-20-individual-zips.zip'])await cp(resolve('content/go-actions-2026-10-15',name),resolve(target,'downloads/recipes/go-actions',name));

const atlas126Root=resolve('content/ingredient-atlas-extension-126');const atlas126Files={};
for(const name of ['manifest.json','README.md','source.json'])atlas126Files[name]=new Uint8Array(await readFile(resolve(atlas126Root,name)));
for(let page=1;page<=8;page++){const number=String(page).padStart(2,'0');atlas126Files[`atlas-${number}.png`]=new Uint8Array(await readFile(resolve('apps/client/src/web/assets',`ingredient-atlas-extension-126-${number}.png`)));}
await writeFile(resolve(target,'downloads/RANDOM-ingredient-atlas-126.zip'),zipSync(atlas126Files));

try{await access('/workspace/shared/android-download');await cp('/workspace/shared/android-download',resolve(target,'downloads/android'),{recursive:true});}catch(error){if(error.code!=='ENOENT')throw error;}

// The Windows distribution lives on GitHub; keep its large image packs out of web deployments.

const diagnosticsFiles={};for(const name of ['PRIKUPI-GRESKU.cmd','prikupi-gresku.mjs','PROCITAJ.txt'])diagnosticsFiles[name]=new Uint8Array(await readFile(resolve('scripts/android-diagnostics',name)));
await writeFile(resolve(target,'downloads/RANDOM-Android-dijagnostika.zip'),zipSync(diagnosticsFiles));
