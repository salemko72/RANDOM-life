export const reviewShareStubs={name:'review-share-stubs',setup(builder){
 builder.onLoad({filter:/\/item-share\.ts$/},()=>({contents:"export const SHARE_ORIGIN='https://random-life-preview.pages.dev';export const itemShareUrl=(id,locale)=>SHARE_ORIGIN+'/item/'+encodeURIComponent(id)+'?lang='+locale;export const parseNativeShare=()=>null;export async function shareItem(){return 'cancelled'}",loader:'ts'}));
 builder.onLoad({filter:/\/app-share\.ts$/},()=>({contents:"export const APP_SHARE_ORIGIN='https://random-life-preview.pages.dev';export const appShareUrl=locale=>APP_SHARE_ORIGIN+'/get-app?lang='+locale;export const parseAppShare=()=>null;export async function shareApp(){return 'cancelled'}",loader:'ts'}));
 builder.onLoad({filter:/\/listen-share\.ts$/},()=>({contents:"export const parseListenShare=()=>null;export async function shareListen(){return 'cancelled'}",loader:'ts'}));
}};
