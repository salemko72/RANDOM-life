import {downloadApk} from './apk-download';
import {handleDatabase,type DatabaseEnv} from './database';
export type Env=DatabaseEnv&{ASSETS:{fetch(request:Request):Promise<Response>};TMDB_READ_TOKEN?:string};
const json=(data:unknown,status=200)=>Response.json(data,{status});
const norm=(s:string)=>s.normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
// Initials are useful for discovery, but never sufficient for automatic selection.
function compatibleAuthor(expected:string,actual:string){
 const a=norm(expected).split(' ').filter(Boolean),b=norm(actual).split(' ').filter(Boolean);
 if(a.length<2||b.length<2)return norm(expected)===norm(actual);
 if(a.at(-1)!==b.at(-1))return false;
 const compatible=(x:string,y:string)=>x===y||(x.length===1||y.length===1)&&x[0]===y[0];
 return a.length===b.length?a.every((v,i)=>compatible(v,b[i])):compatible(a[0],b[0]);
}
export function allowedImage(value:string){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&((u.hostname==='image.tmdb.org'&&/^\/t\/p\/w780\/[^/]+\.(jpg|png)$/.test(u.pathname))||(u.hostname==='covers.openlibrary.org'&&/^\/b\/id\/\d+-L.jpg$/.test(u.pathname)));}catch{return false;}}
export function allowedCoverRedirect(value:string,origin:string){
 if(allowedImage(value))return true;
 try{const original=new URL(origin),u=new URL(value);const id=/^\/b\/id\/(\d+)-L\.jpg$/.exec(original.pathname)?.[1];
 const archiveHost=u.hostname==='archive.org'||/^ia\d+(?:\.[a-z0-9-]+)*\.archive\.org$/.test(u.hostname);
 const archive=u.searchParams.get('archive')??u.searchParams.get('zip')??'';
 const file=u.searchParams.get('file')??'';
 const archiveFile=u.pathname==='/view_archive.php'&&/^\/(?:\d+\/items\/|items\/|download\/)(?:l_covers_\d+\/l_covers_\d+_\d+\.zip|olcovers\d+\/olcovers\d+-L\.zip)$/.test(archive)&&/^\d+-L\.jpg$/.test(file)&&Number(file.slice(0,-6))===Number(id);
 return original.hostname==='covers.openlibrary.org'&&!!id&&u.protocol==='https:'&&!u.username&&!u.password&&(!u.port||u.port==='443')&&archiveHost&&(archiveFile||(/^\/(?:download\/|\d+\/items\/|items\/)olcovers\d+\/olcovers\d+-L\.zip\/\d+-L\.jpg$/.test(u.pathname)||/^\/(?:download\/|\d+\/items\/|items\/)l_covers_\d+\/l_covers_\d+_\d+\.zip\/\d+-L\.jpg$/.test(u.pathname))&&Number(/\/(\d+)-L\.jpg$/.exec(u.pathname)?.[1])===Number(id));
 }catch{return false;}
}
class SourceError extends Error{constructor(public status:number){super('Source unavailable')}}
export function tmdbAuth(token:string){const clean=token.trim().replace(/^Bearer\s+/i,'');return /^[a-fA-F0-9]{32}$/.test(clean)?{key:clean,headers:undefined}:{key:undefined,headers:{Authorization:`Bearer ${clean}`}};}
async function remote(url:string,headers?:HeadersInit,timeout=12000){const r=await fetch(url,{headers,signal:AbortSignal.timeout(timeout)});if(!r.ok)throw new SourceError(r.status);return r.json() as Promise<any>;}
export async function handle(request:Request,env:Env):Promise<Response>{
 const u=new URL(request.url);if(u.pathname==='/downloads/RANDOM-life-android.apk')return downloadApk(request,env.ASSETS);if(u.pathname.startsWith('/api/database/')||u.pathname==='/api/content-contract'||u.pathname==='/api/catalog'||u.pathname==='/api/content'||u.pathname.startsWith('/api/content/')||u.pathname.startsWith('/media/'))return handleDatabase(request,env);if(!u.pathname.startsWith('/api/artwork'))return env.ASSETS.fetch(request);
 if(request.method!=='GET')return json({error:'Method not allowed'},405);
 try{
 if(u.pathname==='/api/artwork-image'){
  const url=u.searchParams.get('url')??'';if(!allowedImage(url))return json({error:'Unsupported image source'},400);
  let current=url;let r:Response;for(let hop=0;;hop++){r=await fetch(current,{redirect:'manual',signal:AbortSignal.timeout(12000)});if(![301,302,303,307,308].includes(r.status))break;const location=r.headers.get('location');if(!location||hop>=3)return json({error:'IMAGE_REDIRECT_LIMIT'},502);const next=new URL(location,current).href;if(!allowedCoverRedirect(next,url)){const target=new URL(next);return json({error:'IMAGE_REDIRECT_UNSUPPORTED',destination:(target.hostname+target.pathname).slice(0,300)},502);}current=next;}const mime=r.headers.get('content-type')??'';if(!r.ok)return json({error:`IMAGE_SOURCE_HTTP_${r.status}`},502);if(!/^image\/(jpeg|png|webp)/.test(mime))return json({error:'IMAGE_SOURCE_NOT_IMAGE'},502);
  if(Number(r.headers.get('content-length'))>15*1024*1024)return json({error:'Image too large'},413);
  const reader=r.body!.getReader();const parts:Uint8Array[]=[];let size=0;while(true){const v=await reader.read();if(v.done)break;size+=v.value.length;if(size>15*1024*1024){await reader.cancel();return json({error:'Image too large'},413);}parts.push(v.value);}
  return new Response(new Blob(parts as BlobPart[],{type:mime}),{headers:{'Content-Type':mime,'Cache-Control':'public, max-age=86400','X-Content-Type-Options':'nosniff'}});
 }
 if(u.pathname!=='/api/artwork')return json({error:'Not found'},404);
 const category=u.searchParams.get('category'),title=(u.searchParams.get('title')??'').slice(0,160),author=(u.searchParams.get('author')??'').slice(0,160),year=u.searchParams.get('year');if(!title)return json({error:'Title required'},400);
 if(category==='WATCH'){
  if(!env.TMDB_READ_TOKEN)return json({state:'setup',candidates:[],message:'TMDB connection not configured.'});
  const kind=u.searchParams.get('format')==='Serija'?'tv':'movie';const q=new URLSearchParams({query:title,include_adult:'false',language:'en-US'});if(year)q.set(kind==='tv'?'first_air_date_year':'year',year);
  const auth=tmdbAuth(env.TMDB_READ_TOKEN);if(auth.key)q.set('api_key',auth.key);
  const data=await remote(`https://api.themoviedb.org/3/search/${kind}?${q}`,auth.headers);
  const candidates=(data.results??[]).filter((x:any)=>x.poster_path).slice(0,8).map((x:any)=>({id:String(x.id),title:x.title??x.name,year:(x.release_date??x.first_air_date??'').slice(0,4),imageUrl:`https://image.tmdb.org/t/p/w780${x.poster_path}`,sourceUrl:`https://www.themoviedb.org/${kind}/${x.id}`,provider:'TMDB',attribution:'This product uses the TMDB API but is not endorsed or certified by TMDB.',exact:[x.title,x.name,x.original_title,x.original_name].some(v=>v&&norm(v)===norm(title))&&(!year||(x.release_date??x.first_air_date??'').startsWith(year))}));
  return json({state:'ready',candidates});
 }
 if(category==='BOOK'){
  const alternateTitle=(u.searchParams.get('alternateTitle')??'').trim().slice(0,160),alternateAuthor=(u.searchParams.get('alternateAuthor')??author).trim().slice(0,160);
  const identities=[{title,author},...(alternateTitle&&norm(alternateTitle)!==norm(title)?[{title:alternateTitle,author:alternateAuthor}]:[])];
  const deadline=Date.now()+12000;
  let data:any={docs:[]},matched={title,author};
  for(const identity of identities){
   const q=new URLSearchParams({title:identity.title,limit:'40',fields:'key,title,author_name,cover_i,first_publish_year'});if(identity.author)q.set('author',identity.author);
   const lookup=()=>{const remaining=deadline-Date.now();if(remaining<=0)throw new DOMException('Book search timed out','TimeoutError');return remote(`https://openlibrary.org/search.json?${q}`,undefined,Math.min(4000,remaining));};
   const relevant=(x:any)=>x.cover_i&&norm(x.title)===norm(identity.title)&&(!identity.author||(x.author_name??[]).some((v:string)=>compatibleAuthor(identity.author,v)));
   data=await lookup();
   if(identity.author&&!(data.docs??[]).some(relevant)){q.delete('author');data=await lookup();}
   const surname=norm(identity.author).split(' ').at(-1)??'';
   if(identity.author&&surname!==norm(identity.author)&&!(data.docs??[]).some(relevant)){
    q.set('author',identity.author.trim().split(/\s+/).at(-1)!);data=await lookup();
   }
   data={docs:(data.docs??[]).filter(relevant)};
   matched=identity;
   if(data.docs.length)break;
  }
  const candidates=(data.docs??[]).filter((x:any)=>x.cover_i).slice(0,8).map((x:any)=>({id:x.key,title:x.title,author:(x.author_name??[]).join(', '),year:x.first_publish_year,imageUrl:`https://covers.openlibrary.org/b/id/${x.cover_i}-L.jpg`,sourceUrl:`https://openlibrary.org${x.key}`,provider:'Open Library',attribution:'Cover source: Open Library. Edition and image rights require editorial confirmation.',exact:norm(x.title)===norm(matched.title)&&!!matched.author&&(x.author_name??[]).some((v:string)=>norm(v)===norm(matched.author))}));return json({state:'ready',candidates});
 }
 return json({error:'Unsupported category'},400);
 }catch(error){if(error instanceof SourceError&&(error.status===401||error.status===403))return json({state:'authentication',candidates:[],message:'TMDB did not accept the configured credential.'});return json({state:'unavailable',candidates:[],code:error instanceof SourceError?`UPSTREAM_HTTP_${error.status}`:error instanceof Error&&error.name==='TimeoutError'?'UPSTREAM_TIMEOUT':'UPSTREAM_NETWORK',message:'Image source is temporarily unavailable. Existing content is preserved.'},502);}
}
export default{fetch:handle};
