import {expect,it} from 'vitest';
import {atlasBatchManifestJson,atlasBatchPrompt,planAtlasBatches} from '../apps/studio/src/atlas-batches';
import type {MissingIngredient} from '../apps/studio/src/missing-ingredients';
const entry=(key:string):MissingIngredient=>({key,name:key,recipes:['Recipe'],firstSeen:'2026-01-01',lastSeen:'2026-01-02',names:{en:key,bs:key}});
const entries=(count:number)=>Array.from({length:count},(_,i)=>entry(`unlisted ingredient ${String(i).padStart(3,'0')}`));
it.each([[99,0,99],[100,1,0],[101,1,1],[205,2,5]])('plans %i unresolved ingredients without losing keys',(count,ready,remaining)=>{
 const result=planAtlasBatches(entries(count));expect(result.ready).toHaveLength(ready);expect(result.remaining).toHaveLength(remaining);
 expect(new Set([...result.ready.flatMap(b=>b.cells.map(c=>c.key)),...result.remaining.map(e=>e.key)]).size).toBe(count);
 for(const batch of result.ready){expect(batch.cells).toHaveLength(100);batch.cells.forEach((cell,index)=>{expect(cell.index).toBe(index);expect(cell.row).toBe(Math.floor(index/10));expect(cell.column).toBe(index%10);});}
});
it('normalizes accents and merges duplicates deterministically with language names and recipe sources',()=>{
 const a={...entry('  Čudni   prah '),name:'Čudni prah',recipes:['Z recipe'],names:{bs:'Čudni prah'}};
 const b={...entry('cudni prah'),name:'cudni prah',recipes:['A recipe'],names:{en:'Odd powder'}};
 const result=planAtlasBatches([a,b],1);expect(result).toEqual(planAtlasBatches([b,a],1));expect(result.ready[0].cells[0]).toMatchObject({key:'cudni prah',names:{en:'Odd powder',bs:'Čudni prah'},recipes:['A recipe','Z recipe']});
});
it('keeps identifiers distinct for slug collisions and stable across queue order and batching',()=>{
 const input=[entry('odd+a'),entry('odd a'),...entries(100)];const result=planAtlasBatches(input,1);
 expect(result).toEqual(planAtlasBatches([...input].reverse(),1));expect(new Set(result.ready.flatMap(b=>b.cells.map(c=>c.id))).size).toBe(102);
 const larger=planAtlasBatches(input);for(const cell of larger.ready[0].cells)expect(result.ready.flatMap(b=>b.cells).find(c=>c.key===cell.key)?.id).toBe(cell.id);
});
it('exports a pending safe JSON manifest and explicit square sheet prompt',()=>{
 const batch=planAtlasBatches([entry('odd "powder"')],1).ready[0];const manifest=JSON.parse(atlasBatchManifestJson(batch));
 expect(manifest).toMatchObject({version:1,atlasId:batch.atlasId,approved:false,status:'pending',image:null});expect(manifest.cells[0].name).toBe('odd "powder"');
 const prompt=atlasBatchPrompt(batch);expect(prompt).toContain('square 10 × 10');expect(prompt).toContain('no labels');expect(prompt).toContain('Row 1, column 1');expect(prompt).toContain('2–100');
 expect(JSON.parse(atlasBatchManifestJson(batch,'atlas.png')).approved).toBe(false);
});
it('rejects invalid sheet capacity and filters resolved ingredients',()=>{
 for(const size of [0,101,1.5])expect(()=>planAtlasBatches([],size)).toThrow(RangeError);
 expect(planAtlasBatches([entry('Luk')],1)).toEqual({ready:[],remaining:[]});
});
