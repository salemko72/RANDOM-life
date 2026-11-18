import {uiText} from './ui-copy';
import React from 'react';
import {visibleAccessLinks,type ContentInput,type Locale} from '@random/shared';
import Icon from './Icon';
export default function AccessLinks({item,locale}:{item:ContentInput;locale:Locale}){
 if(item.category!=='WATCH'&&item.category!=='BOOK')return null;
 const links=visibleAccessLinks(item);
 return <section className="item-access-links" aria-label={uiText("Where to find this title","Gdje pronaći ovaj naslov",locale)}>
  <h4>{item.category==='WATCH'?(uiText("Where to watch","Gdje gledati",locale)):(uiText("Where to find the book","Gdje nabaviti knjigu",locale))}</h4>
  <div className="item-access-actions">{links.map((link,index)=>{
   const verb=link.kind==='search'?(uiText("Search","Pretraži",locale)):link.purpose==='watch'?(uiText("Watch on","Gledaj na",locale)):link.purpose==='buy'?(uiText("Buy at","Kupi na",locale)):link.purpose==='borrow'?(uiText("Find at","Pronađi u",locale)):(uiText("Read on","Čitaj na",locale));
   return <a href={link.url} key={index} target="_blank" rel="noopener noreferrer" className="item-access-link"><span><strong>{verb} {link.provider}</strong>{(link.region||link.kind==='direct'&&link.checkedAt)&&<small>{[link.region,link.kind==='direct'&&link.checkedAt?(uiText("Checked ","Provjereno ",locale))+link.checkedAt:null].filter(Boolean).join(' · ')}</small>}</span><Icon name="arrow" size={17}/></a>;
  })}</div>
  <p>{links.some(link=>link.kind==='search')?(uiText("Search opens on the provider’s website. Check the matching title and availability there.","Pretraga se otvara na stranici servisa. Tamo provjeri odgovarajući naslov i dostupnost.",locale)):(uiText("Availability and prices can change.","Dostupnost i cijene se mogu promijeniti.",locale))}</p>
 </section>;
}
