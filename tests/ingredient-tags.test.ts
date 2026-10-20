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

test('second extension adds 50 unique cells without moving the first extension',()=>{
 const fresh=ingredientDefinitions.filter(i=>i.atlas==='extension-50');expect(fresh).toHaveLength(50);expect(ingredientDefinitions.filter(i=>!i.id.startsWith('extension-173-'))).toHaveLength(350);
 expect(resolveIngredient('Filet skuše')).toMatchObject({atlas:'extension-50',row:0,column:5});
 expect(resolveIngredient('Wasabi')).toMatchObject({atlas:'extension-50',row:4,column:7});
 expect(resolveIngredient('Žumanjak')).toMatchObject({atlas:'extension-50',row:4,column:9});
 expect(resolveIngredient('Tahini')).toMatchObject({atlas:'extension-74',row:6,column:6});
 for(const entry of fresh)expect(resolveIngredient(entry.name)).toBeTruthy();
 expect(new Set(ingredientDefinitions.map(i=>i.id)).size).toBe(523);
});

test('reuses ingredient artwork for cooking purposes without changing recipe wording',()=>{
 const aliases:Record<string,string>={
 'Biber za kuhanje':'black-pepper','Biber za salatu':'black-pepper','Brašno za paniranje':'wheat-flour',
 'Čili':'red-chili','Kozice, sačuvati ljuske':'shrimp','Krupna dimljena morska so':'salt',
 'Limun za čišćenje artičoka':'lemon','Masline':'extension-50-016',
 'Mlijeko za paniranje':'milk','Mlijeko za smjesu':'milk','Morska so':'salt','Morska so u listićima':'salt',
 'Narandža za sok':'orange','Suho bijelo vino':'extension-50-001','Tuna u ulju, ocijeđena':'tuna','Velike zrele rajčice':'tomato',
 'Krompir za salatu':'potato','Maslinovo ulje za marinadu':'olive-oil','Flour for coating':'wheat-flour','Milk for the mixture':'milk','Black pepper for salad':'black-pepper'
 };
 for(const [name,id]of Object.entries(aliases))expect(resolveIngredient(name)?.id,name).toBe(id);
 const recipe=tagIngredients({category:'EAT',ingredients:[{name:'Brašno za paniranje'}]});
 expect(recipe.ingredients[0]).toMatchObject({name:'Brašno za paniranje',tag:'wheat-flour'});
 for(const name of ['Bademovo brašno za paniranje','Mlijeko bez laktoze za smjesu'])expect(resolveIngredient(name),name).toBeUndefined();
});

 test('126 new cells retain source order on eight 4x4 pages without overwriting old aliases',()=>{
 const fresh=ingredientDefinitions.filter(i=>i.atlas?.startsWith('extension-126-'));expect(fresh).toHaveLength(126);
 expect(new Set(fresh.map(i=>`${i.atlas}:${i.row}:${i.column}`)).size).toBe(126);
 for(const [index,item]of fresh.entries()){
 expect(item.id).toBe(`extension-126-${String(index+1).padStart(3,'0')}`);expect(item.gridSize).toBe(4);
 expect(item.atlas).toBe(`extension-126-${String(Math.floor(index/16)+1).padStart(2,'0')}`);
 expect(item.row).toBe(Math.floor(index%16/4));expect(item.column).toBe(index%4);
 if(index!==95)expect(resolveIngredient(item.name)).toBeTruthy();
 }
 expect(resolveIngredient('Artičoke')?.id).toBe('extension-126-001');
 expect(resolveIngredient('Cherry rajčice')?.id).toBe('extension-126-017');
 expect(resolveIngredient('Riblji temeljac')?.id).toBe('extension-126-083');
 expect(resolveIngredient('Soda bikarbona')?.id).toBe('extension-126-099');
 expect(resolveIngredient('Kim')?.id).toBe('extension-126-044');expect(resolveIngredient('Kumin')?.id).toBe('cumin');
 expect(resolveIngredient('Slatka paprika')?.id).toBe('extension-173-133');
 expect(resolveIngredient('Voda')?.id).toBe('water');expect(resolveIngredient('Masline')?.id).toBe('extension-50-016');
 });
