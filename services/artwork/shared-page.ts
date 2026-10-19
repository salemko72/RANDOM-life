import {localizeContent,type ContentRecord} from '@random/shared';
import {handleDatabase,type DatabaseEnv} from './database';
const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export async function sharedPage(request:Request,env:DatabaseEnv):Promise<Response>{
 if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});
 const url=new URL(request.url),id=url.pathname.slice('/item/'.length),locale=url.searchParams.get('lang')==='en'?'en':'bs';
 let item:ContentRecord|undefined,status=404;
 try{const response=await handleDatabase(new Request(new URL('/api/shared-item/'+id,url.origin)),env);if(response.ok)item=(await response.json() as {item:ContentRecord}).item;else status=response.status===404?404:503;}catch{status=503;}
 const d=item?localizeContent(item,locale):null,title=d?.title??(locale==='en'?'Item unavailable':'Item nije dostupan'),summary=d?.summary??(locale==='en'?'This item is no longer available.':'Ovaj item više nije dostupan.');
 const canonical=new URL(url.pathname,url.origin);canonical.searchParams.set('lang',locale);
 const image=d?new URL(d.image.path,url.origin).href:null;
 const payload=JSON.stringify({item:item??null,locale}).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
 const html=`<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${escape(title)} · LifeShuffler</title><meta name="description" content="${escape(summary)}"><meta property="og:type" content="article"><meta property="og:site_name" content="LifeShuffler"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(summary)}"><meta property="og:url" content="${escape(canonical.href)}">${image?`<meta property="og:image" content="${escape(image)}"><meta property="og:image:alt" content="${escape(title)}">`:''}<meta name="twitter:card" content="summary_large_image"><link rel="icon" type="image/png" href="/favicon.png"><link rel="canonical" href="${escape(canonical.href)}"><link rel="stylesheet" href="/standalone.css"></head><body><div id="root"><h1>${escape(title)}</h1><p>${escape(summary)}</p></div><script id="random-shared-item" type="application/json">${payload}</script><script src="/standalone.js"></script></body></html>`;
 return new Response(request.method==='HEAD'?null:html,{status:item?200:status,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex, nofollow'}});
}
