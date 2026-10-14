import {build} from 'esbuild';
import {zipSync,strToU8} from 'fflate';
import sharp from 'sharp';
import {mkdir,writeFile} from 'node:fs/promises';
const module=await build({stdin:{contents:"export {demoCatalog} from './apps/client/src/web/bilingualCatalog';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',write:false});
const {demoCatalog}=await import('data:text/javascript;base64,'+Buffer.from(module.outputFiles[0].contents).toString('base64'));
const assets='apps/client/src/web/assets/';
function source(row){
 const map={'preview-soup':['lentil-soup.png'],'potato-salad':['demo-foods.png',2,2,0,0],'swedish-meatballs':['demo-foods.png',2,2,1,0],menemen:['demo-foods.png',2,2,0,1],moussaka:['demo-foods.png',2,2,1,1]};
 if(map[row.id])return map[row.id];if(row.category==='BOOK')return ['reading.png'];
 const watch=['watch-enola','watch-adam','watch-dark','watch-wednesday','watch-queens'];const moves=['move-gym-a','move-gym-b','move-trim-a','move-trim-b','move-yoga-a','move-yoga-b'];const go=['go-cinema','go-theater','go-disco','go-cafe'];
 for(const [ids,file,rows] of [[watch,'watch-scenes.png',3],[moves,'move-scenes.png',3],[go,'go-scenes.png',2]]){const index=ids.indexOf(row.id);if(index>=0)return [file,2,rows,index%2,Math.floor(index/2)];}
 throw Error('No original illustration for '+row.id);
}
const files={},media=[],items=[];
for(const original of demoCatalog){
 const row=structuredClone(original),[file,cols,rows,col,y]=source(row);let image=sharp(assets+file,{limitInputPixels:40000000});
 if(cols){const meta=await image.metadata();const width=Math.floor(meta.width/cols),height=Math.floor(meta.height/rows);image=image.extract({left:col*width,top:y*height,width,height});}
 const bytes=await image.resize({width:1440,height:1440,fit:'inside',withoutEnlargement:true}).webp({quality:84}).toBuffer();if(bytes.length>1024*1024)throw Error('Oversized original image');
 row.image.path='/media/original-'+row.id+'.webp';row.status='review';row.approvedAt=null;row.approvedBy=null;row.factsVerified=false;row.image.rightsConfirmed=false;
 for(const t of Object.values(row.translations??{}))t.reviewed=false;if(row.category==='EAT'){row.allergensVerified=false;if(row.phosphateAssessment)row.phosphateAssessment.reviewed=false;}
 const name='media/'+String(media.length+1).padStart(6,'0')+'.webp';media.push({path:row.image.path,file:name,mime:'image/webp'});files[name]=bytes;items.push(row);
}
files['catalog.json']=strToU8(JSON.stringify({format:'RANDOM-catalog-v2',exportedAt:new Date().toISOString(),items,media}));
await mkdir('apps/client/preview-site/downloads',{recursive:true});await writeFile('apps/client/preview-site/downloads/RANDOM-original-items-recovery.zip',zipSync(files));console.log('Original recovery:',items.length,JSON.stringify(items.reduce((counts,i)=>(counts[i.category]=(counts[i.category]??0)+1,counts),{})));
