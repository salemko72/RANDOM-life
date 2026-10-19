import { build } from 'esbuild';
import sharp from 'sharp';
import {createHash} from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve, relative } from 'node:path';
const directory=resolve('apps/client/preview-dist');
let imageAfter=0;
// Convert build outputs only. Original art and sprite coordinates stay intact.
const optimizedImages={name:'optimized-photos',setup(build){
 build.onResolve({filter:/\.png$/},args=>({path:resolve(args.resolveDir,args.path)+'.webp',namespace:'optimized-photo'}));
 build.onLoad({filter:/.*/,namespace:'optimized-photo'},async args=>{
  const original=args.path.slice(0,-5),limit=/ingredient|atlas/.test(original)?2048:1200;
  const pipeline=sharp(original);
  const contents=await pipeline.resize({width:limit,height:limit,fit:'inside',withoutEnlargement:true}).webp({quality:/ingredient|atlas/.test(original)?86:78,effort:4}).toBuffer();imageAfter+=contents.length;
  return{contents,loader:'file'};
 });
}};
const result=await build({entryPoints:['apps/client/src/web/standalone.tsx'],bundle:true,write:false,format:'iife',platform:'browser',target:'es2022',outdir:directory,assetNames:'assets/[name]-[hash]',loader:{'.png':'file','.webp':'file','.ttf':'dataurl'},plugins:[optimizedImages],define:{'process.env.NODE_ENV':'"production"'},minify:true});
console.log(`Optimized PNG artwork → WebP: ${imageAfter} bytes`);
for(const file of result.outputFiles){await mkdir(dirname(file.path),{recursive:true});await writeFile(file.path,file.contents);}
const version=createHash('sha256').update(result.outputFiles.find(f=>f.path.endsWith('.js')).contents).update(result.outputFiles.find(f=>f.path.endsWith('.css')).contents).digest('hex').slice(0,12);
await writeFile(resolve(directory,'index.html'),'<!doctype html><html lang="bs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>LifeSpinner</title><link rel="icon" type="image/png" href="/favicon.png"><link rel="stylesheet" href="./standalone.css?v='+version+'"></head><body><div id="root"></div><script src="./standalone.js?v='+version+'"></script></body></html>');
await writeFile(resolve(directory,'studio.html'),'<html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=./#studio"><title>LifeSpinner Content Studio</title></head><body><a href="./#studio">Otvori Content Studio</a></body></html>');
const css=result.outputFiles.find(f=>f.path.endsWith('.css')).text;
const js=result.outputFiles.find(f=>f.path.endsWith('.js')).text;
const images=result.outputFiles.filter(f=>/\.(png|webp)$/.test(f.path)).map(f=>({path:relative(directory,f.path).replaceAll('\\','/'),data:Buffer.from(f.contents).toString('base64'),mime:f.path.endsWith('.webp')?'image/webp':'image/png'}));
const escape=s=>s.replace(/<\/script/gi,'<\\/script');
const embedded=`let css=${JSON.stringify(css)};for(const asset of ${JSON.stringify(images)}){const bytes=Uint8Array.from(atob(asset.data),c=>c.charCodeAt(0));const url=URL.createObjectURL(new Blob([bytes],{type:asset.mime}));globalThis.__randomAssetUrls??={};globalThis.__randomAssetUrls[asset.path]=url;globalThis.__randomAssetUrls['./'+asset.path]=url;if(css.includes(asset.path))css=css.split('./'+asset.path).join(url).split(asset.path).join(url);}const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);`;
await writeFile(resolve(directory,'RANDOM_INTERACTIVE_PREVIEW.html'),`<!doctype html><html lang="bs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>LifeSpinner — interactive preview</title></head><body><div id="root"></div><script>${escape(embedded)}</script><script>${escape(js)}</script></body></html>`);
const html=await import('node:fs/promises').then(fs=>fs.readFile(resolve(directory,'RANDOM_INTERACTIVE_PREVIEW.html'),'utf8'));
await writeFile(resolve(directory,'RANDOM_CONTENT_STUDIO.html'),html.replace('<script>',"<script>location.hash='studio';</script><script>"));
await mkdir(resolve('apps/client/src/generated'),{recursive:true});
await writeFile(resolve('apps/client/src/generated/preview.json'),JSON.stringify({html}));
// Metro treats HTML as an installed asset, keeping it out of the Hermes bundle
// and the React Native view-property transport. Only local state is bootstrapped.
await writeFile(resolve('apps/client/src/generated/preview.html'),html.replace('initial-scale=1','initial-scale=1,viewport-fit=cover').replace('</head>','<script src="./native-state.js"></script></head>'));
console.log('Built browser preview and self-contained interactive HTML (fonts and original images included).');
