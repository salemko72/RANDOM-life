import {uiText} from './ui-copy';
import React,{useEffect,useState} from 'react';
import type {ContentRecord,Locale} from '@random/shared';
import {localizeContent} from '@random/shared';
import Icon from './Icon';
import {itemShareUrl,shareItem} from './item-share';

export default function ItemActions({item,locale,liked,completed,onLike,onCompleted}:{item:ContentRecord;locale:Locale;liked:boolean;completed:boolean;onLike:(event:React.MouseEvent<HTMLButtonElement>)=>void;onCompleted:()=>void}){
 const [notice,setNotice]=useState(''),[manual,setManual]=useState(false);const url=itemShareUrl(item.id,locale);
 useEffect(()=>{if(!notice)return;const timer=setTimeout(()=>setNotice(''),2400);return()=>clearTimeout(timer);},[notice]);
 const completedName=item.category==='BOOK'?(uiText("Already read","Već pročitano",locale)):item.category==='WATCH'?(uiText("Already watched","Već pogledano",locale)):item.category==='MOVE'?(uiText("Already done","Već odrađeno",locale)):item.category==='GO'?(uiText("Already visited","Već posjećeno",locale)):(uiText("Already tried","Već isprobano",locale));
 async function share(){const result=await shareItem(localizeContent(item,locale).title,url);if(result==='copied')setNotice(uiText("Link copied","Link je kopiran",locale));if(result==='manual')setManual(true);}
 return <><div className="item-social-actions" role="group" aria-label={uiText("Item actions","Akcije za item",locale)}>
  <button type="button" className={`favorite-float ${liked?'saved':''}`} aria-label={uiText("Like","Sviđa mi se",locale)} aria-pressed={liked} onClick={onLike}><Icon name="heart" size={23}/></button>
  <button type="button" className="share-float" aria-label={uiText("Share","Podijeli",locale)} onClick={()=>void share()}><Icon name="share" size={23}/></button>
  <button type="button" className={`completed-float ${completed?'marked':''}`} aria-label={completedName} aria-pressed={completed} onClick={onCompleted}><Icon name="seen" size={23}/></button>
 </div>{notice&&<button className="share-notice" role="status" onClick={()=>setNotice('')}>{notice}</button>}{manual&&<div className="share-link-dialog" role="dialog" aria-modal="true" aria-label={uiText("Share link","Podijeli link",locale)}><button autoFocus aria-label={uiText("Close","Zatvori",locale)} onClick={()=>setManual(false)}><Icon name="close" size={30}/></button><p>{uiText("Copy this link","Kopiraj ovaj link",locale)}</p><input aria-label={uiText("Item link","Link itema",locale)} readOnly value={url} onFocus={e=>e.currentTarget.select()}/></div>}</>;
}
