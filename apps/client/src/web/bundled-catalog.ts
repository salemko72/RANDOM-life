import {performanceEvent} from './performance';
/// <reference path="./image-assets.d.ts" />
import {onlineCatalog} from '../../../studio/src/online-store';
import {reserveItems,reserveMetadata} from './backup/catalog';
import {bundledImageFiles} from './backup/images';
import {CatalogFailover} from './catalog-failover';

const catalog=new CatalogFailover(reserveItems,()=>{
 if(typeof navigator!=='undefined'&&navigator.onLine===false)return Promise.reject(Error('CATALOG_NETWORK'));
 return onlineCatalog(false,{timeoutMs:3500,retries:0});
});
export const readConsumerCatalog=async(force=false)=>{const began=performance.now();try{const items=await catalog.load(force);performanceEvent('catalog',{durationMs:performance.now()-began,count:items.length,backup:Number(catalog.status.source==='backup')});return items;}catch(error){performanceEvent('catalog',{durationMs:performance.now()-began,failed:1});throw error;}};
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
