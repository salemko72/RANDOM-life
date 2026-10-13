import {localizeContent,type Locale} from '@random/shared';
import {demoCatalog} from './bilingualCatalog';
import {valueLabel} from './ui-language';
import {previewCatalog} from './catalog';
import {watchCatalog} from './watch';
import {activityCatalog} from './activities';
export type Companion={id:string;title:string;subtitle:string;category:'BOOK'|'WATCH'|'MOVE'|'GO';targetId?:string};
const otherWorks:Record<string,string[]>={
 'Yuval Noah Harari':['Homo Deus','21 Lessons for the 21st Century'],
 'Thomas Mann':['Buddenbrooks','Der Zauberberg','Der Tod in Venedig'],
 'Fjodor Dostojevski':['Zločin i kazna','Braća Karamazovi','Idiot'],
 'Miljenko Jergović':['Sarajevo Marlboro','Rod','Inšallah, Madona, inšallah'],
 'Danilo Kiš':['Grobnica za Borisa Davidoviča','Enciklopedija mrtvih','Rani jadi']
};
function sourceCompanionItems(item:{category:string;id:string;authors?:string[];genres?:string[]}):Companion[]{
 if(item.category==='BOOK'){
  const book=previewCatalog.find(candidate=>candidate.id===item.id&&candidate.category==='BOOK');
  const authors=item.authors??(book?.category==='BOOK'?book.authors:[]);
  return authors.flatMap(author=>(otherWorks[author]??[]).filter(title=>title!==book?.title).map((title,index)=>({id:`other-work-${author}-${index}`,title,subtitle:`${author} · drugo djelo; izdanje nije specificirano`,category:'BOOK' as const})));
 }
 if(item.category==='WATCH'){
  const current=watchCatalog.find(candidate=>candidate.id===item.id);
  const genres=item.genres??current?.genres??[];
  const matches=watchCatalog.filter(candidate=>candidate.id!==item.id&&candidate.genres.some(genre=>genres.includes(genre))).map(candidate=>({id:candidate.id,targetId:candidate.id,title:candidate.title,subtitle:`${candidate.format} · ${candidate.genres.join(', ')}`,category:'WATCH' as const}));
  if(matches.length)return matches;
  // Bibliographic-style metadata only: these are not catalog or availability entries.
  if(current&&genres.includes('Drama'))return [
   {id:'related-the-crown',title:'The Crown',subtitle:'Serija · Drama · lični izazovi i odgovornost',category:'WATCH'},
   {id:'related-unorthodox',title:'Unorthodox',subtitle:'Miniserija · Drama · identitet i samostalnost',category:'WATCH'}
  ];
  return [];
 }
 if(item.category==='MOVE'||item.category==='GO'){
  const current=activityCatalog.find(candidate=>candidate.id===item.id&&candidate.category===item.category);
  if(!current)return [];
  return activityCatalog.filter(candidate=>candidate.category===item.category&&candidate.id!==item.id&&(item.category==='GO'||candidate.subtype===current.subtype)).map(candidate=>({id:candidate.id,targetId:candidate.id,title:candidate.title,subtitle:item.category==='MOVE'?`${candidate.durationMinutes} min · ${candidate.subtype}`:candidate.summary,category:candidate.category}));
 }
 return [];
}

const englishWorks:Record<string,string>={
 'Der Zauberberg':'The Magic Mountain','Der Tod in Venedig':'Death in Venice',
 'Zločin i kazna':'Crime and Punishment','Braća Karamazovi':'The Brothers Karamazov','Idiot':'The Idiot',
 'Grobnica za Borisa Davidoviča':'A Tomb for Boris Davidovich','Enciklopedija mrtvih':'The Encyclopedia of the Dead','Rani jadi':'Early Sorrows'
};
const bhsWorks:Record<string,string>={'21 Lessons for the 21st Century':'21 lekcija za 21. stoljeće','Der Zauberberg':'Čarobni brijeg','Der Tod in Venedig':'Smrt u Veneciji'};
/** Match source genres and author names before applying display translations. */
export function companionItems(item:{category:string;id:string;authors?:string[];genres?:string[]},locale:Locale='bs'):Companion[]{
 return sourceCompanionItems(item).map(companion=>{
  const source=demoCatalog.find(record=>record.id===companion.targetId);
  if(source){const display=localizeContent(source,locale);return {...companion,title:display.title,subtitle:display.category==='WATCH'?`${valueLabel(display.format,locale)} · ${display.genres.join(', ')}`:display.category==='MOVE'?`${display.durationMinutes} min · ${valueLabel(display.subtype,locale)}`:display.summary};}
  const author=companion.id.startsWith('other-work-')?companion.subtitle.split(' · ')[0]:null;
  return {...companion,title:(locale==='en'?englishWorks:bhsWorks)[companion.title]??companion.title,
   subtitle:author?`${author} · ${locale==='en'?'another work; edition not specified':'drugo djelo; izdanje nije specificirano'}`:
    companion.id==='related-the-crown'?(locale==='en'?'Series · Drama · personal challenges and responsibility':'Serija · Drama · lični izazovi i odgovornost'):
    companion.id==='related-unorthodox'?(locale==='en'?'Miniseries · Drama · identity and independence':'Miniserija · Drama · identitet i samostalnost'):companion.subtitle};
 });
}
