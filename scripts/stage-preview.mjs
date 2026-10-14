import {build} from 'esbuild';
import {cp,mkdir,rm,writeFile,access} from 'node:fs/promises';
import {resolve} from 'node:path';
const source=resolve('apps/client/preview-dist');const target=resolve('apps/client/preview-site');
await rm(target,{recursive:true,force:true});await mkdir(target,{recursive:true});
for(const file of ['index.html','studio.html','standalone.js','standalone.css'])await cp(resolve(source,file),resolve(target,file));
await cp(resolve(source,'assets'),resolve(target,'assets'),{recursive:true});
await writeFile(resolve(target,'_headers'),'/*\n  Cache-Control: no-cache\n  X-Content-Type-Options: nosniff\n');
await build({entryPoints:['services/artwork/worker.ts'],bundle:true,format:'esm',platform:'browser',target:'es2022',outfile:resolve(target,'_worker.js')});
await writeFile(resolve(target,'_routes.json'),JSON.stringify({version:1,include:['/api/*','/media/*'],exclude:[]}));
try{await access('/workspace/shared/downloads/recipes');await cp('/workspace/shared/downloads/recipes',resolve(target,'downloads/recipes'),{recursive:true});}catch(error){if(error.code!=='ENOENT')throw error;}
console.log('Staged Pages preview with artwork routes; static pages remain assets.');
