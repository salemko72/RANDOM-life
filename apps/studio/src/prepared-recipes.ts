import{readContentPackage}from'./content-package';
import{readPreviewCatalog,putPreviewImage,submitPreviewContent}from'./preview-store';
const MARKER='random-life.prepared-recipes.middle-east-2026-10-14';
let running:Promise<{added:number;skipped:number}>|undefined;
export function importPreparedRecipes(){return running??=perform().finally(()=>{running=undefined;});}
async function perform(){
 try{if(localStorage.getItem(MARKER)==='done')return{added:0,skipped:0};}catch{}
 const r=await fetch('/downloads/recipes/manifest.json');if(!r.ok)return{added:0,skipped:0};const manifest:any=await r.json();
 if(manifest.batch!=='middle-east-2026-10-14'||!Array.isArray(manifest.files)||manifest.files.length!==10||manifest.files.some((f:unknown)=>typeof f!=='string'||!/^RANDOM-[a-z0-9-]+\.zip$/.test(f)))throw Error('Prepared recipe package is invalid.');
 const rows=await readPreviewCatalog();const keys=new Set(rows.map(i=>`${i.category}|${i.source.url}|${i.title.trim().toLowerCase()}`));let added=0,skipped=0;
 for(const name of manifest.files){const response=await fetch('/downloads/recipes/'+name);if(!response.ok)throw Error('Prepared recipes could not be downloaded. Existing content is preserved.');const buffer=await response.arrayBuffer();if(buffer.byteLength>25*1024*1024)throw Error('Prepared package is too large.');const pack=readContentPackage(new Uint8Array(buffer));const input=pack.input;const key=`${input.category}|${input.source.url}|${input.title.trim().toLowerCase()}`;if(keys.has(key)){skipped++;continue;}
  const bytes=new Uint8Array(pack.image.bytes),blob=new Blob([bytes],{type:pack.image.mime});const image=await createImageBitmap(blob);try{if(image.width*image.height>40000000||Math.max(image.width,image.height)>1440)throw Error('Prepared image exceeds optimization limits.');}finally{image.close();}
  input.image.path='/media/prepared-'+crypto.randomUUID()+'.webp';input.factsVerified=false;input.image.rightsConfirmed=false;if(input.category==='EAT')input.allergensVerified=false;
  await putPreviewImage(input.image.path,blob);const result=await submitPreviewContent(input);if(result.duplicate)skipped++;else added++;keys.add(key);
 }
 try{localStorage.setItem(MARKER,'done');}catch{}
 return{added,skipped};
}
