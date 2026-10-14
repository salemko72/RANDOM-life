import { expect, it } from 'vitest';
import { zipSync, strToU8 } from 'fflate';
import { demoItems } from '@random/shared';
import { readContentPackage } from '../apps/studio/src/content-package';
import { repairContentPackage } from '../apps/studio/src/structural-repair';
const png = new Uint8Array(33); png.set([137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82]);
function raw() { const value = structuredClone(demoItems.find(item => item.category === 'EAT')!) as any; value.image.path='/media/image.png'; return value; }
const bundle = (value: unknown, extra = {}) => zipSync({'content.json':strToU8(typeof value === 'string' ? value : JSON.stringify(value)), 'image.png':png,...extra});
it('repairs safe representations, keeps facts and resets trust', () => {
 const value=raw(); const names=value.ingredients.map((i:any)=>i.name); value.category='eat'; value.servings=String(value.servings);value.ingredients[0].quantity=String(value.ingredients[0].quantity);delete value.factsVerified;delete value.image.rightsConfirmed;delete value.allergensVerified;
 value.translations.ENG=value.translations.en;delete value.translations.en;value.translations['bs-BA']=value.translations.bs;delete value.translations.bs;delete value.translations.ENG.sourceLabel;value.translations.ENG.extra='ignored';
 const bytes=bundle(value); expect(()=>readContentPackage(bytes)).toThrow(); const result=repairContentPackage(bytes);
 expect(result.input.category).toBe('EAT');expect(result.input.factsVerified).toBe(false);expect(result.input.image.rightsConfirmed).toBe(false);expect(result.input.translations!.en!.reviewed).toBe(false);expect(result.reviewFlags?.length).toBeGreaterThan(0);expect(JSON.parse(result.originalJson!)).toEqual(value);
 if(result.input.category==='EAT') {expect(result.input.ingredients.map(i=>i.name)).toEqual(names);expect(result.input.ingredients[0].quantity).toBe(Number(value.ingredients[0].quantity));expect(result.input.allergensVerified).toBe(false);}
});
it('unwraps only a single JSON fence without evaluating or double parsing',()=>{
 expect(repairContentPackage(bundle('\uFEFF```json\n'+JSON.stringify(raw())+'\n```')).input.category).toBe('EAT');
 expect(()=>repairContentPackage(bundle(JSON.stringify(JSON.stringify(raw()))))).toThrow('JSON object');
 expect(()=>repairContentPackage(bundle('```json\n{}\n```\ntext'))).toThrow('valid UTF-8 JSON');
});
it('never invents missing ingredients, quantities, source or translations',()=>{
 for(const field of ['ingredients','source','translations']) {const value=raw();delete value[field];expect(()=>repairContentPackage(bundle(value))).toThrow();}
 const value=raw();delete value.ingredients[0].quantity;expect(()=>repairContentPackage(bundle(value))).toThrow('quantity');
});
it('keeps ZIP safety and image validation identical during repair',()=>{
 expect(()=>repairContentPackage(bundle(raw(),{'../escape.txt':strToU8('bad')}))).toThrow('safe root');
 expect(()=>repairContentPackage(bundle(raw(),{'image.png':strToU8('bad')}))).toThrow('binary format');
 const value=raw();value.image.path='/media/wrong.png';expect(()=>repairContentPackage(bundle(value))).toThrow('must match');
});
it('moves a long duration description without losing any supplied statement',()=>{
 const value=structuredClone(demoItems.find(item=>item.category==='BOOK')!) as any;
 Object.assign(value,{category:'watch',format:'film',year:'2020',durationLabel:'100 minutes with an additional detailed discussion of the original production and its context.',platform:'Cinema'});value.image.path='/media/image.png';
 for(const t of Object.values(value.translations) as any[]) t.durationLabel=value.durationLabel;
 const original=value.durationLabel;const result=repairContentPackage(bundle(value));if(result.input.category!=='WATCH')throw Error();expect(result.input.durationLabel).toBe('100 minutes');expect(result.input.summary).toContain(original);expect(result.input.translations!.en!.summary).toContain(original);
 value.durationLabel='A lengthy descriptive statement about this series without any explicitly supplied runtime at all.';expect(()=>repairContentPackage(bundle(value))).toThrow('durationLabel');
});
