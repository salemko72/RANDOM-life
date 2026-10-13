import {expect,it} from 'vitest';
import {demoItems} from '@random/shared';
import {collectMissing,unresolvedIngredients} from '../apps/studio/src/missing-ingredients';
it('accumulates unknown ingredients across recipes without duplicates or losing old requests',()=>{
 const eat=demoItems.find(i=>i.category==='EAT')!;if(eat.category!=='EAT')throw Error();
 const first=collectMissing([],{...eat,title:'Chicken Tikka masala',ingredients:[{name:'Garam masala',quantity:1,unit:'kašika'},{name:'Luk',quantity:1,unit:'komad'}]});
 expect(first.map(i=>i.name)).toEqual(['Garam masala']);
 const second=collectMissing(first,{...eat,title:'Kačamak sa sirom',ingredients:[{name:'Kukuruzna krupica',quantity:1,unit:'šolja'},{name:' garam  MASALA ',quantity:1,unit:'kašika'}]});
 expect(second).toHaveLength(2);expect(second.find(i=>i.key==='garam masala')?.recipes).toEqual(['Chicken Tikka masala','Kačamak sa sirom']);
 expect(unresolvedIngredients(second)).toHaveLength(2);
});
