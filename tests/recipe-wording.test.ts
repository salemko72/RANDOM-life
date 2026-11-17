import {test,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {reserveItems} from '../apps/client/src/web/backup/catalog';
import {applyRecipeWording,recipeWordingCorrections} from '../apps/client/src/web/recipe-wording';
import {publicationIssues} from '@random/shared';
const patch=JSON.parse(readFileSync('content/recipe-wording-2026-11-17/text-patch.json','utf8'));
const oldReserve=JSON.parse(readFileSync('tests/fixtures/recipe-wording-before.json','utf8'));
function text(r:any){return{summary:r.summary,steps:r.steps,translations:Object.fromEntries(['en','bs'].map(l=>[l,{summary:r.translations[l].summary,steps:r.translations[l].steps}]))};}
function protectedContent(r:any){const c=structuredClone(r);delete c.summary;delete c.steps;for(const l of ['en','bs']){delete c.translations[l].summary;delete c.translations[l].steps;}return c;}
test('bundled offline recipes contain the new bilingual text without changing safety data',()=>{
 const changed=reserveItems.filter(r=>patch.items.some((p:any)=>p.id===r.id));expect(changed).toHaveLength(8);
 for(const row of changed){const p=patch.items.find((p:any)=>p.id===row.id),before=oldReserve.find((r:any)=>r.id===row.id);expect(text(row)).toEqual(p.after);expect(protectedContent(row)).toEqual(protectedContent(before));expect(publicationIssues(row)).toEqual([]);}
});
test('all 17 known old online or cached records receive bounded text corrections',()=>{
 expect(recipeWordingCorrections).toHaveLength(17);
 for(const p of recipeWordingCorrections){const original=oldReserve.find((r:any)=>r.id===p.id)??{id:p.id,category:'EAT',version:p.expectedVersion,...p.before};const result=applyRecipeWording(original);expect(text(result)).toEqual(p.after);expect(protectedContent(result)).toEqual(protectedContent(original));}
});
test('newer editorial records are preserved even if they retain old phrases',()=>{
 const old=oldReserve.find((r:any)=>r.id===recipeWordingCorrections[0].id)??{id:recipeWordingCorrections[0].id,category:'EAT',...recipeWordingCorrections[0].before};old.version=recipeWordingCorrections[0].expectedVersion+1;expect(applyRecipeWording(old)).toBe(old);
});
test('same-version text mismatches and unrelated categories are not overwritten',()=>{
 const p=recipeWordingCorrections[0];const altered={id:p.id,category:'EAT',version:p.expectedVersion,...p.before,summary:'A different editorial description'};expect(applyRecipeWording(altered as any)).toBe(altered);
 const book={...altered,category:'BOOK'};expect(applyRecipeWording(book as any)).toBe(book);
});
test('already corrected records are idempotent and source data is never mutated',()=>{
 const p=recipeWordingCorrections[0];const old={id:p.id,category:'EAT',version:p.expectedVersion,...structuredClone(p.before)};const copy=structuredClone(old);const result=applyRecipeWording(old as any);expect(old).toEqual(copy);expect(applyRecipeWording(result)).toBe(result);
});
