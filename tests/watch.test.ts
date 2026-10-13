import {test,expect} from 'vitest';
import {watchCatalog,selectWatch} from '../apps/client/src/web/watch';
test('WATCH demo contains two films and three series, with no repeats until exhausted',()=>{
 expect(watchCatalog.filter(r=>r.format==='Film')).toHaveLength(2);
 expect(watchCatalog.filter(r=>r.format==='Serija')).toHaveLength(3);
 const seen:string[]=[];for(let n=0;n<5;n++){const r=selectWatch(seen,.5);expect(r).not.toBeNull();if(r)seen.push(r.id);}
 expect(new Set(seen).size).toBe(5);expect(selectWatch(seen)).toBeNull();
});
