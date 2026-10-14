export type Env={ASSETS:{fetch(request:Request):Promise<Response>};TMDB_READ_TOKEN?:string};
const json=(data:unknown,status=200)=>Response.json(data,{status});
const norm=(s:string)=>s.normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
export function allowedImage(value:string){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&((u.hostname==='image.tmdb.org'&&/^\/t\/p\/w780\/[^/]+\.(jpg|png)$/.test(u.pathname))||(u.hostname==='covers.openlibrary.org'&&/^\/b\/id\/\d+-L.jpg$/.test(u.pathname)));}catch{return false;}}
async function remote(url:string,headers?:HeadersInit){const r=await fetch(url,{headers,signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error('Source unavailable');return r.json() as Promise<any>;}
export async function handle(request:Request,env:Env):Promise<Response>{
 const u=new URL(request.url);if(!u.pathname.startsWith('/api/artwork'))return env.ASSETS.fetch(request);
 if(request.method!=='GET')return json({error:'Method not allowed'},405);
 try{
 if(u.pathname==='/api/artwork-image'){
  const url=u.searchParams.get('url')??'';if(!allowedImage(url))return json({error:'Unsupported image source'},400);
  const r=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(12000)});const mime=r.headers.get('content-type')??'';if(!r.ok||!/^image\/(jpeg|png|webp)/.test(mime))return json({error:'Image unavailable'},502);
  if(Number(r.headers.get('content-length'))>15*1024*1024)return json({error:'Image too large'},413);
  const reader=r.body!.getReader();const parts:Uint8Array[]=[];let size=0;while(true){const v=await reader.read();if(v.done)break;size+=v.value.length;if(size>15*1024*1024){await reader.cancel();return json({error:'Image too large'},413);}parts.push(v.value);}
  return new Response(new Blob(parts as BlobPart[],{type:mime}),{headers:{'Content-Type':mime,'Cache-Control':'public, max-age=86400','X-Content-Type-Options':'nosniff'}});
 }
 if(u.pathname!=='/api/artwork')return json({error:'Not found'},404);
 const category=u.searchParams.get('category'),title=(u.searchParams.get('title')??'').slice(0,160),author=(u.searchParams.get('author')??'').slice(0,160),year=u.searchParams.get('year');if(!title)return json({error:'Title required'},400);
 if(category==='WATCH'){
  if(!env.TMDB_READ_TOKEN)return json({state:'setup',candidates:[],message:'TMDB connection not configured.'});
  const kind=u.searchParams.get('format')==='Serija'?'tv':'movie';const q=new URLSearchParams({query:title,include_adult:'false',language:'en-US'});if(year)q.set(kind==='tv'?'first_air_date_year':'year',year);
  const data=await remote(`https://api.themoviedb.org/3/search/${kind}?${q}`,{Authorization:`Bearer ${env.TMDB_READ_TOKEN}`});
  const candidates=(data.results??[]).filter((x:any)=>x.poster_path).slice(0,8).map((x:any)=>({id:String(x.id),title:x.title??x.name,year:(x.release_date??x.first_air_date??'').slice(0,4),imageUrl:`https://image.tmdb.org/t/p/w780${x.poster_path}`,sourceUrl:`https://www.themoviedb.org/${kind}/${x.id}`,provider:'TMDB',attribution:'This product uses the TMDB API but is not endorsed or certified by TMDB.',exact:[x.title,x.name,x.original_title,x.original_name].some(v=>v&&norm(v)===norm(title))&&(!year||(x.release_date??x.first_air_date??'').startsWith(year))}));
  return json({state:'ready',candidates});
 }
 if(category==='BOOK'){
  const q=new URLSearchParams({title,limit:'8',fields:'key,title,author_name,cover_i,first_publish_year'});if(author)q.set('author',author);
  const data=await remote(`https://openlibrary.org/search.json?${q}`);const candidates=(data.docs??[]).filter((x:any)=>x.cover_i).slice(0,8).map((x:any)=>({id:x.key,title:x.title,author:(x.author_name??[]).join(', '),year:x.first_publish_year,imageUrl:`https://covers.openlibrary.org/b/id/${x.cover_i}-L.jpg`,sourceUrl:`https://openlibrary.org${x.key}`,provider:'Open Library',attribution:'Cover source: Open Library. Edition and image rights require editorial confirmation.',exact:norm(x.title)===norm(title)&&!!author&&(x.author_name??[]).some((v:string)=>norm(v)===norm(author))}));return json({state:'ready',candidates});
 }
 return json({error:'Unsupported category'},400);
 }catch{return json({state:'unavailable',candidates:[],message:'Image source is temporarily unavailable. Existing content is preserved.'},502);}
}
export default{fetch:handle};
