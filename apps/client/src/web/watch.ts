import type {ActivityRecord} from './activities';
import type {ContentRecord} from '@random/shared';
export type WatchRecord = Extract<ContentRecord,{category:'WATCH'}>;
export type PreviewRecord = ContentRecord | WatchRecord | ActivityRecord;
// Local demo only. No streaming integration, availability lookup or D1 publication.
const common={category:'WATCH' as const,status:'published' as const,version:1,updatedAt:'2026-10-13T00:00:00Z',approvedBy:'preview-fixture',approvedAt:'2026-10-13T00:00:00Z',language:'bs',factsVerified:true,tags:[],platform:'Netflix' as const};
function watch(id:string,title:string,format:'Film'|'Serija',year:number,durationLabel:string,genres:string[],summary:string,recommendationReason:string,wiki:string):WatchRecord{
 return {...common,id,title,format,year,durationLabel,genres,summary,recommendationReason,source:{url:`https://en.wikipedia.org/wiki/${wiki}`,label:'Provizorna Netflix demo preporuka',checkedAt:'2026-10-13',rightsNote:'Originalna generisana ilustracija; nije službeni poster. Regionalna dostupnost nije provjerena.'},image:{path:`/media/${id}.png`,alt:`Originalna demo ilustracija atmosfere: ${title}`,generated:true,rightsConfirmed:true}};
}
export const watchCatalog:WatchRecord[]=[
 watch('watch-enola','Enola Holmes','Film',2020,'123 min',['Misterija','Avantura'],'Mladu detektivku potraga za majkom vodi kroz zagonetke viktorijanske Engleske.','Za laganu filmsku večer uz misteriju i malo avanture.','Enola_Holmes_(film)'),
 watch('watch-adam','The Adam Project','Film',2022,'106 min',['Sci-fi','Avantura'],'Pilot putuje kroz vrijeme i udružuje se sa svojim mlađim ja.','Za večer u kojoj želiš zabavnu naučnu fantastiku i porodičnu priču.','The_Adam_Project'),
 watch('watch-dark','Dark','Serija',2017,'Epizode',['Misterija','Sci-fi'],'Nestanak djece otvara zagonetku koja povezuje porodice i različita vremena.','Ako voliš pažljivo pratiti tragove i složene priče.','Dark_(TV_series)'),
 watch('watch-wednesday','Wednesday','Serija',2022,'Epizode',['Misterija','Fantazija'],'Wednesday Addams istražuje neobične događaje u svojoj novoj školi.','Za stilizovanu misteriju, suhi humor i pomalo gotičku atmosferu.','Wednesday_(TV_series)'),
 watch('watch-queens','The Queen’s Gambit','Serija',2020,'Miniserija',['Drama','Šah'],'Mlada šahistkinja gradi svoj put prema vrhu uz lične izazove i snažnu ambiciju.','Za zaokruženu dramu o talentu, disciplini i cijeni uspjeha.','The_Queen%27s_Gambit_(miniseries)')
];
export function selectWatch(excludeIds:string[],random=Math.random()):WatchRecord|null{
 const eligible=watchCatalog.filter(r=>!excludeIds.includes(r.id));
 if(!eligible.length)return null;
 return eligible[Math.floor(Math.min(.999999999,Math.max(0,random))*eligible.length)];
}
