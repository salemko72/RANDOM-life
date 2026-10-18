import React,{useEffect,useState} from 'react';
import {localizeContent,type ContentRecord,type Locale} from '@random/shared';
import ItemActions from './ItemActions';
import ImageViewer from './ImageViewer';
import AccessLinks from './AccessLinks';
import Icon from './Icon';
import {loadProfile,saveProfile,toggleCompleted} from './preferences';
import {loadExperience,saveExperience} from './experience-state';

export default function SharedItem(){
 const [payload]=useState<{item:ContentRecord|null;locale:Locale}>(()=>{try{return JSON.parse(document.getElementById('random-shared-item')?.textContent??'null')??{item:null,locale:'bs'};}catch{return{item:null,locale:'bs'};}});
 const {item,locale}=payload,en=locale==='en';const [profile,setProfile]=useState(loadProfile),[experience,setExperience]=useState(()=>loadExperience(profile.id)),[expanded,setExpanded]=useState(false);
 useEffect(()=>{saveProfile(profile);},[profile]);useEffect(()=>{saveExperience(profile.id,experience);},[profile.id,experience]);
 if(!item)return <div className="random-world shared-world"><main className="random-card shared-unavailable"><h1>{en?'Item unavailable':'Item nije dostupan'}</h1><p>{en?'This shared item is currently unavailable.':'Ovaj podijeljeni item trenutno nije dostupan.'}</p><span>RANDOM life</span></main></div>;
 const d=localizeContent(item,locale),category=d.category.toLowerCase(),liked=experience.favorites.includes(item.id);
 return <div className="random-world shared-world"><div className="random-card item-focused"><main className={`main-stage shared-stage result-scene category-${category==='book'?'read':category} show-details`}>
  <article className="shared-article"><div className="detail-hero"><button className="detail-photo photo-expand" onClick={()=>setExpanded(true)} aria-label={en?'View full image':'Prikaži cijelu sliku'}><span className="detail-full-image" style={{backgroundImage:`url("${d.image.path}")`}}/></button><ItemActions item={item} locale={locale} liked={liked} completed={profile.completedIds.includes(item.id)} onLike={()=>setExperience(s=>({...s,favorites:liked?s.favorites.filter(id=>id!==item.id):[...s.favorites,item.id].slice(-200)}))} onCompleted={()=>setProfile(p=>toggleCompleted(p,item.id))}/></div>
  <div className="detail-reading-surface"><div className="detail-heading"><p className="eyebrow">RANDOM life · {d.category==='BOOK'?'READ':d.category}</p><h1>{d.title}</h1>{d.category==='BOOK'&&<p className="book-author">{d.authors.join(', ')}</p>}<p className="shared-summary">{d.summary}</p>{d.category==='EAT'&&<div className="detail-meta"><span><Icon name="clock"/>{d.totalMinutes} min</span><span><Icon name="people"/>{d.servings} {en?'servings':'porcije'}</span></div>}</div>
  <div className="detail-sheet"><div className="detail-content">{d.category==='EAT'&&<section><h2>{en?'Ingredients':'Sastojci'}</h2><ul className="shared-ingredients">{d.ingredients.map((i,n)=><li key={n}>{i.quantity!==null?`${i.quantity} `:''}{i.unit} {i.name}</li>)}</ul></section>}
   {d.category==='EAT'||d.category==='MOVE'||d.category==='GO'?<section><h2>{d.category==='EAT'?(en?'Preparation':'Priprema'):(en?'Your plan':'Tvoj plan')}</h2>{d.steps.map((step,i)=><div className="recipe-step" key={i}><span>{i+1}</span><p>{step}</p></div>)}</section>:<section><h2>{d.category==='BOOK'?(en?'About this book':'O ovoj knjizi'):(en?'About this title':'O ovom naslovu')}</h2><p className="reading-reason">{d.recommendationReason}</p><div className="genre-tags">{d.genres.map(g=><span key={g}>{g}</span>)}</div></section>}
   <AccessLinks item={item} locale={locale}/>{d.image.provenance&&<p className="cover-credit">{d.image.provenance.provider} · {d.image.provenance.attribution}</p>}
  </div></div></div><footer className="shared-brand">RANDOM <em>life</em></footer></article>
 </main></div>{expanded&&<ImageViewer src={d.image.path} alt={d.title} title={d.title} locale={locale} onClose={()=>setExpanded(false)}/>}</div>;
}
