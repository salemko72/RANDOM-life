import {extension126Ingredients} from './ingredient-atlas-extension-126';
import {extension50Ingredients} from './ingredient-atlas-extension-50';
import {extensionIngredients} from './ingredient-atlas-extension';
export interface IngredientDefinition{id:string;name:string;aliases:string[];row:number;column:number;atlas?:'extension-74'|'extension-50'|`extension-126-${number}`;gridSize?:4|10;englishName?:string}
// Ordered 10×10 atlas contract. Append a new atlas/version rather than reordering cells.
const rows=[
 ['potato|Krompir|krumpir,krompiri','onion|Luk|crni luk','garlic|Bijeli luk|češnjak,beli luk','carrot|Mrkva|šargarepa,mrkve','tomato|Paradajz|rajčica,paradajzi','cucumber|Krastavac|krastavci','bell-pepper|Paprika|crvena paprika,babura','zucchini|Tikvica|tikvice','eggplant|Patlidžan|patlidžani','broccoli|Brokula|brokoli'],
 ['cauliflower|Karfiol|cvjetača','cabbage|Kupus|glavica kupusa','spinach|Špinat|spanać','lettuce|Zelena salata|salata','mushrooms|Gljive|šampinjoni,pečurke','peas|Grašak|grašak u zrnu','green-beans|Mahune|boranija','celery|Celer|stabljika celera','leek|Prasa|poriluk,praziluk','beetroot|Cvekla|cikla'],
 ['radish|Rotkvica|rotkvice','pumpkin|Bundeva|tikva','sweet-potato|Batat|slatki krompir','corn|Kukuruz|kukuruz u klipu','asparagus|Šparoge|asparagus','fennel|Komorač|koromač','red-onion|Crveni luk|ljubičasti luk','spring-onion|Mladi luk|zeleni luk','green-chili|Zeleni čili|zelena ljuta paprika','red-chili|Crveni čili|crvena ljuta paprika'],
 ['apple|Jabuka|jabuke','pear|Kruška|kruške','banana|Banana|banane','lemon|Limun|limunov sok','lime|Limeta|limete','orange|Narandža|naranča','strawberry|Jagoda|jagode','blueberry|Borovnica|borovnice','raspberry|Malina|maline','grapes|Grožđe|grozdje'],
 ['peach|Breskva|breskve','apricot|Kajsija|marelica','plum|Šljiva|šljive','cherry|Trešnja|trešnje','watermelon|Lubenica|lubenice','pineapple|Ananas|ananas','mango|Mango|mango','avocado|Avokado|avokado','pomegranate|Nar|šipak,nar','fig|Smokva|smokve'],
 ['red-lentils|Crvena leća|crveno sočivo','green-lentils|Zelena leća|zeleno sočivo','chickpeas|Slanutak|leblebije,naut','white-beans|Bijeli grah|bijeli pasulj','kidney-beans|Crveni grah|crveni pasulj','black-beans|Crni grah|crni pasulj','rice|Riža|pirinač','pasta|Tjestenina|testenina,pasta','oats|Zob|zobene pahuljice,ovsene pahuljice','wheat-flour|Brašno|pšenično brašno'],
 ['butter|Maslac|puter','milk|Mlijeko|mleko','yogurt|Jogurt|jogurt','cream|Vrhnje|pavlaka,slatko vrhnje','feta|Feta|feta sir','parmesan|Parmezan|parmigiano','mozzarella|Mozzarella|mocarela','cheddar|Cheddar|čedar','egg|Jaje|jaja','olive-oil|Maslinovo ulje|maslinovo ulje'],
 ['sunflower-oil|Suncokretovo ulje|suncokretovo ulje','tomato-paste|Paradajz pire|koncentrat paradajza,pasirana rajčica','honey|Med|med','sugar|Šećer|bijeli šećer','salt|So|sol','black-pepper|Crni biber|biber,papar','paprika-spice|Mljevena paprika|slatka mljevena paprika','cumin|Kumin|cumin','turmeric|Kurkuma|turmeric','cinnamon|Cimet|cimet u štapiću'],
 ['parsley|Peršun|peršin','basil|Bosiljak|basil','oregano|Origano|oregano','thyme|Timijan|majčina dušica','rosemary|Ružmarin|ruzmarin','bay-leaf|Lovor|lovorov list','dill|Kopar|mirođija','mint|Menta|nana,metvica','ginger|Đumbir|djumbir','sesame|Susam|sezam'],
 ['chicken-breast|Pileća prsa|pileći file,piletina','ground-beef|Mljevena junetina|mljeveno meso,mljevena govedina','breadcrumbs|Prezle|krušne mrvice,prezla','salmon|Losos|file lososa','tuna|Tuna|tunjevina','shrimp|Škampi|kozice,račići','almonds|Bademi|badem','walnuts|Orasi|orah','hazelnuts|Lješnjaci|lješnjak','water|Voda|voda']
];
export const ingredientDefinitions:IngredientDefinition[]=rows.flatMap((row,r)=>row.map((value,c)=>{const[id,name,aliases]=value.split('|');return{id,name,aliases:[name,id,...aliases.split(',')],row:r,column:c};}));
ingredientDefinitions.push(...extensionIngredients.map(i=>({...i,aliases:[...i.aliases,i.id]})));
ingredientDefinitions.push(...extension50Ingredients.map(i=>({...i,aliases:[...i.aliases,i.id]})));
// These aliases share artwork only. Recipe names, preparation notes, allergens and
// dietary assessments remain untouched; never infer medical suitability from an icon.
const artworkAliases:Record<string,string[]>={
 'black-pepper':['Biber za kuhanje','Biber za salatu','Papar za kuhanje','Papar za salatu','Black pepper','Pepper for cooking','Pepper for salad','Black pepper for cooking','Black pepper for salad'],
 'wheat-flour':['Brašno za paniranje','Brašno za pohovanje','Flour','Wheat flour','Flour for coating','Flour for breading','Flour for dredging'],
 'red-chili':['Čili','Chili','Chilli'],
 'shrimp':['Kozice, sačuvati ljuske','Shrimp, reserve shells','Prawns, reserve shells'],
 'salt':['Krupna dimljena morska so','Morska so','Morska sol','Morska so u listićima','Sea salt','Flaky sea salt','Coarse smoked sea salt','Salt'],
 'lemon':['Limun za čišćenje artičoka','Lemon for cleaning artichokes','Lemon'],
 'extension-50-016':['Masline','Olives'],
 'milk':['Mlijeko za paniranje','Mlijeko za smjesu','Milk','Milk for breading','Milk for coating','Milk for the mixture','Milk for mixture'],
 'orange':['Narandža za sok','Naranča za sok','Orange for juice','Orange'],
 'extension-50-001':['Suho bijelo vino','Suvo belo vino','Dry white wine'],
 'tuna':['Tuna u ulju, ocijeđena','Tunjevina u ulju, ocijeđena','Tuna in oil, drained','Drained tuna in oil'],
 'tomato':['Velike zrele rajčice','Veliki zreli paradajz','Large ripe tomatoes','Tomatoes','Tomato'],
};
for(const [id,aliases]of Object.entries(artworkAliases)){
 const entry=ingredientDefinitions.find(i=>i.id===id);
 if(!entry)throw Error('Missing artwork alias target: '+id);
 entry.aliases.push(...aliases);
}
ingredientDefinitions.push(...extension126Ingredients.map(i=>({...i,aliases:[...i.aliases,i.id]})));
const normalize=(name:string)=>name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/\s+/g,' ');
export function resolveIngredient(name:string,tag?:string):IngredientDefinition|undefined{
 if(tag){const tagged=ingredientDefinitions.find(i=>i.id===tag);if(tagged)return tagged;}
 const key=normalize(name);
 const lookup=(value:string)=>ingredientDefinitions.find(i=>i.aliases.some(a=>normalize(a)===value));
 const exact=lookup(key);if(exact)return exact;
 // Strip only a known use, then require an exact known food name. Never strip
 // qualifiers such as gluten-free, smoked, almond, fish, or lactose-free.
 const base=key.replace(/\s+(?:za (?:kuhanje|pecenje|salatu|paniranje|pohovanje|smjesu|smesu|tijesto|testo|marinadu|posluzivanje)|for (?:cooking|baking|salad|coating|breading|dredging|the mixture|mixture|dough|marinade|serving))$/,'');
 return base!==key?lookup(base):undefined;
}
export function tagIngredients<T extends {category:string;ingredients?:{name:string;tag?:string}[]}>(content:T):T{
 if(content.category!=='EAT'||!content.ingredients)return content;
 return {...content,ingredients:content.ingredients.map(i=>{const match=resolveIngredient(i.name,i.tag);return match?{...i,tag:match.id}:{...i};})};
}
