/** The installed application document stays local; external pages are never loaded in its WebView. */
export function allowWebNavigation(request:{url:string;isTopFrame?:boolean},localUri:string){
 return request.url==='about:blank'||request.url.split('#')[0]===localUri;
}
