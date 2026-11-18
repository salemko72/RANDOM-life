/** One existing native-allowlisted key, including the explicit automatic choice. */
export const LANGUAGE_PREFERENCE_KEY='random-life.locale.v1';
export function sanitizeLanguageTags(input:unknown):string[]{
 if(!Array.isArray(input))return [];
 const result:string[]=[];
 for(const raw of input.slice(0,20)){
  if(typeof raw!=='string'||raw.length>100)continue;
  const tag=raw.replace(/_/g,'-');
  if(!/^[a-z]{2,8}(?:-[a-z0-9]{1,8})*$/i.test(tag))continue;
  if(!result.some(value=>value.toLowerCase()===tag.toLowerCase()))result.push(tag);
 }
 return result;
}
export function chooseSupportedLocale<L extends string>(tags:readonly string[],available:readonly L[],fallback:L):L{
 if(!available.length)throw new RangeError('At least one reviewed locale is required');
 for(const tag of sanitizeLanguageTags(tags)){
  const normalized=tag.toLowerCase();
  const exact=available.find(value=>value.toLowerCase()===normalized);
  if(exact)return exact;
  const family=normalized.split('-')[0];
  const match=available.find(value=>value.toLowerCase().split('-')[0]===family)
   ??(['bs','hr','sr','sh'].includes(family)?available.find(value=>value==='bs'):undefined);
  if(match)return match;
 }
 return available.includes(fallback)?fallback:available[0];
}
export function readLanguagePreference<L extends string>(storage:{getItem:(key:string)=>string|null},available:readonly L[]):L|'auto'{
 try{const value=storage.getItem(LANGUAGE_PREFERENCE_KEY);return available.find(locale=>locale===value)??'auto';}catch{return 'auto';}
}
