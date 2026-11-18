import {uiText,formatUi} from './ui-copy';
import React,{useEffect,useRef} from 'react';
import {createPortal} from 'react-dom';
import Icon from './Icon';

export default function ImageViewer({src,alt,title,locale,onClose}:{src:string;alt:string;title:string;locale:'en'|'bs';onClose:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null);
 const close=useRef<HTMLButtonElement>(null);
 useEffect(()=>{
  const element=dialog.current;if(!element)return;
  const previousFocus=document.activeElement;
  const previousOverflow=document.body.style.overflow;
  document.body.style.overflow='hidden';element.showModal();close.current?.focus();
  return()=>{element.close();document.body.style.overflow=previousOverflow;if(previousFocus instanceof HTMLElement&&previousFocus.isConnected)previousFocus.focus({preventScroll:true});};
 },[]);
 return createPortal(<dialog ref={dialog} className="image-viewer" aria-label={locale==='bs'?`Cijela slika: ${title}`:formatUi('Full image: {title}',locale,{title})} onKeyDown={event=>{if(event.key==='Tab'){event.preventDefault();close.current?.focus();}}} onCancel={event=>{event.preventDefault();event.stopPropagation();onClose();}} onClick={event=>{if(event.target===event.currentTarget)onClose();}}>
  <button ref={close} type="button" className="image-viewer-close" onClick={onClose} aria-label={uiText("Close full image","Zatvori cijelu sliku",locale)}><Icon name="close" size={32}/></button>
  <figure className="image-viewer-content"><img src={src} alt={alt} draggable={false}/><figcaption>{title}</figcaption></figure>
 </dialog>,document.body);
}
