import React,{useEffect,useState} from 'react';
import type {ContentRecord,Locale} from '@random/shared';
import {localizeContent} from '@random/shared';
import Icon from './Icon';
import {itemShareUrl,shareItem} from './item-share';

export default function ItemActions({item,locale,liked,completed,onLike,onCompleted}:{item:ContentRecord;locale:Locale;liked:boolean;completed:boolean;onLike:(event:React.MouseEvent<HTMLButtonElement>)=>void;onCompleted:()=>void}){
 const [notice,setNotice]=useState(''),[manual,setManual]=useState(false);const en=locale==='en',url=itemShareUrl(item.id,locale);
 useEffect(()=>{if(!notice)return;const timer=setTimeout(()=>setNotice(''),2400);return()=>clearTimeout(timer);},[notice]);
 const completedName=item.category==='BOOK'?(en?'Already read':'Već pročitano'):item.category==='WATCH'?(en?'Already watched':'Već pogledano'):item.category==='MOVE'?(en?'Already done':'Već odrađeno'):item.category==='GO'?(en?'Already visited':'Već posjećeno'):(en?'Already tried':'Već isprobano');
 async function share(){const result=await shareItem(localizeContent(item,locale).title,url);if(result==='copied')setNotice(en?'Link copied':'Link je kopiran');if(result==='manual')setManual(true);}
 return <><div className="item-social-actions" role="group" aria-label={en?'Item actions':'Akcije za item'}>
  <button type="button" className={`favorite-float ${liked?'saved':''}`} aria-label={en?'Like':'Sviđa mi se'} aria-pressed={liked} onClick={onLike}><Icon name="heart" size={23}/></button>
  <button type="button" className="share-float" aria-label={en?'Share':'Podijeli'} onClick={()=>void share()}><Icon name="share" size={23}/></button>
  <button type="button" className={`completed-float ${completed?'marked':''}`} aria-label={completedName} aria-pressed={completed} onClick={onCompleted}><Icon name="seen" size={23}/></button>
 </div>{notice&&<button className="share-notice" role="status" onClick={()=>setNotice('')}>{notice}</button>}{manual&&<div className="share-link-dialog" role="dialog" aria-modal="true" aria-label={en?'Share link':'Podijeli link'}><button autoFocus aria-label={en?'Close':'Zatvori'} onClick={()=>setManual(false)}><Icon name="close" size={30}/></button><p>{en?'Copy this link':'Kopiraj ovaj link'}</p><input aria-label={en?'Item link':'Link itema'} readOnly value={url} onFocus={e=>e.currentTarget.select()}/></div>}</>;
}
