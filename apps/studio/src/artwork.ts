import type{ContentInput}from '@random/shared';
export type ArtworkCandidate={id:string;title:string;author?:string;year?:string|number;imageUrl:string;sourceUrl:string;provider:'TMDB'|'Open Library';attribution:string;exact:boolean};
export async function findArtwork(input:ContentInput):Promise<{state:string;candidates:ArtworkCandidate[]}>{
 if(input.category!=='BOOK'&&input.category!=='WATCH')return{state:'unused',candidates:[]};
 const q=new URLSearchParams({category:input.category,title:input.translations?.en?.title??input.title});
 if(input.category==='BOOK')q.set('author',input.authors[0]??'');else{q.set('year',String(input.year));q.set('format',input.format);}
 try{const r=await fetch('/api/artwork?'+q,{signal:AbortSignal.timeout(15000)});const value:any=await r.json();return{state:value.state??'unavailable',candidates:Array.isArray(value.candidates)?value.candidates:[]};}catch{return{state:'unavailable',candidates:[]};}
}
export async function downloadArtwork(candidate:ArtworkCandidate):Promise<File>{const r=await fetch('/api/artwork-image?'+new URLSearchParams({url:candidate.imageUrl}),{signal:AbortSignal.timeout(15000)});if(!r.ok)throw Error('Cover could not be downloaded. Try again.');const blob=await r.blob();if(!blob.type.startsWith('image/')||blob.size>15*1024*1024)throw Error('Unsupported cover image.');return new File([blob],'cover.jpg',{type:blob.type});}
