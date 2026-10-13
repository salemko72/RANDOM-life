/** Browser-only demo preferences. This identifier is not an authenticated account. */
export type UiCategory = 'EAT'|'READ'|'WATCH'|'MOVE'|'GO';
export interface PreferenceItem {
 id:string; category:string; title:string; status:string; tags?:readonly string[];
 genres?:readonly string[]; allergens?:readonly string[]; allergensVerified?:boolean;
 dietaryTags?:readonly string[]; totalMinutes?:number; durationMinutes?:number;
 intensity?:string; company?:string|readonly string[];
}
export type SignalKind='exposure'|'open'|'save'|'accept'|'skip';
export interface PreferenceEvent {itemId:string;category:UiCategory;topics:string[];kind:SignalKind;at:number}
export interface Profile {
 version:1;id:string;name:string;onboarded:boolean;interests:UiCategory[];topics:string[];
 allergens:string[];intolerances:string[];intoleranceNote:string;completedIds:string[];vegetarian:boolean;maxCookingMinutes:number|null;freeMinutes:number|null;
 energy:'low'|'medium'|'high';company:'solo'|'pair'|'friends';learning:boolean;events:PreferenceEvent[];
}
const STORAGE_KEY='random-life.local-profile.v1';
const categories:UiCategory[]=['EAT','READ','WATCH','MOVE','GO'];
const kinds:SignalKind[]=['exposure','open','save','accept','skip'];
const normalize=(value:string)=>value.trim().toLocaleLowerCase();
const category=(value:string):UiCategory|null=>value==='BOOK'?'READ':categories.includes(value as UiCategory)?value as UiCategory:null;
const finiteMinutes=(value:unknown):value is number=>typeof value==='number'&&Number.isFinite(value)&&value>0;
const strings=(value:unknown):value is string[]=>Array.isArray(value)&&value.length<=100&&value.every(v=>typeof v==='string'&&v.length<=200);
export function createProfile():Profile {
 return {version:1,id:globalThis.crypto?.randomUUID?.()??`local-${Date.now()}-${Math.random().toString(36).slice(2)}`,name:'',onboarded:false,interests:[],topics:[],allergens:[],intolerances:[],intoleranceNote:'',completedIds:[],vegetarian:false,maxCookingMinutes:null,freeMinutes:null,energy:'medium',company:'solo',learning:true,events:[]};
}
function validEvent(value:unknown):value is PreferenceEvent {
 if(!value||typeof value!=='object')return false;
 const e=value as PreferenceEvent;
 return typeof e.itemId==='string'&&e.itemId.length<=200&&categories.includes(e.category)&&strings(e.topics)&&kinds.includes(e.kind)&&typeof e.at==='number'&&Number.isFinite(e.at)&&e.at>=0;
}
function validated(value:unknown):Profile|null {
 if(!value||typeof value!=='object')return null;
 const p={intolerances:[],intoleranceNote:'',completedIds:[],...value} as unknown as Profile;
 if(p.version!==1||typeof p.id!=='string'||!p.id||p.id.length>200||typeof p.name!=='string'||p.name.length>200||typeof p.onboarded!=='boolean'||!strings(p.interests)||!p.interests.every(c=>categories.includes(c))||!strings(p.topics)||!strings(p.allergens)||!strings(p.intolerances)||!p.intolerances.every(t=>['gluten','lactose'].includes(t))||typeof p.intoleranceNote!=='string'||p.intoleranceNote.length>1000||!Array.isArray(p.completedIds)||!p.completedIds.every(id=>typeof id==='string'&&id.length>0&&id.length<=200)||typeof p.vegetarian!=='boolean'||!(p.maxCookingMinutes===null||finiteMinutes(p.maxCookingMinutes))||!(p.freeMinutes===null||finiteMinutes(p.freeMinutes))||!['low','medium','high'].includes(p.energy)||!['solo','pair','friends'].includes(p.company)||typeof p.learning!=='boolean'||!Array.isArray(p.events)||!p.events.every(validEvent))return null;
 // Rebuild known fields; never retain arbitrary data from local storage.
 return {version:1,id:p.id,name:p.name,onboarded:p.onboarded,interests:[...new Set(p.interests)],topics:[...p.topics],allergens:[...p.allergens],intolerances:[...new Set(p.intolerances)],intoleranceNote:p.intoleranceNote,completedIds:[...new Set(p.completedIds)].slice(-1000),vegetarian:p.vegetarian,maxCookingMinutes:p.maxCookingMinutes,freeMinutes:p.freeMinutes,energy:p.energy,company:p.company,learning:p.learning,events:p.events.slice(-300).map(e=>({itemId:e.itemId,category:e.category,topics:[...e.topics],kind:e.kind,at:e.at}))};
}
export function loadProfile(storage?:Storage):Profile {
 try {const raw=(storage??globalThis.localStorage)?.getItem(STORAGE_KEY);return raw?validated(JSON.parse(raw))??createProfile():createProfile();}catch{return createProfile();}
}
export function saveProfile(profile:Profile,storage?:Storage):boolean {
 try {const clean=validated(profile);if(!clean)return false;const target=storage??globalThis.localStorage;if(!target)return false;target.setItem(STORAGE_KEY,JSON.stringify(clean));return true;}catch{return false;}
}
export function preferenceTopics(item:PreferenceItem):string[] {
 return [...new Set([...(item.tags??[]),...(item.genres??[])].map(normalize).filter(Boolean))].slice(0,100);
}
export function recordSignal(profile:Profile,item:PreferenceItem,kind:SignalKind):Profile {
 const c=category(item.category);if(!profile.learning||!c)return profile;
 return {...profile,events:[...profile.events,{itemId:item.id,category:c,topics:preferenceTopics(item),kind,at:Date.now()}].slice(-300)};
}
export function eligibleForProfile(item:PreferenceItem,profile:Profile):boolean {
 if(profile.completedIds.includes(item.id))return false;
 if(item.status!=='published'||!category(item.category))return false;
 if(item.category!=='EAT')return true;
 if(profile.allergens.length&&(!item.allergensVerified||!Array.isArray(item.allergens)||item.allergens.some(a=>profile.allergens.map(normalize).includes(normalize(a)))))return false;
 const diet=(item.dietaryTags??[]).map(normalize);
 if(profile.intolerances.includes('gluten')&&!diet.includes('gluten-free'))return false;
 if(profile.intolerances.includes('lactose')&&!diet.includes('lactose-free'))return false;
 if(profile.vegetarian&&!(item.dietaryTags??[]).some(t=>['vegetarian','vegan'].includes(normalize(t))))return false;
 if(profile.maxCookingMinutes!==null&&(!finiteMinutes(item.totalMinutes)||item.totalMinutes>profile.maxCookingMinutes))return false;
 return true;
}
const signalWeight:Record<SignalKind,number>={exposure:0,open:.35,save:1,accept:1.5,skip:-.7};
export function scorePreference(item:PreferenceItem,profile:Profile):number {
 const c=category(item.category),topics=preferenceTopics(item);
 let score=1+(c&&profile.interests.includes(c)?2:0);
 score+=Math.min(3,topics.filter(t=>profile.topics.map(normalize).includes(t)).length*1.5);
 if(item.intensity===profile.energy)score+=.75;
 if(typeof item.company==='string'?item.company===profile.company:item.company?.includes(profile.company))score+=.75;
 const minutes=item.totalMinutes??item.durationMinutes;
 if(profile.freeMinutes!==null&&finiteMinutes(minutes))score+=minutes<=profile.freeMinutes?.75:-.5;
 if(profile.learning){
  let learned=0;
  for(const e of profile.events){
   const similarity=e.itemId===item.id?1:e.topics.some(t=>topics.includes(normalize(t)))?.5:e.category===c?.15:0;
   learned+=signalWeight[e.kind]*similarity;
  }
  score+=Math.max(-.8,Math.min(3,learned));
 }
 return Math.max(.2,score);
}
function weighted<T>(items:T[],weight:(item:T)=>number,random:number):T|null {
 if(!items.length)return null;
 const sample=Number.isFinite(random)?Math.max(0,Math.min(1-Number.EPSILON,random)):0;
 let remaining=sample*items.reduce((sum,item)=>sum+weight(item),0);
 for(const item of items){remaining-=weight(item);if(remaining<0)return item;}
 return items[items.length-1];
}
export function selectPersonalized<T extends PreferenceItem>(items:T[],profile:Profile,excludeIds:string[],random=Math.random()):T|null {
 return weighted(items.filter(item=>eligibleForProfile(item,profile)&&!excludeIds.includes(item.id)),item=>scorePreference(item,profile),random);
}
export function choosePersonalizedCategory(items:PreferenceItem[],profile:Profile,previous?:UiCategory,random=Math.random()):UiCategory|null {
 const eligible=items.filter(item=>eligibleForProfile(item,profile));
 const available=categories.filter(c=>eligible.some(item=>category(item.category)===c));
 const others=available.filter(c=>c!==previous);
 return weighted(others.length?others:available,c=>{const pool=eligible.filter(item=>category(item.category)===c);return pool.reduce((sum,item)=>sum+scorePreference(item,profile),0)/pool.length},random);
}
export function explainPreference(item:PreferenceItem,profile:Profile):string {
 if(!eligibleForProfile(item,profile))return 'Ne odgovara tvojim obaveznim ograničenjima.';
 if(preferenceTopics(item).some(t=>profile.topics.map(normalize).includes(t)))return 'Tema odgovara tvojim odabranim interesima.';
 if(profile.interests.includes(category(item.category)!))return 'Iz kategorije koju voliš, uz malo iznenađenja.';
 return 'Nešto drugačije među dostupnim prijedlozima.';
}

/** Explicit completion is independent of consent to learn from behavioral signals. */
export function toggleCompleted(profile:Profile,itemId:string):Profile {
 if(!itemId||itemId.length>200)return profile;
 const completedIds=profile.completedIds.includes(itemId)?profile.completedIds.filter(id=>id!==itemId):[...profile.completedIds,itemId].slice(-1000);
 return {...profile,completedIds};
}
