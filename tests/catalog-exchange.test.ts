import {describe,it,expect,vi,beforeEach} from 'vitest';
import {zipSync,strToU8} from 'fflate';
import {demoItems,type ContentRecord} from '@random/shared';
const local=vi.hoisted(()=>({items:[] as ContentRecord[],media:new Map<string,Blob>()}));
vi.mock('../apps/studio/src/preview-store',()=>({readStudioCatalog:async()=>local.items,readPreviewImage:async(p:string)=>local.media.get(p)??null}));
vi.mock('../apps/studio/src/online-store',()=>({onlineCatalog:async()=>local.items}));
import {buildCatalogImportPlan,prepareCatalogImport} from '../apps/studio/src/catalog-exchange';
const row=()=>({...structuredClone(demoItems[0]),id:'one',version:4,status:'published',updatedAt:'2026-10-14T00:00:00Z',approvedAt:'2026-10-14T00:00:00Z',approvedBy:'human'}) as ContentRecord;
const json=(items:ContentRecord[],media:unknown[]=[])=>strToU8(JSON.stringify({format:'RANDOM-catalog-v2',exportedAt:'2026-10-14',items,media}));
beforeEach(()=>{local.items=[];local.media.clear();});
describe('catalog merge review',()=>{
 it('retains identical published records and does not delete omitted records',()=>{const original=row(),other={...row(),id:'two',title:'Other'};const plan=buildCatalogImportPlan([original],[original,other]);expect(plan.counts).toEqual({add:0,update:0,unchanged:1,conflicts:0});expect(plan.records[0]).toEqual(original);expect(plan.snapshot).toHaveLength(2);});
 it('translation edits preserve IDs and invalidate publication approvals',()=>{const original=row(),edited=structuredClone(original);edited.translations!.en!.title='Corrected translation';const plan=buildCatalogImportPlan([edited],[original]);expect(plan.counts.update).toBe(1);expect(plan.records[0]).toMatchObject({id:'one',status:'review',version:4,factsVerified:false,approvedBy:null,approvedAt:null});expect(plan.records[0].translations!.en!.reviewed).toBe(false);expect(plan.changes[0].flags.length).toBeGreaterThan(0);expect(original.status).toBe('published');});
 it('detects stale versions, category changes and collisions rather than overwriting',()=>{const original=row();expect(buildCatalogImportPlan([{...original,version:3}],[original]).counts.conflicts).toBe(1);expect(buildCatalogImportPlan([{...original,id:'new'}],[original]).counts.conflicts).toBe(1);});
 it('adds stable new IDs under review',()=>{const plan=buildCatalogImportPlan([row()],[]);expect(plan.counts.add).toBe(1);expect(plan.records[0].id).toBe('one');expect(plan.records[0].status).toBe('review');});
 it('rejects duplicate IDs, duplicate content, invalid fields and missing versions',()=>{expect(()=>buildCatalogImportPlan([row(),row()],[])).toThrow('duplicate IDs');expect(()=>buildCatalogImportPlan([row(),{...row(),id:'two'}],[])).toThrow('duplicate content');expect(()=>buildCatalogImportPlan([{...row(),version:undefined} as any],[])).toThrow('version');expect(()=>buildCatalogImportPlan([{...row(),title:''}],[])).toThrow();});
});
describe('bounded catalog input',()=>{
 it('imports JSON metadata without inventing absent images',async()=>{const plan=await prepareCatalogImport(json([row()]),'json');expect(plan.counts.add).toBe(1);expect(plan.media).toEqual([]);});
 it('rejects invalid UTF-8, malformed envelopes and oversized JSON',async()=>{await expect(prepareCatalogImport(new Uint8Array([255]),'json')).rejects.toThrow('UTF-8');await expect(prepareCatalogImport(strToU8('{}'),'json')).rejects.toThrow('RANDOM-catalog-v2');await expect(prepareCatalogImport(new Uint8Array(15*1024*1024+1),'json')).rejects.toThrow('15 MB');});
 it.each(['../escape.webp','/media/000001.webp','media/../escape.webp','media\\000001.webp','other.json'])('rejects ZIP traversal and unexpected entry %s',async name=>{await expect(prepareCatalogImport(zipSync({'catalog.json':json([row()]),[name]:strToU8('bad')}),'zip')).rejects.toThrow();});
 it('rejects absent listed images, unlisted images and incorrect signatures',async()=>{const asset={path:'/media/a.png',file:'media/000001.png',mime:'image/png'};await expect(prepareCatalogImport(zipSync({'catalog.json':json([row()],[asset])}),'zip')).rejects.toThrow('missing');await expect(prepareCatalogImport(zipSync({'catalog.json':json([row()]),'media/000001.png':strToU8('bad')}),'zip')).rejects.toThrow('unlisted');await expect(prepareCatalogImport(zipSync({'catalog.json':json([row()],[asset]),'media/000001.png':strToU8('<html>')}),'zip')).rejects.toThrow('Image bytes');});
 it('checks central expanded sizes before decompression',async()=>{await expect(prepareCatalogImport(zipSync({'catalog.json':json([row()]),'media/000001.png':new Uint8Array(15*1024*1024+1)}),'zip')).rejects.toThrow('Expanded');});
});
it('preserves unchanged image bytes and sends replacement bytes for the same path to review',async()=>{
 const original=row();original.image.path='/media/a.png';local.items=[original];const png=new Uint8Array(33);png.set([137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82]);png[19]=1;png[23]=1;local.media.set('/media/a.png',new Blob([png],{type:'image/png'}));
 const asset={path:'/media/a.png',file:'media/000001.png',mime:'image/png'};const bundle=(b:Uint8Array)=>zipSync({'catalog.json':json([original],[asset]),'media/000001.png':b});
 expect((await prepareCatalogImport(bundle(png),'zip')).counts.unchanged).toBe(1);
 const changed=png.slice();changed[32]=1;const plan=await prepareCatalogImport(bundle(changed),'zip');expect(plan.counts.update).toBe(1);expect(plan.records[0].status).toBe('review');expect(new Uint8Array(await plan.media[0].blob.arrayBuffer())).toEqual(changed);
});
