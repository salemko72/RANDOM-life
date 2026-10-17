import React from 'react';
import {visibleAccessLinks,type ContentInput,type Locale} from '@random/shared';
import Icon from './Icon';
export default function AccessLinks({item,locale}:{item:ContentInput;locale:Locale}){
 if(item.category!=='WATCH'&&item.category!=='BOOK')return null;
 const en=locale==='en',links=visibleAccessLinks(item);
 return <section className="item-access-links" aria-label={en?'Where to find this title':'Gdje pronaći ovaj naslov'}>
  <h4>{item.category==='WATCH'?(en?'Where to watch':'Gdje gledati'):(en?'Where to find the book':'Gdje nabaviti knjigu')}</h4>
  <div className="item-access-actions">{links.map((link,index)=>{
   const verb=link.kind==='search'?(en?'Search':'Pretraži'):link.purpose==='watch'?(en?'Watch on':'Gledaj na'):link.purpose==='buy'?(en?'Buy at':'Kupi na'):link.purpose==='borrow'?(en?'Find at':'Pronađi u'):(en?'Read on':'Čitaj na');
   return <a href={link.url} key={index} target="_blank" rel="noopener noreferrer" className="item-access-link"><span><strong>{verb} {link.provider}</strong>{(link.region||link.kind==='direct'&&link.checkedAt)&&<small>{[link.region,link.kind==='direct'&&link.checkedAt?(en?'Checked ':'Provjereno ')+link.checkedAt:null].filter(Boolean).join(' · ')}</small>}</span><Icon name="arrow" size={17}/></a>;
  })}</div>
  <p>{links.some(link=>link.kind==='search')?(en?'Search opens on the provider’s website. Check the matching title and availability there.':'Pretraga se otvara na stranici servisa. Tamo provjeri odgovarajući naslov i dostupnost.'):(en?'Availability and prices can change.':'Dostupnost i cijene se mogu promijeniti.')}</p>
 </section>;
}
