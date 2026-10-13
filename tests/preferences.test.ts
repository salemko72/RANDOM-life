import {expect,test} from 'vitest';
import {toggleCompleted,createProfile,loadProfile,saveProfile,recordSignal,scorePreference,eligibleForProfile,selectPersonalized,choosePersonalizedCategory,preferenceTopics,type PreferenceItem} from '../apps/client/src/web/preferences';
const food=(id:string,extra:Partial<PreferenceItem>={}):PreferenceItem=>({id,category:'EAT',title:id,status:'published',tags:[],allergens:[],allergensVerified:true,dietaryTags:['vegetarian'],totalMinutes:20,...extra});
const book:PreferenceItem={id:'book',category:'BOOK',title:'Book',status:'published',tags:['History'],genres:['Science']};
const storage=()=>{const data=new Map<string,string>();return {getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v)},removeItem:(k:string)=>data.delete(k),clear:()=>data.clear(),key:(i:number)=>[...data.keys()][i]??null,get length(){return data.size}} satisfies Storage};
test('hard restrictions survive learning and empty pools never relax them',()=>{
 const p={...createProfile(),allergens:['milk'],vegetarian:true,maxCookingMinutes:30};
 for(const item of [food('milk',{allergens:['milk']}),food('unknown',{allergensVerified:false}),food('meat',{dietaryTags:[]}),food('slow',{totalMinutes:31}),food('unknown-time',{totalMinutes:undefined}),food('draft',{status:'draft'})]){
  expect(eligibleForProfile(item,p)).toBe(false);expect(selectPersonalized([item],p,[],.5)).toBeNull();
 }
 expect(eligibleForProfile(food('safe'),p)).toBe(true);
});
test('persistence remembers a valid local profile and recovers malformed values',()=>{
 const s=storage(),p={...createProfile(),name:'Demo',onboarded:true,topics:['Science']};
 expect(saveProfile(p,s)).toBe(true);expect(loadProfile(s)).toEqual(p);
 const key=s.key(0)!;s.setItem(key,'broken');expect(loadProfile(s).onboarded).toBe(false);
 s.setItem(key,JSON.stringify({...p,vegetarian:'false'}));expect(loadProfile(s).onboarded).toBe(false);
 expect(saveProfile(p,{...s,setItem:()=>{throw Error('denied')}})).toBe(false);
});
test('positive and negative feedback change fit; exposure is not positive feedback',()=>{
 const p=createProfile(),base=scorePreference(book,p);
 expect(scorePreference(book,recordSignal(p,book,'save'))).toBeGreaterThan(base);
 expect(scorePreference(book,recordSignal(p,book,'skip'))).toBeLessThan(base);
 expect(scorePreference(book,recordSignal(p,book,'exposure'))).toBe(base);
 expect(preferenceTopics(book)).toEqual(['history','science']);
});
test('consent off stops collection and learned scoring; history is capped',()=>{
 const p=createProfile();const learned=recordSignal(p,book,'accept');const off={...learned,learning:false};
 expect(recordSignal(off,book,'save')).toEqual(off);expect(scorePreference(book,off)).toBe(scorePreference(book,p));
 let many=p;for(let i=0;i<350;i++)many=recordSignal(many,book,'skip');expect(many.events).toHaveLength(300);
 expect(scorePreference(book,many)).toBeGreaterThan(0);
});
test('weighted deterministic sampling preserves diversity and exclusions',()=>{
 const p={...createProfile(),interests:['READ' as const],topics:['Science']};
 expect(choosePersonalizedCategory([food('food'),book],p,undefined,.5)).toBe('READ');
 expect(choosePersonalizedCategory([food('food'),book],p,'READ',.99)).toBe('EAT');
 expect(selectPersonalized([book,food('food')],p,[],0)?.id).toBe('book');
 expect(selectPersonalized([book,food('food')],p,[],1)?.id).toBe('food');
 expect(selectPersonalized([book],p,['book'],0)).toBeNull();
 expect(choosePersonalizedCategory([],p)).toBeNull();
});
test('context and explicit topics increase fit without turning time into a book hard filter',()=>{
 const p={...createProfile(),topics:['Science'],energy:'low' as const,company:'pair' as const,freeMinutes:30};
 const matching={...book,intensity:'low',company:'pair',durationMinutes:20};
 const other={...book,tags:[],genres:['Romance'],intensity:'high',company:'solo',durationMinutes:60};
 expect(scorePreference(matching,p)).toBeGreaterThan(scorePreference(other,p));expect(eligibleForProfile(other,p)).toBe(true);
});
test('blocked storage recovers to a new local profile',()=>{
 const denied={...storage(),getItem:()=>{throw Error('denied')}};
 expect(loadProfile(denied).version).toBe(1);expect(loadProfile(denied).onboarded).toBe(false);
});
test('reloading bounds stored history and rejects malformed event payloads',()=>{
 const s=storage(),p=recordSignal(createProfile(),book,'open');saveProfile(p,s);const key=s.key(0)!;
 s.setItem(key,JSON.stringify({...p,events:Array.from({length:400},()=>p.events[0])}));expect(loadProfile(s).events).toHaveLength(300);
 s.setItem(key,JSON.stringify({...p,events:[{...p.events[0],kind:'unknown'}]}));expect(loadProfile(s).events).toHaveLength(0);
});
test('older local profiles migrate without losing preferences',()=>{
 const s=storage(),p={...createProfile(),name:'Existing',topics:['Science']};saveProfile(p,s);const key=s.key(0)!;
 const old:Record<string,unknown>={...p};delete old.intolerances;delete old.intoleranceNote;delete old.completedIds;
 s.setItem(key,JSON.stringify(old));expect(loadProfile(s)).toEqual(p);
});
test('verified gluten and lactose dietary flags are hard requirements',()=>{
 const p={...createProfile(),intolerances:['gluten','lactose'],interests:['EAT' as const],topics:['favorite'],intoleranceNote:'Other food concern'};
 const unsafe=food('unsafe',{tags:['favorite']});
 expect(eligibleForProfile(unsafe,p)).toBe(false);expect(selectPersonalized([unsafe],recordSignal(p,unsafe,'accept'),[],0)).toBeNull();
 expect(eligibleForProfile(food('only-gluten',{dietaryTags:['gluten-free']}),p)).toBe(false);
 expect(eligibleForProfile(food('safe',{dietaryTags:['gluten-free','lactose-free']}),p)).toBe(true);
 expect(eligibleForProfile(food('note'),{...createProfile(),intoleranceNote:'Other food concern'})).toBe(true);
});
test('completed items persistently exclude exact recommendations until unmarked',()=>{
 const p=createProfile(),completed=toggleCompleted(p,book.id),s=storage();
 expect(p.completedIds).toEqual([]);expect(completed.events).toEqual([]);saveProfile(completed,s);
 expect(selectPersonalized([book],loadProfile(s),[],0)).toBeNull();
 expect(selectPersonalized([{...book,id:'another'}],completed,[],0)?.id).toBe('another');
 const restored=toggleCompleted(loadProfile(s),book.id);expect(selectPersonalized([book],restored,[],0)?.id).toBe(book.id);
});

test('low-phosphate profiles only receive explicitly reviewed low-phosphate recipes',()=>{
 const profile={...createProfile(),lowPhosphateDiet:true};
 const verified=food('verified',{dietaryTags:['low-phosphate'],phosphateAssessment:{suitability:'low',reviewed:true}});
 expect(eligibleForProfile(verified,profile)).toBe(true);
 for(const extra of [{},{dietaryTags:['low-phosphate']},{dietaryTags:['low-phosphate'],phosphateAssessment:{suitability:'low' as const,reviewed:false}},{dietaryTags:['low-phosphate'],phosphateAssessment:{suitability:'uncertain' as const,reviewed:true}}])expect(eligibleForProfile(food('excluded',extra),profile)).toBe(false);
 expect(selectPersonalized([food('unassessed')],profile,[],.5)).toBeNull();
 const s=storage();expect(saveProfile(profile,s)).toBe(true);expect(loadProfile(s).lowPhosphateDiet).toBe(true);
 const legacy={...profile};delete (legacy as Partial<typeof legacy>).lowPhosphateDiet;s.setItem(s.key(0)!,JSON.stringify(legacy));expect(loadProfile(s).lowPhosphateDiet).toBe(false);
});
