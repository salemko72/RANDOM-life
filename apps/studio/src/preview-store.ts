import {draftInput,prepareTranslationBatch,legacyRecordMetadata} from './import-recovery';
import {collectMissing, type MissingIngredient} from './missing-ingredients';
import { contentSchema, publicationIssues, type ContentRecord } from '@random/shared';
const builtInMedia = new Set(['/media/lentil-soup.png','/media/reading.png','/media/demo-eat.png','/media/demo-book.png','/media/potato-salad.png','/media/swedish-meatballs.png','/media/menemen.png','/media/moussaka.png']);
let opening: Promise<IDBDatabase> | undefined;
function database() {
  return opening ??= new Promise<IDBDatabase>((resolve,reject) => {
    const request = indexedDB.open('random-editorial-preview',1);
    request.onupgradeneeded = () => {
      const items=request.result.createObjectStore('content',{keyPath:'id'});
      items.createIndex('dedup','dedupKey',{unique:true});
      request.result.createObjectStore('media');
      request.result.createObjectStore('events',{autoIncrement:true});

    };
    request.onsuccess=()=>{request.result.onversionchange=()=>{request.result.close();opening=undefined;};resolve(request.result);};
    request.onblocked=()=>{opening=undefined;reject(new Error('Zatvori druge otvorene RANDOM Studio tabove pa osvježi; lokalna biblioteka čeka nadogradnju.'));};
    request.onerror=()=>{opening=undefined;reject(new Error('Lokalno čuvanje nije dostupno u ovom pregledniku.'));};
  });
}
export async function readPreviewCatalog(): Promise<ContentRecord[]> {
  const db=await database();
  return new Promise((resolve,reject)=>{const request=db.transaction('content').objectStore('content').getAll();request.onsuccess=()=>resolve(request.result.map(legacyRecordMetadata));request.onerror=()=>reject(request.error);});
}
export async function putPreviewImage(path: string, blob: Blob) {
  const db=await database();
  return new Promise<void>((resolve,reject)=>{const tx=db.transaction('media','readwrite');tx.objectStore('media').put(blob,path);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(new Error('Slika nije sačuvana. Provjeri prostor preglednika.'));});
}
export async function readPreviewImage(path: string): Promise<Blob | null> {
  const db=await database();
  return new Promise((resolve,reject)=>{const request=db.transaction('media').objectStore('media').get(path);request.onsuccess=()=>resolve(request.result??null);request.onerror=()=>reject(request.error);});
}
export async function previewRequest(path: string, method='GET', body?:unknown, version?:number):Promise<any> {
  if(path==='/admin/content' && method==='GET') return {items:await readPreviewCatalog()};
  const db=await database();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(['content','media','events'],'readwrite');const content=tx.objectStore('content');
    let answer:unknown;let failure:Error|undefined;
    const fail=(message:string)=>{failure=new Error(message);tx.abort();};
    const finish=(item:ContentRecord,action:string,dedupKey:string)=>{
      content.put({...item,dedupKey});tx.objectStore('events').add({item,action,at:new Date().toISOString()});answer={item};
    };
    tx.oncomplete=()=>{window.dispatchEvent(new Event('random-content-updated'));resolve(answer);};
    tx.onabort=()=>reject(failure??new Error('Izmjena nije sačuvana. Provjeri duplikat ili lokalni prostor.'));
    if(path==='/admin/content' && method==='POST') {
      const parsed=(()=>{try{return {success:true as const,data:draftInput(body)}}catch(error){return {success:false as const,error:{issues:[{path:[] as string[],message:String(error)}]}}}})();if(!parsed.success){fail('JSON nije validan: '+parsed.error.issues.map(i=>`${i.path.join('.')}: ${i.message}`).join('; '));return;}
      const data=parsed.data;const dedupKey=`${data.category}|${data.source.url}|${data.title.trim().toLowerCase()}`;
      const existing=content.index('dedup').get(dedupKey);
      existing.onsuccess=()=>{
        if(existing.result){answer={item:existing.result,duplicate:true};return;}
        const now=new Date().toISOString();const item:ContentRecord={...data,id:crypto.randomUUID(),status:'draft',version:1,updatedAt:now,approvedAt:null,approvedBy:null};finish(item,'import',dedupKey);
      };return;
    }
    const match=path.match(/^\/admin\/content\/([^/]+)(?:\/(review|publish|unpublish))?$/);
    if(!match){fail('Putanja nije podržana u previewu.');return;}
    const found=content.get(match[1]);found.onsuccess=()=>{
      const row=found.result?legacyRecordMetadata(found.result) as (ContentRecord & {dedupKey:string}):undefined;
      if(!row){fail('Stavka nije pronađena.');return;}
      if(version!==row.version){fail('Stavka je promijenjena u drugom tabu. Učitaj novu verziju.');return;}
      let item:ContentRecord={...row,version:row.version+1,updatedAt:new Date().toISOString(),approvedAt:null,approvedBy:null};
      if(!match[2] && method==='PUT') {
        const parsed=(()=>{try{return {success:true as const,data:draftInput(body)}}catch(error){return {success:false as const,error:{issues:[{path:[] as string[],message:String(error)}]}}}})();if(!parsed.success){fail(parsed.error.issues.map(i=>`${i.path.join('.')}: ${i.message}`).join('; '));return;}
        if(parsed.data.category!==row.category){fail('Kategorija se ne može mijenjati.');return;}
        item={...item,...parsed.data,status:'draft'};finish(item,'edit',`${item.category}|${item.source.url}|${item.title.trim().toLowerCase()}`);return;
      }
      if(method!=='POST'){fail('Metoda nije podržana.');return;}
      if(match[2]==='publish') {
        if(row.status!=='review'){fail('Prvo pošalji stavku na pregled.');return;}
        const issues=publicationIssues(row);if(issues.length){fail(issues.join(' '));return;}
        const publish=()=>{item.status='published';item.approvedBy='local-preview-editor';item.approvedAt=new Date().toISOString();finish(item,'publish',row.dedupKey);};
        if(builtInMedia.has(row.image.path)){publish();return;}
        const media=tx.objectStore('media').get(row.image.path);media.onsuccess=()=>{if(!media.result){fail('Prvo dodaj sliku. Lokalni asset nije pronađen.');return;}publish();};
      } else {item.status=match[2]==='review'?'review':'draft';finish(item,match[2]??'edit',row.dedupKey);}
    };
  });
}

let ingredientOpening:Promise<IDBDatabase>|undefined;
function ingredientDatabase(){return ingredientOpening??=new Promise<IDBDatabase>((resolve,reject)=>{const r=indexedDB.open('random-ingredient-illustrations',1);r.onupgradeneeded=()=>r.result.createObjectStore('missing-ingredients',{keyPath:'key'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>{ingredientOpening=undefined;reject(new Error('Lista ilustracija nije dostupna u lokalnoj pohrani.'));};});}
export async function readMissingIngredients():Promise<MissingIngredient[]> {
 const db=await ingredientDatabase();return new Promise((resolve,reject)=>{const r=db.transaction('missing-ingredients').objectStore('missing-ingredients').getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
}
export async function rememberMissingIngredients(input:import('@random/shared').ContentInput):Promise<MissingIngredient[]> {
 const db=await ingredientDatabase();return new Promise((resolve,reject)=>{const tx=db.transaction('missing-ingredients','readwrite'),store=tx.objectStore('missing-ingredients');let result:MissingIngredient[]=[];const r=store.getAll();r.onsuccess=()=>{result=collectMissing(r.result,input);for(const entry of result)store.put(entry);};tx.oncomplete=()=>resolve(result);tx.onabort=()=>reject(new Error('Lista nedostajućih ilustracija nije sačuvana.'));});
}
export async function readPreviewRevisions():Promise<ContentRecord[]> {
 const db=await database();return new Promise((resolve,reject)=>{const r=db.transaction('events').objectStore('events').getAll();r.onsuccess=()=>{const unique=new Map<string,ContentRecord>();for(const event of r.result){if(event.item?.title)unique.set(`${event.item.category}|${event.item.source?.url}|${event.item.title}`,event.item);}resolve([...unique.values()].reverse());};r.onerror=()=>reject(r.error);});
}

export async function applyPreviewTranslationBatch(raw:unknown){
 const db=await database();return new Promise<number>((resolve,reject)=>{
  const tx=db.transaction(['content','events'],'readwrite'),store=tx.objectStore('content');let failure:unknown;let count=0;
  tx.onabort=()=>reject(failure??new Error('Batch was not saved.'));tx.onerror=()=>{failure=tx.error;};
  tx.oncomplete=()=>{window.dispatchEvent(new Event('random-content-updated'));resolve(count);};
  const request=store.getAll();request.onsuccess=()=>{try{
   const changes=prepareTranslationBatch(raw,request.result);count=changes.length;
   for(const change of changes){const original=request.result.find((r:any)=>r.id===change.id);const item={...original,...change.input,status:'draft',version:change.version+1,updatedAt:new Date().toISOString(),approvedBy:null,approvedAt:null};store.put(item);tx.objectStore('events').add({item,action:'translation-batch',at:item.updatedAt});}
  }catch(error){failure=error;tx.abort();}};
 });
}

export async function importPreviewPackage(input: unknown, blob: Blob): Promise<ContentRecord> {
  const data=draftInput(input),db=await database();
  const dedupKey=`${data.category}|${data.source.url}|${data.title.trim().toLowerCase()}`;
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(['content','media','events'],'readwrite'),store=tx.objectStore('content');
    let item:ContentRecord;let failure:Error|undefined;
    const existing=store.index('dedup').get(dedupKey);
    existing.onsuccess=()=>{
      if(existing.result){failure=new Error('This item already exists. Open it in the library to edit; ZIP import never overwrites it.');tx.abort();return;}
      item={...data,id:crypto.randomUUID(),status:'draft',version:1,updatedAt:new Date().toISOString(),approvedAt:null,approvedBy:null};
      tx.objectStore('media').put(blob,data.image.path);store.add({...item,dedupKey});tx.objectStore('events').add({item,action:'zip-import',at:item.updatedAt});
    };
    tx.oncomplete=()=>{window.dispatchEvent(new Event('random-content-updated'));resolve(item);};
    tx.onabort=()=>reject(failure??new Error('ZIP import could not be saved. No existing item was changed.'));
  });
}

export async function restorePreviewBackup(raw:unknown):Promise<{added:number;skipped:number}>{
 const data=raw as {format?:string;items?:unknown[]};
 if(data?.format!=='RANDOM-content-backup-v1'||!Array.isArray(data.items)||data.items.length>10000)throw Error('Choose a RANDOM-content-backup-v1 JSON backup.');
 const ids=new Set<string>();
 const rows=data.items.map(value=>{const original=value as ContentRecord;if(typeof original.id!=='string'||!original.id||ids.has(original.id))throw Error('Backup contains missing or duplicate IDs.');ids.add(original.id);const input=draftInput(original);return {...input,id:original.id,status:'draft' as const,version:Number.isInteger(original.version)&&original.version>0?original.version:1,updatedAt:new Date().toISOString(),approvedAt:null,approvedBy:null,factsVerified:false,image:{...input.image,rightsConfirmed:false},translations:Object.fromEntries(Object.entries(input.translations??{}).map(([code,t])=>[code,{...t,reviewed:false}])),...(input.category==='EAT'?{allergensVerified:false,phosphateAssessment:input.phosphateAssessment?{...input.phosphateAssessment,reviewed:false}:undefined}:{})};});
 const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction(['content','events'],'readwrite'),store=tx.objectStore('content');let added=0,skipped=0;
 for(const row of rows){const lookup=store.get(row.id);lookup.onsuccess=()=>{if(lookup.result){skipped++;return;}const dedupKey=`${row.category}|${row.source.url}|${row.title.trim().toLowerCase()}`;const duplicate=store.index('dedup').get(dedupKey);duplicate.onsuccess=()=>{if(duplicate.result){skipped++;return;}store.add({...row,dedupKey});tx.objectStore('events').add({item:row,action:'backup-restore',at:row.updatedAt});added++;};};}
 tx.oncomplete=()=>{window.dispatchEvent(new Event('random-content-updated'));resolve({added,skipped});};tx.onabort=()=>reject(Error('Backup could not be restored. Existing library unchanged.'));});
}
