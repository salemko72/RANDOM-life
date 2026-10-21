/** Keep the application document local; only Spotify's track embed may load in a subframe. */
export function allowWebNavigation(request:{url:string;isTopFrame?:boolean},localUri:string){
 if(request.url==='about:blank'||request.url.split('#')[0]===localUri)return true;
 if(request.isTopFrame!==false)return false;
 try{const u=new URL(request.url);return u.origin==='https://open.spotify.com'&&/^\/embed\/track\/[A-Za-z0-9]{22}$/.test(u.pathname)&&!u.username&&!u.password;}catch{return false;}
}
