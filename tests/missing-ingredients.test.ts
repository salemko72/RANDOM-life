import {expect,it} from 'vitest';
import {demoItems} from '@random/shared';
import {collectMissing,unresolvedIngredients} from '../apps/studio/src/missing-ingredients';
it('accumulates unknown ingredients across recipes without duplicates or losing old requests',()=>{
 const eat=demoItems.find(i=>i.category==='EAT')!;if(eat.category!=='EAT')throw Error();
 const first=collectMissing([],{...eat,title:'Chicken Tikka masala',ingredients:[{name:'Ras el hanout',quantity:1,unit:'kašika'},{name:'Luk',quantity:1,unit:'komad'}]});
 expect(first.map(i=>i.name)).toEqual(['Ras el hanout']);
 const second=collectMissing(first,{...eat,title:'Kačamak sa sirom',ingredients:[{name:'Kukuruzna krupica',quantity:1,unit:'šolja'},{name:' ras  EL HANOUT ',quantity:1,unit:'kašika'}]});
 expect(second).toHaveLength(2);expect(second.find(i=>i.key==='ras el hanout')?.recipes).toEqual(['Chicken Tikka masala','Kačamak sa sirom']);
 expect(unresolvedIngredients(second)).toHaveLength(2);
});

it('removes resolved extension ingredients from the missing list without erasing history',()=>{
 const entries=[{key:'tahini',name:'Tahini',recipes:['Hummus'],firstSeen:'2026-10-14',lastSeen:'2026-10-14'}];
 expect(unresolvedIngredients(entries)).toEqual([]);expect(entries).toHaveLength(1);
});
