import React,{useState} from 'react';
import {accessLinkSchema,defaultAccessLinks,type AccessLink,type ContentInput,type Locale} from '@random/shared';

const blank=(purpose:AccessLink['purpose']):AccessLink=>({provider:'',url:'',purpose,kind:'direct',verified:false});
export default function AccessLinksEditor({item,locale,onChange}:{item:ContentInput;locale:Locale;onChange:(links:AccessLink[])=>void}){
 const [editing,setEditing]=useState<number|null>(null),[draft,setDraft]=useState<AccessLink>(()=>blank(item.category==='BOOK'?'buy':'watch')),[error,setError]=useState('');
 const en=locale==='en',links=item.accessLinks??[];
 const reset=()=>{setEditing(null);setDraft(blank(item.category==='BOOK'?'buy':'watch'));setError('');};
 function update(patch:Partial<AccessLink>){setDraft(value=>({...value,...patch,verified:false}));setError('');}
 function save(){
  const parsed=accessLinkSchema.safeParse(draft);
  if(!parsed.success){setError(en?'Enter a provider and a public HTTPS URL. Reviewed links need a check date; country uses two letters.':'Unesi naziv i javni HTTPS link. Potvrđen link treba datum provjere; država se unosi s dva slova.');return;}
  onChange(editing===null?[...links,parsed.data]:links.map((link,index)=>index===editing?parsed.data:link));reset();
 }
 return <section className="access-links-editor" aria-label={en?'Watch and book links':'Linkovi za gledanje i knjige'}>
  <h3>{en?'Where to watch / find the book':'Gdje gledati / nabaviti knjigu'}</h3>
  <p className="input-help">{en?'Optional. Direct links appear in the app after your confirmation. Search links are clearly labelled and do not claim availability. Missing links never block publication.':'Opcionalno. Direktni linkovi se prikazuju u appu nakon tvoje potvrde. Pretraga je jasno označena i ne potvrđuje dostupnost. Nedostajući linkovi ne blokiraju objavu.'}</p>
  <ul className="access-link-rows">{links.map((link,index)=><li key={index}>
   <a href={link.url} target="_blank" rel="noopener noreferrer">{link.provider}</a>
   <small>{link.kind==='search'?(en?'Search':'Pretraga'):(en?'Direct link':'Direktni link')}{link.region?` · ${link.region}`:''}{link.verified?(en?' · Checked':' · Provjereno'):(link.kind==='direct'?(en?' · Not shown until checked':' · Čeka potvrdu za prikaz'):'')}</small>
   <div className="actions"><button type="button" className="quiet" onClick={()=>{setDraft({...link});setEditing(index);setError('');}}>{en?'Edit':'Uredi'}</button><button type="button" className="quiet" onClick={()=>{onChange(links.filter((_,i)=>i!==index));reset();}}>{en?'Remove':'Ukloni'}</button></div>
  </li>)}</ul>
  {!links.length&&<button type="button" className="quiet" onClick={()=>onChange(defaultAccessLinks(item))}>{en?'Add search links automatically':'Automatski dodaj linkove za pretragu'}</button>}
  <details className="access-link-form" open={editing!==null||undefined}>
   <summary>{editing!==null?(en?'Edit link':'Uredi link'):(en?'Add a link':'Dodaj link')}</summary>
   <label>{en?'Service or bookshop':'Servis ili knjižara'}<input value={draft.provider} maxLength={80} onChange={e=>update({provider:e.target.value})}/></label>
   <label>HTTPS URL<input type="url" value={draft.url} maxLength={2048} placeholder="https://…" onChange={e=>update({url:e.target.value})}/></label>
   <label>{en?'Purpose':'Namjena'}<select value={draft.purpose} onChange={e=>update({purpose:e.target.value as AccessLink['purpose']})}>
    <option value="watch">{en?'Watch':'Gledanje'}</option><option value="buy">{en?'Buy':'Kupovina'}</option><option value="borrow">{en?'Library / borrow':'Biblioteka / posudba'}</option><option value="read">{en?'Read online':'Čitanje online'}</option>
   </select></label>
   <label>{en?'Link type':'Vrsta linka'}<select value={draft.kind} onChange={e=>update({kind:e.target.value as AccessLink['kind']})}><option value="direct">{en?'Exact title / edition':'Tačan naslov / izdanje'}</option><option value="search">{en?'Search only':'Samo pretraga'}</option></select></label>
   <label>{en?'Country (optional, e.g. BA)':'Država (opcionalno, npr. BA)'}<input value={draft.region??''} maxLength={2} onChange={e=>update({region:e.target.value?e.target.value.toUpperCase():undefined})}/></label>
   <label>{en?'Date checked (optional)':'Datum provjere (opcionalno)'}<input type="date" value={draft.checkedAt??''} onChange={e=>update({checkedAt:e.target.value||undefined})}/></label>
   <label className="check"><input type="checkbox" checked={draft.verified} onChange={e=>setDraft(value=>({...value,verified:e.target.checked,...(e.target.checked&&!value.checkedAt?{checkedAt:new Date().toISOString().slice(0,10)}:{})}))}/>{en?'I checked that this link matches the title / edition.':'Provjerio/la sam da link odgovara naslovu / izdanju.'}</label>
   {error&&<p role="alert">{error}</p>}
   <div className="actions"><button type="button" disabled={editing===null&&links.length>=12} className="quiet" onClick={save}>{en?'Apply link to item':'Dodaj link u item'}</button><button type="button" className="quiet" onClick={reset}>{en?'Clear':'Očisti'}</button></div>
   <p className="input-help">{en?'Changes are saved to D1 with the main PUBLISH button.':'Izmjene se snimaju u D1 glavnim dugmetom OBJAVI.'}</p>
  </details>
 </section>;
}
