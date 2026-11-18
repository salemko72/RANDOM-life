import{mkdir,readFile,writeFile}from'node:fs/promises';import{resolve}from'node:path';import sharp from'sharp';
/** Read public existing artwork for the standalone review; no generation or upload. */
export async function reviewCatalogAssets(records){
 const reserve=JSON.parse(await readFile('apps/client/src/web/backup/catalog.json','utf8')).items;
 const bundled=new Set(reserve.map(record=>record.image.path));
 const paths=[...new Set(records.map(record=>record.image.path))].filter(path=>!path.startsWith('/media/generic-')&&!bundled.has(path));
 const cache=resolve('/tmp/lifespinner-review-artwork-cache');await mkdir(cache,{recursive:true});const output=[];
 for(let offset=0;offset<paths.length;offset+=4)await Promise.all(paths.slice(offset,offset+4).map(async path=>{
  if(!/^\/media\/[a-zA-Z0-9_-]+\.(?:avif|webp|png|jpe?g|svg)$/.test(path))throw Error('INVALID_REVIEW_IMAGE');
  const local=resolve(cache,path.split('/').pop()+'.webp');let bytes;
  try{bytes=await readFile(local);}catch{const response=await fetch('https://random-life-preview.pages.dev'+path);if(!response.ok||!response.headers.get('content-type')?.startsWith('image/'))throw Error('REVIEW_IMAGE_HTTP_'+response.status+' '+path);const source=Buffer.from(await response.arrayBuffer());if(source.length>20*1024*1024)throw Error('REVIEW_IMAGE_TOO_LARGE');bytes=await sharp(source).resize({width:1000,height:1000,fit:'inside',withoutEnlargement:true}).webp({quality:74,effort:4}).toBuffer();await writeFile(local,bytes);}
  output.push({path,data:bytes.toString('base64')});
 }));
 return output.sort((a,b)=>a.path.localeCompare(b.path));
}
