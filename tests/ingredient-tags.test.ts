import{test,expect}from'vitest';import{ingredientDefinitions,resolveIngredient,tagIngredients,contentSchema,demoItems}from'@random/shared';
test('atlas has 100 unique ids and 100 unique 10x10 coordinates',()=>{const original=ingredientDefinitions.filter(i=>!i.atlas);expect(original).toHaveLength(100);expect(new Set(original.map(i=>i.id)).size).toBe(100);expect(new Set(original.map(i=>i.row+','+i.column)).size).toBe(100);for(const i of ingredientDefinitions){expect(i.row).toBeLessThan(10);expect(i.column).toBeLessThan(10);}});
test('maps cooking aliases without guessing unknown food',()=>{expect(resolveIngredient('  CRVENA LECA ')?.id).toBe('red-lentils');expect(resolveIngredient('češnjak')?.id).toBe('garlic');expect(resolveIngredient('Goveđi temeljac')).toBeUndefined();expect(resolveIngredient('custom','olive-oil')?.id).toBe('olive-oil');});
test('imported tags are validated and known names auto-tagged',()=>{const eat=demoItems.find(i=>i.category==='EAT')!;if(eat.category!=='EAT')throw Error();const tagged=tagIngredients({...eat,ingredients:[{name:'Luk',quantity:1,unit:'kom'}]});expect((tagged.ingredients[0] as {tag?:string}).tag).toBe('onion');expect(contentSchema.safeParse(tagged).success).toBe(true);expect(contentSchema.safeParse({...tagged,ingredients:[{...tagged.ingredients[0],tag:'fake-food'}]}).success).toBe(false);});

test('extension maps all 74 cells while preserving original atlas tags',()=>{
 const extension=ingredientDefinitions.filter(i=>i.atlas==='extension-74');expect(extension).toHaveLength(74);
 expect(resolveIngredient('Tahini')).toMatchObject({atlas:'extension-74',row:6,column:6});
 expect(resolveIngredient('Žumance')).toMatchObject({atlas:'extension-74',row:7,column:3});
 expect(resolveIngredient('Voda')).toMatchObject({id:'water',row:9,column:9});
 expect(resolveIngredient('Sesame oil')?.id).toBe('extension-74-051');
});
