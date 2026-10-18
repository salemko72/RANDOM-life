import React,{useEffect,useState} from 'react';
import type {ContentInput,Locale} from '@random/shared';
import {readPreviewImage} from './preview-store';
import {onlinePutImage,optimizeImage} from './online-store';
import placeholderAsset from '../../client/src/web/assets/reading.png';

function assetUrl(){const embedded=(globalThis as typeof globalThis&{__randomAssetUrls?:Record<string,string>}).__randomAssetUrls;return embedded?.[placeholderAsset]??placeholderAsset;}
const TEMPLATE_PATH='/media/book-placeholder-template.webp';
export async function bookPlaceholderFile(custom?:File){
 if(custom){if(!['image/png','image/jpeg','image/webp','image/avif'].includes(custom.type))throw new Error('Choose PNG, JPG, WebP or AVIF.');const blob=await optimizeImage(custom);await onlinePutImage(TEMPLATE_PATH,blob);return new File([blob],'book-placeholder.webp',{type:'image/webp'});}
 const template=await readPreviewImage(TEMPLATE_PATH);if(template)return new File([template],'book-placeholder.webp',{type:template.type});
 const response=await fetch(assetUrl());if(!response.ok)throw new Error('Placeholder image is unavailable.');return new File([await response.blob()],'book-placeholder.png',{type:'image/png'});
}
export default function BookPlaceholderOption({input,preview,locale,busy,onUse}:{input:ContentInput;preview:boolean;locale:Locale;busy:boolean;onUse:(file?:File)=>void}){
 const [checked,setChecked]=useState<{path:string;missing:boolean}|null>(null);
 const [templateUrl,setTemplateUrl]=useState<string|null>(null);
 useEffect(()=>{let active=true;const path=input.image.path;
  void(async()=>{let bitmap:ImageBitmap|undefined;let missing=true;try{let blob:Blob|null=null;if(preview)blob=await readPreviewImage(path);else{const response=await fetch(path);if(response.ok)blob=await response.blob();}if(blob){bitmap=await createImageBitmap(blob);missing=false;}}catch{}finally{bitmap?.close();if(active)setChecked({path,missing});}})();return()=>{active=false;};
 },[input.image.path,preview]);
 useEffect(()=>{if(!checked?.missing)return;let active=true,owned:string|undefined;readPreviewImage(TEMPLATE_PATH).then(blob=>{if(blob&&active){owned=URL.createObjectURL(blob);setTemplateUrl(owned);}}).catch(()=>{});return()=>{active=false;if(owned)URL.revokeObjectURL(owned);setTemplateUrl(null);};},[checked?.path,checked?.missing]);
 if(input.category!=='BOOK'||checked?.path!==input.image.path||!checked.missing)return null;
 const en=locale==='en';
 return <section className="book-placeholder-option" aria-label={en?'Missing book cover':'Nedostaje naslovnica knjige'}><img src={templateUrl??assetUrl()} alt={en?'Generic book illustration':'Generička ilustracija knjiga'}/><div><h3>{en?'Would you like to use a placeholder?':'Želiš li postaviti placeholder?'}</h3><p>{en?'This book has no available cover image. Use a generic book illustration until you find the original cover.':'Ova knjiga nema dostupnu naslovnicu. Možeš postaviti generičku ilustraciju knjiga dok ne pronađeš originalnu naslovnicu.'}</p><button type="button" className="quiet" disabled={busy} onClick={()=>onUse()}>{en?'Use placeholder':'Postavi placeholder'}</button><label>{en?'Choose your standard placeholder image':'Izaberi svoju standardnu placeholder sliku'}<input type="file" accept="image/png,image/jpeg,image/webp,image/avif" disabled={busy||!preview} onChange={e=>{const file=e.target.files?.[0];e.target.value='';if(file)onUse(file);}}/></label><small>{en?'Your chosen image is remembered in D1 for future missing covers. The current book still needs review and publishing.':'Odabrana slika se pamti u D1 za naredne knjige bez naslovnice. Trenutnu knjigu i dalje treba provjeriti i objaviti.'}</small></div></section>;
}
