import {describe,it,expect} from 'vitest';
import {demoItems,publicationIssues} from '@random/shared';
import {inspectImport,recoverImport,draftInput,prepareTranslationBatch,batchTranslationPrompt} from './import-recovery';
const recipe=demoItems.find(i=>i.category==='EAT')!;
const row={...recipe,id:'existing-recipe',version:4,status:'published' as const,updatedAt:'2026-10-13',approvedAt:null,approvedBy:null};
describe('Studio import recovery',()=>{
 it('reports syntax and precise translation paths without hiding raw review flags',()=>{
  expect(inspectImport('{').errors[0]).toMatch(/^JSON:/);
  const raw={...recipe,factsVerified:true,translations:{en:{title:'English'}}};const result=inspectImport(JSON.stringify(raw));
  expect(result.raw.factsVerified).toBe(true);expect(result.errors.some(e=>e.startsWith('translations.en.summary:'))).toBe(true);
 });
 it('repairs only metadata and preserves source, image and recipe facts',()=>{
  const raw:any=structuredClone(recipe);delete raw.factsVerified;delete raw.allergensVerified;
  raw.translations={en:{title:'English',unexpected:'value'}};
  const result=recoverImport(raw);expect(result.data.factsVerified).toBe(false);expect(result.data.allergensVerified).toBe(false);
  expect(result.data.source).toEqual(raw.source);expect(result.data.image).toEqual(raw.image);expect(result.data.ingredients).toEqual(raw.ingredients);
  expect(result.data.translations.en.sourceLabel).toBe(raw.source.label);expect(result.data.translations.en.summary).toBeUndefined();expect(result.data.translations.en.unexpected).toBeUndefined();expect(raw.translations.en.unexpected).toBe('value');
 });
 it('strips reserved persistence metadata without discarding custom source or draft fields',()=>{
  const draft:any=draftInput({...recipe,id:'injected',version:500,status:'published',updatedAt:'bad',approvedAt:'bad',approvedBy:'bad',dedupKey:'bad',revision_token:'bad',privateNote:'retain',source:{...recipe.source,custom:'retain'},image:{...recipe.image,custom:'retain'}});
  for(const key of ['id','version','status','updatedAt','approvedAt','approvedBy','dedupKey','revision_token'])expect(draft[key]).toBeUndefined();
  expect(draft.privateNote).toBe('retain');expect(draft.source.custom).toBe('retain');expect(draft.image.custom).toBe('retain');
 });
 it('retains incomplete translated work only as a draft; publication remains invalid',()=>{
  const draft=draftInput({...recipe,translations:{en:{title:'Unfinished'}}});expect(draft.translations?.en?.title).toBe('Unfinished');expect(publicationIssues(draft).length).toBeGreaterThan(0);
  expect(()=>draftInput({...recipe,servings:0})).toThrow();
 });
 it('batch keeps IDs and complete shared data and resets review approvals',()=>{
  const change=prepareTranslationBatch({items:[{id:row.id,version:4,translations:recipe.translations}]},[row])[0];
  expect(change.id).toBe(row.id);expect(change.input.image.path).toBe(row.image.path);expect(change.input.source).toEqual(row.source);
  expect(change.input.factsVerified).toBe(false);expect(change.input.translations?.en?.reviewed).toBe(false);
  expect(batchTranslationPrompt([row])).toContain(JSON.stringify([row],null,2));
 });
 it('rejects stale, duplicate, missing and invalid batch entries before returning changes',()=>{
  const entry={id:row.id,version:4,translations:recipe.translations};
  expect(()=>prepareTranslationBatch({items:[{...entry,version:3}]},[row])).toThrow(/version changed/);
  expect(()=>prepareTranslationBatch({items:[entry,entry]},[row])).toThrow(/Duplicate/);
  expect(()=>prepareTranslationBatch({items:[{...entry,id:'other'}]},[row])).toThrow(/Unknown/);
  expect(()=>prepareTranslationBatch({items:[{...entry,translations:{en:{}}}]},[row])).toThrow(/both/);
  expect(()=>prepareTranslationBatch({items:[{...entry,source:{url:'https://other.test'}}]},[row])).toThrow(/translations only/);
  const incomplete=structuredClone(entry);incomplete.translations!.en!.steps=[];
  expect(()=>prepareTranslationBatch({items:[incomplete]},[row])).toThrow(/match every original/);
 });
});
