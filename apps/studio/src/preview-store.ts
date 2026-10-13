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
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>{opening=undefined;reject(new Error('Lokalno čuvanje nije dostupno u ovom pregledniku.'));};
  });
}
export async function readPreviewCatalog(): Promise<ContentRecord[]> {
  const db=await database();
  return new Promise((resolve,reject)=>{const request=db.transaction('content').objectStore('content').getAll();request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});
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
      const parsed=contentSchema.safeParse(body);if(!parsed.success){fail('JSON nije validan: '+parsed.error.issues.map(i=>`${i.path.join('.')}: ${i.message}`).join('; '));return;}
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
      const row=found.result as (ContentRecord & {dedupKey:string})|undefined;
      if(!row){fail('Stavka nije pronađena.');return;}
      if(version!==row.version){fail('Stavka je promijenjena u drugom tabu. Učitaj novu verziju.');return;}
      let item:ContentRecord={...row,version:row.version+1,updatedAt:new Date().toISOString(),approvedAt:null,approvedBy:null};
      if(!match[2] && method==='PUT') {
        const parsed=contentSchema.safeParse(body);if(!parsed.success){fail('JSON ne odgovara ugovoru sadržaja.');return;}
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
