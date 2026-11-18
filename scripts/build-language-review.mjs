// Review-only build. Never writes production preview-dist or native generated assets.
import{build}from'esbuild';import sharp from'sharp';import{readFile,writeFile,mkdir}from'node:fs/promises';import{resolve,relative}from'node:path';import{execFileSync}from'node:child_process';
const directory=resolve(process.argv[2]||'/tmp/lifespinner-language-review');
if(directory.includes('/apps/client/'))throw Error('Review output must be separate from application build outputs');
const source=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const reviewOnly={name:'review-only-locales',setup(builder){
 builder.onLoad({filter:/\/ui-language\.tsx$/},async({path})=>{
  let contents=await readFile(path,'utf8');const ready="const readyLocales=['en','bs'] as const;";
  if(!contents.includes(ready)||!contents.includes("{code==='en'?'ENG':'BHS'}"))throw Error('Review locale transform needs updating');
  contents=contents.replace(ready,"const readyLocales=['en','bs','es','pt-BR','de','it'] as const;").replace("{code==='en'?'ENG':'BHS'}",'{uiLocaleCode(code)}');
  return{contents,loader:'tsx'};
 });
 builder.onLoad({filter:/\/WebExperience\.tsx$/},async({path})=>({contents:(await readFile(path,'utf8')).replaceAll("location.hash==='#studio'",'false'),loader:'tsx'}));
 builder.onLoad({filter:/\/consumer-catalog-storage\.ts$/},()=>({contents:'export const consumerCatalogStorage={async read(){return null},async write(){},async clear(){}}',loader:'ts'}));
 builder.onLoad({filter:/\/apps\/studio\/src\/App\.tsx$/},()=>({contents:'export default function ReviewStudio(){return null}',loader:'tsx'}));
}};
const photos={name:'review-photos',setup(builder){
 builder.onResolve({filter:/\.png$/},args=>({path:resolve(args.resolveDir,args.path)+'.webp',namespace:'review-photo'}));
 builder.onLoad({filter:/.*/,namespace:'review-photo'},async({path})=>({contents:await sharp(path.slice(0,-5)).resize({width:/ingredient|atlas/.test(path)?2048:1200,height:/ingredient|atlas/.test(path)?2048:1200,fit:'inside',withoutEnlargement:true}).webp({quality:/ingredient|atlas/.test(path)?86:78,effort:4}).toBuffer(),loader:'file'}));
}};
const result=await build({entryPoints:['apps/client/src/web/standalone.tsx'],bundle:true,write:false,format:'iife',platform:'browser',target:'es2022',outdir:directory,assetNames:'assets/[name]-[hash]',loader:{'.png':'file','.webp':'file','.ttf':'dataurl'},plugins:[reviewOnly,photos],define:{'process.env.NODE_ENV':'"production"'},minify:true});
const css=result.outputFiles.find(file=>file.path.endsWith('.css')).text,js=result.outputFiles.find(file=>file.path.endsWith('.js')).text;
const images=result.outputFiles.filter(file=>/\.(png|webp)$/.test(file.path)).map(file=>({path:relative(directory,file.path).replaceAll('\\','/'),data:Buffer.from(file.contents).toString('base64')}));
const boot=String.raw`
// Use a dedicated storage namespace even when another local preview was opened before.
for(const name of ['localStorage','sessionStorage']){let original;try{original=window[name];}catch{}const prefix='lifespinner-language-review.',memory=new Map();const keys=()=>{try{return Array.from({length:original.length},(_,i)=>original.key(i)).filter(key=>key?.startsWith(prefix));}catch{return[...memory.keys()];}};const storage={getItem:key=>{try{return original.getItem(prefix+key);}catch{return memory.get(prefix+key)??null;}},setItem:(key,value)=>{try{original.setItem(prefix+key,value);}catch{memory.set(prefix+key,String(value));}},removeItem:key=>{try{original.removeItem(prefix+key);}catch{}memory.delete(prefix+key);},key:index=>keys()[index]?.slice(prefix.length)??null,get length(){return keys().length},clear:()=>keys().forEach(key=>{try{original.removeItem(key);}catch{}memory.delete(key);})};Object.defineProperty(window,name,{value:storage});}
window.__lifespinnerDeviceLanguages=['en-US'];
const localFetch=window.fetch.bind(window);window.fetch=async(input,options)=>{const url=typeof input==='string'?input:input?.url??String(input);return url.startsWith('blob:')||url.startsWith('data:')?localFetch(input,options):new Response('',{status:503,statusText:'Offline translation review'});};
document.addEventListener('click',event=>{if(event.target instanceof Element&&event.target.closest('.share-float,.share-app-control,[href="#studio"]')){event.preventDefault();event.stopImmediatePropagation();}},true);
`;
const assets=`let css=${JSON.stringify(css)};for(const asset of ${JSON.stringify(images)}){const bytes=Uint8Array.from(atob(asset.data),c=>c.charCodeAt(0));const url=URL.createObjectURL(new Blob([bytes],{type:'image/webp'}));globalThis.__randomAssetUrls??={};globalThis.__randomAssetUrls[asset.path]=url;globalThis.__randomAssetUrls['./'+asset.path]=url;css=css.split('./'+asset.path).join(url).split(asset.path).join(url);}const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);`;
const safe=text=>text.replace(/<\/script/gi,'<\\/script');
await mkdir(directory,{recursive:true});
await writeFile(resolve(directory,'LifeSpinner-Translations.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src blob: data:; font-src blob: data:; connect-src 'none'; frame-src 'none'; form-action 'none'; base-uri 'none'"><meta name="review-source" content="${source}"><title>LifeSpinner — translation review</title></head><body><aside id="translation-review-note" style="position:fixed;top:2px;left:50%;transform:translateX(-50%);z-index:9999;max-width:95vw;padding:4px 10px;border-radius:9px;background:#fff3cc;color:#483520;font:11px sans-serif;text-align:center;pointer-events:none">UI translation draft · Catalog content uses English · Offline review · Sharing/Studio unavailable</aside><div id="root"></div><script>${safe(boot)}</script><script>${safe(assets)}</script><script>${safe(js)}</script></body></html>`);
console.log('Built review-only standalone HTML:',resolve(directory,'LifeSpinner-Translations.html'));
