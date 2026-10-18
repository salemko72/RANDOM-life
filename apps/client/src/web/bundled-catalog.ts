/// <reference path="./image-assets.d.ts" />
import {onlineCatalog} from '../../../studio/src/online-store';
import {reserveItems,reserveMetadata} from './backup/catalog';
import {bundledImageFiles} from './backup/images';
import {CatalogFailover} from './catalog-failover';

const catalog=new CatalogFailover(reserveItems,()=>{
 if(typeof navigator!=='undefined'&&navigator.onLine===false)return Promise.reject(Error('CATALOG_NETWORK'));
 return onlineCatalog(false,{timeoutMs:3500,retries:0});
});
export const readConsumerCatalog=(force=false)=>catalog.load(force);
export const consumerCatalogStatus=()=>catalog.status;
export {reserveMetadata};
export function hasBundledImage(path:string){return Object.prototype.hasOwnProperty.call(bundledImageFiles,path);}
export async function readBundledImage(path:string):Promise<Blob|null>{
 const asset=bundledImageFiles[path];if(!asset)return null;
 const embedded=(globalThis as typeof globalThis&{__randomAssetUrls?:Record<string,string>}).__randomAssetUrls;
 const url=embedded?.[asset]??embedded?.[asset.replace(/^\.\//,'')]??asset;
 try{const response=await fetch(url,{cache:'force-cache'});if(response.ok&&(response.headers.get('content-type')??'').startsWith('image/'))return response.blob();}catch{}
 return null;
}
