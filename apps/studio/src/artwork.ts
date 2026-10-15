import type{ContentInput}from '@random/shared';
export type ArtworkCandidate={id:string;title:string;author?:string;year?:string|number;imageUrl:string;sourceUrl:string;provider:'TMDB'|'Open Library';attribution:string;exact:boolean};
export async function findArtwork(input:ContentInput):Promise<{state:string;candidates:ArtworkCandidate[];code?:string}>{
 if(input.category!=='BOOK'&&input.category!=='WATCH')return{state:'unused',candidates:[]};
 const title=input.translations?.en?.title?.trim();
 if(!title)return{state:'unavailable',candidates:[],code:'ENGLISH_TITLE_REQUIRED'};
 const q=new URLSearchParams({category:input.category,title});
 if(input.category==='BOOK')q.set('author',input.translations?.en?.authors?.[0]?.trim()??'');else{q.set('year',String(input.year));q.set('format',input.format);}
 try{const r=await fetch('/api/artwork?'+q,{signal:AbortSignal.timeout(15000)});if(!(r.headers.get('content-type')??'').includes('application/json'))return{state:'unavailable',candidates:[],code:`APP_ROUTE_HTTP_${r.status}`};const value:any=await r.json();return{state:value.state??'unavailable',candidates:Array.isArray(value.candidates)?value.candidates:[],code:value.code};}catch(error){return{state:'unavailable',candidates:[],code:error instanceof Error&&error.name==='TimeoutError'?'APP_REQUEST_TIMEOUT':'APP_REQUEST_NETWORK'};}
}
export async function downloadArtwork(candidate:ArtworkCandidate):Promise<File>{const r=await fetch('/api/artwork-image?'+new URLSearchParams({url:candidate.imageUrl}),{signal:AbortSignal.timeout(15000)});if(!r.ok){let code=`IMAGE_ROUTE_HTTP_${r.status}`;try{const body:any=await r.json();if(typeof body.error==='string'&&/^IMAGE_[A-Z0-9_]+$/.test(body.error))code=body.error;if(body.error==='IMAGE_REDIRECT_UNSUPPORTED'&&typeof body.destination==='string')code+=' · '+body.destination.slice(0,300);}catch{}throw Error(code);}const blob=await r.blob();if(!blob.type.startsWith('image/')||blob.size>15*1024*1024)throw Error('IMAGE_FORMAT_OR_SIZE');return new File([blob],'cover.jpg',{type:blob.type});}
