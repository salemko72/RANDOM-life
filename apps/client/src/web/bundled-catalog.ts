import {performanceEvent} from './performance';
/// <reference path="./image-assets.d.ts" />
import {PersistentCatalog,createCatalogTransport} from './consumer-catalog-cache';
import {consumerCatalogStorage} from './consumer-catalog-storage';
import {reserveItems,reserveMetadata} from './backup/catalog';
import {bundledImageFiles} from './backup/images';


const catalog=new PersistentCatalog({reserve:reserveItems,storage:consumerCatalogStorage,fetchSnapshot:createCatalogTransport(globalThis.fetch,()=>Date.now(),bytes=>performanceEvent('catalog_sync',{downloadBytes:bytes,count:1})),onUpdate:()=>{if(typeof window!=='undefined')window.dispatchEvent(new Event('random-catalog-updated'));}});
export const readConsumerCatalog=async(force=false)=>{const began=performance.now();try{const items=await catalog.load(force);performanceEvent('catalog',{durationMs:performance.now()-began,count:items.length,backup:Number(catalog.status.source==='backup'),cached:Number(catalog.status.source==='cached')});return items;}catch(error){performanceEvent('catalog',{durationMs:performance.now()-began,failed:1});throw error;}};
export const consumerCatalogStatus=()=>catalog.status;
export const consumerCatalogInfo=()=>catalog.info();
export async function clearConsumerCatalog(){await catalog.clear();return readConsumerCatalog(true);}
export {reserveMetadata};
export function hasBundledImage(path:string){return Object.prototype.hasOwnProperty.call(bundledImageFiles,path);}
export async function readBundledImage(path:string):Promise<Blob|null>{
 const asset=bundledImageFiles[path];if(!asset)return null;
 const embedded=(globalThis as typeof globalThis&{__randomAssetUrls?:Record<string,string>}).__randomAssetUrls;
 const url=embedded?.[asset]??embedded?.[asset.replace(/^\.\//,'')]??asset;
 try{const response=await fetch(url,{cache:'force-cache'});if(response.ok&&(response.headers.get('content-type')??'').startsWith('image/'))return response.blob();}catch{}
 return null;
}
