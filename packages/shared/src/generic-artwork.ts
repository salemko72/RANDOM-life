import type {ContentRecord} from './content';
const films=['film-01-popcorn','film-02-cinema','film-03-seats','film-04-filmstrip','film-05-projector'];
const series=['series-01-retro-tv','series-02-remote','series-03-lcd','series-04-sofa','series-05-evening'];
const books=['book-01-stack','book-02-library','book-03-window','book-04-reading','book-05-modern'];
export const GENERIC_ARTWORK_PATHS=[...films,...series,...books].map(k=>`/media/generic-${k}-v1.webp`);
type Identity={id:string;category:string;format?:string;year?:number};
function hash(s:string){let n=2166136261;for(let i=0;i<s.length;i++){n^=s.charCodeAt(i);n=Math.imul(n,16777619);}return n>>>0;}
export function genericArtworkPath(item:Identity,seed=0):string|null{
 let pool:string[];
 if(item.category==='BOOK')pool=books;
 else if(item.category==='WATCH'){
  const isSeries=item.format==='Serija'||item.format==='Series';
  pool=isSeries?(item.year!==undefined&&item.year<1980?[series[0],series[4]]:series):(item.year!==undefined&&item.year<1980?[films[1],films[2],films[3],films[4]]:films);
 }else return null;
 return `/media/generic-${pool[hash(item.id+':'+seed)%pool.length]}-v1.webp`;
}
export function withGenericArtwork<T extends ContentRecord>(item:T,seed=0):T{
 const path=genericArtworkPath(item,seed);if(!path)return item;
 const en='Generic original editorial illustration; not official cover or poster artwork.';
 const bs='Generička originalna urednička ilustracija; nije službeni omot ili poster.';
 return {...item,image:{path,alt:bs,rightsConfirmed:true,generated:true},translations:Object.fromEntries(Object.entries(item.translations??{}).map(([locale,t])=>[locale,{...t,imageAlt:locale==='en'?en:bs}]))} as T;
}
