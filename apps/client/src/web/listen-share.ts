export function parseListenShare(raw:string):{title:string;message:string;url:string}|null{
 if(raw.length>2000)return null;try{const x=JSON.parse(raw),u=new URL(x.url);if(x.type!=='lifespinner.listen.share.v1'||typeof x.title!=='string'||x.title.length>300||u.origin!=='https://open.spotify.com'||!/^\/(track|playlist)\/[A-Za-z0-9]{22}$/.test(u.pathname)||u.search||u.hash||u.username||u.password)return null;return{title:x.title,url:u.href,message:x.title+'\n'+u.href};}catch{return null;}
}
export async function shareListen(title:string,id:string,kind:'track'|'playlist'='track'):Promise<'shared'|'copied'|'manual'|'cancelled'>{
 const url='https://open.spotify.com/'+kind+'/'+id;const payload={type:'lifespinner.listen.share.v1',title,url};if(!parseListenShare(JSON.stringify(payload)))return 'manual';
 const bridge=(window as Window&{ReactNativeWebView?:{postMessage:(s:string)=>void}}).ReactNativeWebView;if(bridge){bridge.postMessage(JSON.stringify(payload));return 'shared';}
 if(navigator.share)try{await navigator.share({title,url});return 'shared';}catch(e){if(e instanceof Error&&e.name==='AbortError')return 'cancelled';}
 try{await navigator.clipboard.writeText(url);return 'copied';}catch{return 'manual';}
}
