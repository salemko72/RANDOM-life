import {test,expect} from 'vitest';
import {previewCatalog} from '../apps/client/src/web/catalog';
import {contentSchema,selectRecommendation} from '@random/shared';
test('demo offers five distinct choices per active category before exhausting the pool',()=>{
 for(const category of ['EAT','BOOK'] as const){
 const seen:string[]=[];
 for(let i=0;i<5;i++){const item=selectRecommendation(previewCatalog,{category,excludeIds:seen},()=>0);expect(item).not.toBeNull();expect(item).toBeDefined();if(!item)throw Error('Pool exhausted early');contentSchema.parse(item);seen.push(item.id);}
 expect(new Set(seen).size).toBe(5);
 }
});
