/** Spotify PKCE: tokens stay in this browser tab, separate from profile/catalog/native bridges. */
export const SPOTIFY_CLIENT_ID='9c28494375a04e8c8667b2629dab6515';
export const SPOTIFY_REDIRECT_URI='https://random-life-preview.pages.dev/auth/spotify/callback';
export const SPOTIFY_SCOPES='streaming user-read-private user-read-email user-modify-playback-state';
const AUTH_KEY='lifespinner.spotify.session.v1',PENDING_KEY='lifespinner.spotify.pkce.v1',EVENT='lifespinner-spotify-auth';
type Tokens={accessToken:string;refreshToken:string;expiresAt:number;scope:string};
type Session=Tokens&{owner:string;name:string;product:string};
type Pending={state:string;verifier:string;createdAt:number;owner:string};
const signal=()=>window.dispatchEvent(new Event(EVENT));
function owner(){try{return JSON.parse(localStorage.getItem('random-life.local-profile.v1')??'null')?.id??null;}catch{return null;}}
function session():Session|null{try{const s=JSON.parse(sessionStorage.getItem(AUTH_KEY)??'null');if(!s)return null;if(s.owner!==owner()||typeof s.name!=='string'||s.name.length>200||typeof s.product!=='string'||s.product.length>50||typeof s.accessToken!=='string'||s.accessToken.length>4096||typeof s.refreshToken!=='string'||!s.refreshToken||s.refreshToken.length>4096||!Number.isFinite(s.expiresAt)||typeof s.scope!=='string'){sessionStorage.removeItem(AUTH_KEY);return null;}return s;}catch{return null;}}
export function spotifyStatus(){const s=session();return s?{connected:true,name:s.name,premium:s.product==='premium'}:{connected:false,name:'',premium:false};}
export function subscribeSpotify(fn:()=>void){window.addEventListener(EVENT,fn);return()=>window.removeEventListener(EVENT,fn);}
export function disconnectSpotify(){try{sessionStorage.removeItem(AUTH_KEY);sessionStorage.removeItem(PENDING_KEY);}catch{}generation++;refreshing=undefined;signal();}
const encode=(bytes:Uint8Array)=>btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
export async function spotifyAuthorizationUrl(profileId:string){
 if(location.origin!==new URL(SPOTIFY_REDIRECT_URI).origin)throw Error('SPOTIFY_WEB_ONLY');
 if(profileId!==owner())throw Error('SPOTIFY_PROFILE');
 const verifier=encode(crypto.getRandomValues(new Uint8Array(64))),state=encode(crypto.getRandomValues(new Uint8Array(32))),challenge=encode(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(verifier))));
 sessionStorage.setItem(PENDING_KEY,JSON.stringify({state,verifier,createdAt:Date.now(),owner:profileId} satisfies Pending));
 const u=new URL('https://accounts.spotify.com/authorize');u.search=new URLSearchParams({client_id:SPOTIFY_CLIENT_ID,response_type:'code',redirect_uri:SPOTIFY_REDIRECT_URI,scope:SPOTIFY_SCOPES,state,code_challenge_method:'S256',code_challenge:challenge}).toString();return u.href;
}
function record(value:unknown):Record<string,unknown>{if(!value||typeof value!=='object'||Array.isArray(value))throw Error('SPOTIFY_INVALID_RESPONSE');return value as Record<string,unknown>;}
async function spotifyFetch(url:string,init:RequestInit){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);try{return await fetch(url,{...init,signal:controller.signal,referrerPolicy:'no-referrer'});}finally{clearTimeout(timer);}}
async function tokenRequest(body:Record<string,string>,previous?:Tokens):Promise<Tokens>{
 const r=await spotifyFetch('https://accounts.spotify.com/api/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:SPOTIFY_CLIENT_ID,...body}),referrerPolicy:'no-referrer'});if(!r.ok)throw Error(r.status===400||r.status===401?'SPOTIFY_LOGIN_REQUIRED':'SPOTIFY_UNAVAILABLE');const t=record(await r.json());const refreshToken=t.refresh_token??previous?.refreshToken,scope=t.scope??previous?.scope;
 if((typeof t.token_type!=='string'||t.token_type.toLowerCase()!=='bearer')||typeof t.access_token!=='string'||!t.access_token||t.access_token.length>4096||typeof refreshToken!=='string'||!refreshToken||refreshToken.length>4096||typeof t.expires_in!=='number'||!Number.isFinite(t.expires_in)||t.expires_in<=0||t.expires_in>86400||typeof scope!=='string'||!SPOTIFY_SCOPES.split(' ').every(s=>scope.split(' ').includes(s)))throw Error('SPOTIFY_INVALID_RESPONSE');return{accessToken:t.access_token,refreshToken,expiresAt:Date.now()+t.expires_in*1000,scope};
}
export async function finishSpotifyLogin(callbackUrl:string){
 const callback=new URL(callbackUrl),params=callback.searchParams;
 // Remove the one-time authorization code before any API call or navigation.
 history.replaceState(null,'','/auth/spotify/callback');
 if(callback.origin!==new URL(SPOTIFY_REDIRECT_URI).origin||!/^\/auth\/spotify\/callback\/?$/.test(callback.pathname))throw Error('SPOTIFY_STATE');
 let pending:Pending|null=null;try{pending=JSON.parse(sessionStorage.getItem(PENDING_KEY)??'null');}catch{}sessionStorage.removeItem(PENDING_KEY);
 if(!pending||typeof pending.state!=='string'||pending.state.length<40||params.get('state')!==pending.state||typeof pending.verifier!=='string'||pending.verifier.length<43||pending.verifier.length>128||!Number.isFinite(pending.createdAt)||Date.now()-pending.createdAt>600000||pending.createdAt>Date.now()||pending.owner!==owner())throw Error('SPOTIFY_STATE');
 if(params.has('error'))throw Error(params.get('error')==='access_denied'?'SPOTIFY_DENIED':'SPOTIFY_LOGIN_REQUIRED');const code=params.get('code');if(!code||code.length>4096)throw Error('SPOTIFY_STATE');const gen=generation;
 const tokens=await tokenRequest({grant_type:'authorization_code',code,redirect_uri:SPOTIFY_REDIRECT_URI,code_verifier:pending.verifier});
 const r=await spotifyFetch('https://api.spotify.com/v1/me',{headers:{Authorization:'Bearer '+tokens.accessToken},referrerPolicy:'no-referrer'});if(!r.ok)throw Error(r.status===403?'SPOTIFY_ACCESS':'SPOTIFY_UNAVAILABLE');const account=record(await r.json());
 if(gen!==generation||pending.owner!==owner())throw Error('SPOTIFY_STATE');const s:Session={...tokens,owner:pending.owner,name:typeof account.display_name==='string'?account.display_name.slice(0,200):'Spotify',product:typeof account.product==='string'?account.product.slice(0,50):'unknown'};sessionStorage.setItem(AUTH_KEY,JSON.stringify(s));signal();
}
let refreshing:Promise<string>|undefined,generation=0;
export async function spotifyAccessToken():Promise<string>{
 const s=session();if(!s)throw Error('SPOTIFY_LOGIN_REQUIRED');if(s.expiresAt>Date.now()+60000)return s.accessToken;if(refreshing)return refreshing;const gen=generation;
 refreshing=(async()=>{try{const tokens=await tokenRequest({grant_type:'refresh_token',refresh_token:s.refreshToken},s);if(gen!==generation||s.owner!==owner())throw Error('SPOTIFY_LOGIN_REQUIRED');sessionStorage.setItem(AUTH_KEY,JSON.stringify({...s,...tokens}));signal();return tokens.accessToken;}catch(e){if(gen===generation&&e instanceof Error&&e.message==='SPOTIFY_LOGIN_REQUIRED')disconnectSpotify();throw e;}finally{if(gen===generation)refreshing=undefined;}})();return refreshing;
}
export async function spotifyPlayTarget(uri:string,deviceId:string){
 const match=/^spotify:(track|playlist):([A-Za-z0-9]{22})$/.exec(uri);
 if(!match||!deviceId||deviceId.length>200)throw Error('SPOTIFY_INVALID_TARGET');
 const token=await spotifyAccessToken();
 const body=match[1]==='playlist'?{context_uri:uri}:{uris:[uri]};
 const r=await spotifyFetch('https://api.spotify.com/v1/me/player/play?device_id='+encodeURIComponent(deviceId),{method:'PUT',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(body),referrerPolicy:'no-referrer'});
 if(!r.ok)throw Error(r.status===403?'SPOTIFY_ACCESS':r.status===401?'SPOTIFY_LOGIN_REQUIRED':'SPOTIFY_PLAYBACK');
}
