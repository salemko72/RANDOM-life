import {cp,mkdir,rm,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const source=resolve('apps/client/preview-dist');const target=resolve('apps/client/preview-site');
await rm(target,{recursive:true,force:true});await mkdir(target,{recursive:true});
for(const file of ['index.html','studio.html','standalone.js','standalone.css'])await cp(resolve(source,file),resolve(target,file));
await cp(resolve(source,'assets'),resolve(target,'assets'),{recursive:true});
await writeFile(resolve(target,'_headers'),'/*\n  Cache-Control: no-cache\n  X-Content-Type-Options: nosniff\n');
console.log('Staged static-only Pages preview; offline/native documents excluded.');
