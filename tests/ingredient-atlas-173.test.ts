import {test,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {ingredientDefinitions,resolveIngredient,tagIngredients} from '../packages/shared/src/ingredient-tags';
const root=new URL('../content/ingredient-atlas-extension-173/',import.meta.url);
const manifest=JSON.parse(readFileSync(new URL('manifest.json',root),'utf8'));
const baseline=JSON.parse(readFileSync(new URL('legacy-baseline.json',root),'utf8'));
const fresh=()=>ingredientDefinitions.filter(x=>x.id.startsWith('extension-173-'));
test('173 new ingredients preserve source order and distinct 5x5 sheet coordinates',()=>{
 expect(fresh()).toHaveLength(173);
 for(const [index,entry]of fresh().entries()){
 const source=manifest.ingredients[index];
 expect(entry).toMatchObject({id:source.id,name:source.name,englishName:source.english,atlas:source.atlas,row:source.row,column:source.column,gridSize:5});
 expect(resolveIngredient(source.name,source.id)?.id).toBe(source.id);
 expect(resolveIngredient(source.english,source.id)?.id).toBe(source.id);
 }
 expect(new Set(fresh().map(x=>`${x.atlas}:${x.row}:${x.column}`)).size).toBe(173);
 expect(fresh().at(-1)).toMatchObject({id:'extension-173-173',atlas:'extension-173-07',row:4,column:2});
});
test('existing atlas definitions and every known alias retain their previous mapping',()=>{
 const old=ingredientDefinitions.filter(x=>!x.id.startsWith('extension-173-'));
 expect(old).toHaveLength(baseline.count);
 expect(createHash('sha256').update(JSON.stringify(old)).digest('hex')).toBe(baseline.sha256);
 for(const[name,id]of Object.entries(baseline.resolutions))expect(resolveIngredient(name)?.id,name).toBe(id);
});
test('new qualified ingredient names receive icons without altering recipe or dietary fields',()=>{
 const record={category:'EAT',allergens:['milk','soy'],dietaryTags:[],ingredients:[{name:'Čokoladno-lješnjakov namaz s mlijekom i sojom',quantity:20,unit:'g'},{name:'Zelena curry pasta s ribom i kozicama',quantity:5,unit:'g'}]};
 const result=tagIngredients(record);
 expect(result.ingredients.map(x=>(x as {tag?:string}).tag)).toEqual(['extension-173-015','extension-173-171']);
 expect(result.allergens).toEqual(record.allergens);expect(result.dietaryTags).toEqual(record.dietaryTags);
 expect(result.ingredients.map(({name,quantity,unit})=>({name,quantity,unit}))).toEqual(record.ingredients);
 expect(resolveIngredient('Unlisted gluten-free wheat ramen without eggs')).toBeUndefined();
});
