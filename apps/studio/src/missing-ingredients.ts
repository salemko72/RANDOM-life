import {resolveIngredient, type ContentInput} from '@random/shared';
export type MissingIngredient = {key:string;name:string;recipes:string[];firstSeen:string;lastSeen:string};
export function ingredientKey(name:string){return name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('bs').trim().replace(/\s+/g,' ');}
export function collectMissing(previous:MissingIngredient[], input:ContentInput, now=new Date().toISOString()):MissingIngredient[]{
 const map=new Map(previous.map(entry=>[entry.key,{...entry,recipes:[...entry.recipes]}]));
 if(input.category==='EAT')for(const ingredient of input.ingredients){
  if(resolveIngredient(ingredient.name,ingredient.tag))continue;
  const key=ingredientKey(ingredient.name);const old=map.get(key);
  map.set(key,{key,name:old?.name??ingredient.name,recipes:[...new Set([...(old?.recipes??[]),input.title])],firstSeen:old?.firstSeen??now,lastSeen:now});
 }
 return [...map.values()].sort((a,b)=>a.name.localeCompare(b.name,'bs'));
}
export function unresolvedIngredients(entries:MissingIngredient[]){return entries.filter(entry=>!resolveIngredient(entry.name));}
export function missingAtlasPrompt(entries:MissingIngredient[]){return `Napravi originalne uredničke ilustracije sastojaka za RANDOM life. Svaki sastojak u zasebnoj kvadratnoj ćeliji jednake veličine, bez teksta, na toploj svijetloj pozadini, u stilu postojećeg atlasa. Zadrži tačan redoslijed; ne zamjenjuj sličnim namirnicama. Popis (${entries.length}):\n`+entries.map((e,i)=>`${i+1}. ${e.name}`).join('\n')+'\nOvo je novi atlas; postojeće tagove i koordinate ne mijenjaj. Nakon generisanja potrebna je provjera i uvezivanje novih tagova u aplikaciju.';}
