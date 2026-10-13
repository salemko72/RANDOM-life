import React, { useEffect, useRef, useState } from 'react';
import { contentSchema, publicationIssues, selectRecommendation, type ContentRecord } from '@random/shared';
import ContentStudio from '../../../studio/src/App';
import { readPreviewCatalog, readPreviewImage } from '../../../studio/src/preview-store';
import '../../../studio/src/styles.css';
import './experience.css';
import Icon from './Icon';
import { previewCatalog } from './catalog';
import { WHEEL_CATEGORIES, chooseEnabledCategory, coast, landingRotation, sectorAtRotation, type WheelCategory } from './wheel';

function rememberedEntry() { try {return sessionStorage.getItem('random-preview-entered')==='yes';}catch{return false;} }
function imageClass(item:ContentRecord) { if(item.category==='BOOK')return 'photo-reading';const photos:Record<string,string>={'/media/lentil-soup.png':'photo-soup','/media/potato-salad.png':'photo-potato-salad','/media/swedish-meatballs.png':'photo-swedish-meatballs','/media/menemen.png':'photo-menemen','/media/moussaka.png':'photo-moussaka'};return photos[item.image.path]??'photo-soup'; }
const ingredientPositions:Record<string,number>={'Crvena leća':0,'Luk':1,'Mrkva':2,'Bijeli luk':3,'Paradajz pire':4,'Maslinovo ulje':5,'Voda':6,'Limun':7};
function CategoryPhoto({ category, className='' }: {category:WheelCategory;className?:string}) {
  return <span className={`category-photo category-${category.toLowerCase()} ${className}`} />;
}
function Wheel({ rotor, tick, spinning, onSpin }: {rotor:React.RefObject<HTMLDivElement|null>;tick:number;spinning:boolean;onSpin:()=>void}) {
  function sector(index:number) {const start=(index*60-120)*Math.PI/180,end=(index*60-60)*Math.PI/180;return `M300 300 L${300+286*Math.cos(start)} ${300+286*Math.sin(start)} A286 286 0 0 1 ${300+286*Math.cos(end)} ${300+286*Math.sin(end)} Z`;}
  return <div className={`wheel-stage ${spinning?'is-spinning':''}`}>
    <div className="wheel-rotor" ref={rotor}><svg className="wheel-svg" viewBox="0 0 600 600" aria-hidden="true"><defs>{WHEEL_CATEGORIES.map((c,i)=><clipPath id={`sector-${i}`} key={c.id}><path d={sector(i)}/></clipPath>)}</defs>
      <circle cx="300" cy="300" r="299" fill="#f6e3dd"/>
      {WHEEL_CATEGORIES.map((c,i)=><g key={c.id} clipPath={`url(#sector-${i})`}>
        <path d={sector(i)} fill={i%2===0?'#ba7d79':'#e9d2c9'} stroke="#f9eee8" strokeWidth="2"/>
        {i%2===0 && <foreignObject x="0" y="0" width="600" height="600"><CategoryPhoto category={c.id} className="wheel-sector-photo"/></foreignObject>}
        {i%2===0 && <path d={sector(i)} fill="#382324" opacity=".32"/>}
        <g transform={`rotate(${i*60} 300 300)`} fill={i%2===0?'#fff6ee':'#251e20'}>
          <foreignObject x="273" y="75" width="54" height="60"><div className={`sector-icon ${i%2===0?'light':''}`}><Icon name={c.icon} size={42}/></div></foreignObject>
          <text x="300" y="159" textAnchor="middle" fontSize="19" fontFamily="RandomSans">{c.name}</text>
          {!c.enabled && <text x="300" y="178" textAnchor="middle" fontSize="9" opacity=".65" letterSpacing="2">USKORO</text>}
        </g>
      </g>)}
      <circle cx="300" cy="300" r="288" fill="none" stroke="#fff4eb" strokeWidth="5"/>
    </svg></div>
    <div className="wheel-pointer" key={tick}><svg viewBox="0 0 60 66"><path d="M9 4h42q7 0 4 8L35 56q-5 10-10 0L5 12Q2 4 9 4Z" fill="#ae6b69" stroke="#e8c4bc" strokeWidth="4"/></svg></div>
    <button className="spin-hub" onClick={onSpin} disabled={spinning} aria-label={spinning?'Wheel se okreće':'Zavrti wheel'}><strong>{spinning?'SPINNING':'SPIN'}</strong><span>{spinning?'nešto dobro dolazi':'and go'}</span></button>
  </div>;
}
export default function WebExperience() {
  const [entered,setEntered]=useState(rememberedEntry);const [welcomeRendered,setWelcomeRendered]=useState(()=>!rememberedEntry());const [name,setName]=useState('');
  const [studio,setStudio]=useState(location.hash==='#studio');const [scene,setScene]=useState<'home'|'result'>('home');
  const [item,setItem]=useState<ContentRecord|null>(null);const [busy,setBusy]=useState(false);const [active,setActive]=useState(0);const [tick,setTick]=useState(0);
  const [panel,setPanel]=useState<'menu'|'ingredients'|'favorites'|'profile'|'history'|null>(null);const [details,setDetails]=useState(false);const [message,setMessage]=useState('');const [renderedPanel,setRenderedPanel]=useState<typeof panel>(null);const visiblePanel=panel||renderedPanel;
  const [favorites,setFavorites]=useState<ContentRecord[]>([]);const [history,setHistory]=useState<ContentRecord[]>([]);const [published,setPublished]=useState<ContentRecord[]>([]);const [uploadedImage,setUploadedImage]=useState<string|null>(null);
  const [avoidMilk,setAvoidMilk]=useState(false);const [avoidWheat,setAvoidWheat]=useState(false);const [maxMinutes,setMaxMinutes]=useState('');
  const rotor=useRef<HTMLDivElement>(null);const rotation=useRef(0);const animation=useRef(0);const locked=useRef(false);const mounted=useRef(true);const firstSpin=useRef(true);
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;cancelAnimationFrame(animation.current);};},[]);
  useEffect(()=>{const sync=()=>setStudio(location.hash==='#studio');window.addEventListener('hashchange',sync);return()=>window.removeEventListener('hashchange',sync);},[]);
  useEffect(()=>{
    const load=()=>readPreviewCatalog().then(records=>setPublished(records.filter(r=>r.status==='published'&&!publicationIssues(r).length))).catch(()=>{});
    load();window.addEventListener('random-content-updated',load);return()=>window.removeEventListener('random-content-updated',load);
  },[studio]);
  useEffect(()=>{let live=true;let url:string|undefined;setUploadedImage(null);if(item) readPreviewImage(item.image.path).then(blob=>{if(blob&&live){url=URL.createObjectURL(blob);setUploadedImage(url);}}).catch(()=>{});return()=>{live=false;if(url)URL.revokeObjectURL(url);};},[item]);
  useEffect(()=>{if(rotor.current)rotor.current.style.transform=`rotate(${rotation.current}deg)`;},[studio]);
  useEffect(()=>{const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'&&!busy){if(panel)setPanel(null);else if(details)setDetails(false);}};window.addEventListener('keydown',escape);return()=>window.removeEventListener('keydown',escape);},[panel,details,busy]);
  useEffect(()=>{if(!entered)return;const timer=setTimeout(()=>setWelcomeRendered(false),450);return()=>clearTimeout(timer);},[entered]);
  useEffect(()=>{if(panel){setRenderedPanel(panel);return;}const timer=setTimeout(()=>setRenderedPanel(null),220);return()=>clearTimeout(timer);},[panel]);
  function enter(event:React.FormEvent) {event.preventDefault();try{sessionStorage.setItem('random-preview-entered','yes');}catch{}setEntered(true);}
  async function startSpin(target?:'EAT'|'LEARN') {
    if(locked.current)return;
    const minutes=maxMinutes.trim()?Number(maxMinutes):undefined;
    if(minutes!==undefined&&(!Number.isInteger(minutes)||minutes<1||minutes>1440)){setMessage('Unesi vrijeme od 1 do 1440 minuta.');setPanel('profile');return;}
    locked.current=true;setBusy(true);setPanel(null);setMessage('');setDetails(false);
    const selected=target??(firstSpin.current?'EAT':chooseEnabledCategory());firstSpin.current=false;
    const targetIndex=selected==='EAT'?0:5;
    const category=selected==='EAT'?'EAT':'BOOK';
    const current=await readPreviewCatalog().catch(()=>published);
    const records=[...previewCatalog,...current.filter(r=>r.status==='published'&&!publicationIssues(r).length)];
    const eligible=selectRecommendation(records,{category,excludedAllergens:[...(avoidMilk?['milk' as const]:[]),...(avoidWheat?['wheat' as const]:[])],maxMinutes:minutes,excludeIds:history.map(r=>r.id).slice(-200)},()=>history.some(r=>r.category===category)?Math.random():0);
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(scene==='result'){setScene('home');await new Promise(r=>setTimeout(r,reduced?0:340));}
    const from=rotation.current;const to=landingRotation(from,targetIndex,6);const began=performance.now();const duration=reduced?0:4800;
    await new Promise<void>(resolve=>{
      let previous=-1;
      const frame=(now:number)=>{
        if(!mounted.current){resolve();return;}
        const progress=duration?Math.min(1,(now-began)/duration):1;
        rotation.current=from+(to-from)*coast(progress);
        if(rotor.current)rotor.current.style.transform=`rotate(${rotation.current}deg)`;
        const index=sectorAtRotation(rotation.current);if(index!==previous){previous=index;setActive(index);setTick(v=>v+1);}
        if(progress<1)animation.current=requestAnimationFrame(frame);else resolve();
      };animation.current=requestAnimationFrame(frame);
    });
    await new Promise(r=>setTimeout(r,reduced?0:450));
    if(!mounted.current)return;
    setActive(targetIndex);
    if(eligible){setItem(eligible);setHistory(prev=>[...prev,eligible]);setScene('result');}
    else{setItem(null);setMessage('Nema novog izbora za ova ograničenja. Možeš vratiti prethodne prijedloge; tvoja ograničenja ostaju.');}
    locked.current=false;setBusy(false);
  }
  function goHome(){if(busy)return;setScene('home');setPanel(null);setDetails(false);}
  function toggleFavorite(){if(!item)return;setFavorites(prev=>prev.some(r=>r.id===item.id)?prev.filter(r=>r.id!==item.id):[...prev,item]);}
  const saved=!!item&&favorites.some(r=>r.id===item.id);
  if(studio) return <div className="preview-studio-shell"><div className="studio-return"><a href="#"><Icon name="back" size={20}/> Nazad u RANDOM</a><span>Content Studio · lokalni preview</span></div><ContentStudio preview samples={previewCatalog.map(r=>contentSchema.parse(r))}/></div>;
  return <div className="random-world"><div className={`random-card ${entered?'entered':''} ${busy?'spinning':''}`}>
    <div className="card-grain"/>
    <div className="main-stage" inert={!entered||!!visiblePanel} aria-hidden={!entered}>
      <header className={`random-header ${scene==='result'?'result-header':''}`}>
        <button className="icon-button menu-button" aria-label={scene==='home'?'Otvori meni':'Nazad na Home'} disabled={busy} onClick={()=>scene==='home'?setPanel('menu'):goHome()}><Icon name={scene==='home'?'menu':'back'} size={26}/></button>
        {scene==='home'&&<div className="wordmark"><h1>R A N D O M</h1><p>Decide Less. Live More.</p></div>}
        {scene==='result'&&<button className={`icon-button bookmark-button ${saved?'saved':''}`} onClick={toggleFavorite} aria-label={saved?'Ukloni iz sačuvanog':'Sačuvaj preporuku'}><Icon name="bookmark" size={24}/></button>}
      </header>
      <section className={`home-scene scene ${scene==='home'?'scene-visible':''}`} aria-hidden={scene!=='home'}>
        <Wheel rotor={rotor} tick={tick} spinning={busy} onSpin={()=>startSpin()}/>
        <div className="wheel-caption"><span>{busy?'Samo trenutak…':'Tvoj sljedeći mali trenutak.'}</span><p>{busy?WHEEL_CATEGORIES[active].label:'Jedan spin. Jedan dobar izbor.'}</p></div>
      </section>
      <section className={`result-scene scene ${scene==='result'?'scene-visible':''} ${details?'show-details':''}`} aria-hidden={scene!=='result'}>
        {item&&<>
          <div className={`feature-photo ${imageClass(item)}`} role="img" aria-label={item.image.alt} style={uploadedImage?{backgroundImage:`url(${uploadedImage})`}:undefined}/>
          <button className={`favorite-float ${saved?'saved':''}`} aria-label={saved?'Ukloni iz favorita':'Dodaj u favorite'} onClick={toggleFavorite}><Icon name="heart" size={23}/></button>
          <div className="result-copy"><p className="eyebrow">TODAY’S PICK · {item.category==='EAT'?'EAT':'LEARN'}</p><h2 className={item.title.length>18?'long-title':undefined}>{item.category==='EAT'?'Skuhaj':'Pročitaj'}<br/>{item.title}</h2><p className="result-summary">{item.summary}</p>{item.category==='BOOK'&&<p className="book-author">{item.authors.join(', ')}</p>}</div>
          <div className="result-meta">{item.category==='EAT'?<><span><Icon name="clock" size={20}/>{item.totalMinutes} min</span><span><Icon name="chef" size={20}/>Lako</span><span><Icon name="people" size={20}/>{item.servings} osobe</span></>:item.genres.slice(0,3).map(g=><span key={g}>{g}</span>)}</div>
          <div className="result-actions"><button className="pill-primary" disabled={busy} onClick={()=>setDetails(true)}><Icon name={item.category==='EAT'?'food':'book'} size={22}/>{item.category==='EAT'?"LET’S COOK":"PROČITAJ OVU KNJIGU"}<Icon name="arrow" size={21}/></button><button className="spin-again-text" disabled={busy} onClick={()=>startSpin()}><Icon name="refresh" size={17}/> Spin again</button></div>
          <div className="details-screen" inert={!details} aria-hidden={!details}><div className={`detail-photo ${imageClass(item)}`} style={uploadedImage?{backgroundImage:`url(${uploadedImage})`}:undefined}/><div className="detail-heading"><p className="eyebrow">{item.category==='EAT'?'COOK':'KNJIGA'}</p><h2>{item.title}</h2>{item.category==='BOOK'&&<p className="book-author">{item.authors.join(', ')}</p>}{item.category==='EAT'&&<div className="detail-meta"><span><Icon name="clock" size={21}/>{item.totalMinutes} min</span><span><Icon name="chef" size={21}/>Lako</span><button onClick={()=>setPanel('ingredients')}><Icon name="people" size={21}/>{item.servings} osobe · sastojci</button></div>}</div>
            <div className="detail-sheet"><h3>{item.category==='EAT'?'Kratki postupak':'Zašto ova knjiga?'}</h3>{item.category==='EAT'?item.steps.map((step,i)=><div className="recipe-step" key={i}><span>{i+1}</span><p>{step}</p></div>):<><p className="reading-reason">{item.recommendationReason}</p><div className="genre-tags">{item.genres.map(g=><span key={g}>{g}</span>)}</div><p className="illustration-note">Urednička ilustracija, nije stvarna naslovnica.</p></>}
              <div className="detail-controls"><button className="icon-button" onClick={()=>setDetails(false)} aria-label="Zatvori detalje"><Icon name="close" size={25}/></button><button className="pill-primary" onClick={()=>item.category==='EAT'?setPanel('ingredients'):setDetails(false)}><Icon name={item.category==='EAT'?'food':'book'} size={21}/>{item.category==='EAT'?'SASTOJCI':'MOJ IZBOR'}</button><button className="icon-button" onClick={toggleFavorite} aria-label="Sačuvaj izbor"><Icon name="bookmark" size={23}/></button></div>
            </div>
          </div>
        </>}
      </section>
      <nav className="bottom-nav" aria-label="Glavna navigacija"><button className={scene==='home'?'active':''} onClick={goHome} disabled={busy} aria-label="Home"><Icon name="home" size={21}/><span>Home</span></button><button onClick={()=>setPanel('favorites')} disabled={busy} aria-label="Favoriti"><Icon name="heart" size={23}/></button><button onClick={()=>setPanel('history')} disabled={busy} aria-label="Historija spinova"><Icon name="chart" size={23}/></button><button onClick={()=>setPanel('profile')} disabled={busy} aria-label="Profil i ograničenja"><Icon name="profile" size={23}/></button></nav>
      {!!message&&<div className="empty-notice" role="status"><p>{message}</p><button onClick={()=>{setHistory([]);setMessage('');}}>Vrati prethodne prijedloge</button></div>}
    </div>
    <aside className="category-rail" inert={!entered||!!visiblePanel} aria-hidden={!entered}><button className="rail-close" disabled={busy} aria-label="Vrati se na wheel" onClick={goHome}><Icon name="close" size={26}/></button><p className="your-spin">Your<br/>spin</p><div className="rail-categories">{WHEEL_CATEGORIES.map((c,i)=><button key={c.id} className={`rail-category ${active===i?'selected':''} ${c.enabled?'enabled':'coming-soon'}`} aria-label={`${c.id}${c.enabled?'':' — uskoro'}`} aria-pressed={active===i} disabled={busy||!c.enabled} onClick={()=>startSpin(c.id as 'EAT'|'LEARN')}><CategoryPhoto category={c.id}/><span className="rail-icon"><Icon name={c.icon} size={15}/></span><span className="rail-label">{c.name}</span>{!c.enabled&&<span className="soon-dot" title="Uskoro"/>}</button>)}</div><button className="rail-respin" onClick={()=>startSpin()} disabled={busy} aria-label="Spin again"><span><Icon name="refresh" size={25}/></span><small>Spin again</small></button><a className={`studio-link ${busy?'disabled':''}`} href="#studio" aria-label="Otvori Content Studio" onClick={e=>{if(busy)e.preventDefault();}}><Icon name="home" size={17}/><small>Studio</small></a></aside>
    {visiblePanel&&<div className={`panel-scrim ${!panel?'panel-closing':''}`} onClick={()=>setPanel(null)}><section className={`floating-panel ${visiblePanel==='ingredients'?'ingredient-panel':''}`} role="dialog" aria-modal="true" aria-hidden={!panel} aria-label={visiblePanel==='ingredients'?'Sastojci':visiblePanel==='profile'?'Tvoj profil':'RANDOM meni'} onClick={e=>e.stopPropagation()}><button className="panel-close" onClick={()=>setPanel(null)} aria-label="Zatvori panel"><Icon name="close" size={25}/></button>
      {visiblePanel==='ingredients'&&item?.category==='EAT'&&<><h3>Sastojci</h3><p>Za {item.servings} osobe</p><div className="ingredients">{item.ingredients.map((ingredient,i)=><div key={i}><span className="ingredient-symbol" style={ingredientPositions[ingredient.name]!==undefined?{backgroundPosition:`${(ingredientPositions[ingredient.name]%2)*100}% ${Math.floor(ingredientPositions[ingredient.name]/2)*100/3}%`}:{backgroundImage:'none'}}>{ingredientPositions[ingredient.name]===undefined?<Icon name="food" size={22}/>:null}</span><div><strong>{ingredient.name}</strong><small>{ingredient.quantity} {ingredient.unit}</small></div></div>)}</div><p className="allergen-note">Alergeni: {item.allergens.join(', ')||'nema evidentiranih'}. Provjeri sastojke i pakovanja.</p></>}
      {visiblePanel==='menu'&&<><p className="eyebrow">RANDOM</p><h3>Decide less.<br/>Live more.</h3><button className="panel-menu-item" onClick={()=>setPanel('profile')}><Icon name="profile"/>Moj profil</button><button className="panel-menu-item" onClick={()=>setPanel('favorites')}><Icon name="heart"/>Sačuvani izbori</button><a className="panel-menu-item" href="#studio"><Icon name="home"/>Content Studio <Icon name="arrow" size={18}/></a><p className="panel-note">Interaktivni demo. Samo EAT i LEARN su aktivni.</p></>}
      {visiblePanel==='profile'&&<><p className="eyebrow">TVOJ IZBOR</p><h3>{name?`Zdravo, ${name}.`:'Nešto baš za tebe.'}</h3><p className="panel-note">Probni profil na ovom uređaju. Nema registracije ni slanja ličnih podataka.</p><label className="preference-check"><input type="checkbox" checked={avoidMilk} onChange={e=>setAvoidMilk(e.target.checked)}/>Bez mlijeka</label><label className="preference-check"><input type="checkbox" checked={avoidWheat} onChange={e=>setAvoidWheat(e.target.checked)}/>Bez pšenice</label><label className="minutes-field">Vrijeme za kuhanje<input type="number" min="1" max="1440" placeholder="npr. 45 minuta" value={maxMinutes} onChange={e=>setMaxMinutes(e.target.value)}/></label><button className="pill-primary" onClick={()=>{setPanel(null);setScene('home');setItem(null);setHistory([]);}}>SAČUVAJ IZBOR</button></>}
      {(visiblePanel==='favorites'||visiblePanel==='history')&&<><p className="eyebrow">TVOJI TRENUTCI</p><h3>{visiblePanel==='favorites'?'Sačuvaj ono dobro.':'Tvoji dosadašnji izbori.'}</h3>{(visiblePanel==='favorites'?favorites:history).length?(visiblePanel==='favorites'?favorites:history).map((r,i)=><button className="saved-item" key={`${r.id}-${i}`} onClick={()=>{setItem(r);setScene('result');setDetails(false);setPanel(null);setActive(r.category==='EAT'?0:5);}}><span className={`saved-photo ${imageClass(r)}`}/><span><small>{r.category==='EAT'?'EAT':'LEARN'}</small><strong>{r.title}</strong></span><Icon name="arrow" size={18}/></button>):<p className="panel-note">Još nema izbora. Zavrtimo nešto dobro.</p>}</>}
    </section></div>}
    {welcomeRendered&&<section className={`welcome-screen ${entered?'welcome-leaving':''}`} role="dialog" aria-modal="true" aria-label="Probni ulaz u RANDOM"><div className="welcome-photo photo-reading"/><div className="welcome-copy"><p className="welcome-brand">R A N D O M</p><h2>Decide less.<br/><em>Live more.</em></h2><p>Malo manje razmišljanja.<br/>Malo više dobrih trenutaka.</p><form onSubmit={enter}><label>Kako da te zovemo?<input value={name} maxLength={40} onChange={e=>setName(e.target.value)} placeholder="Tvoje ime (opcionalno)" autoComplete="off"/></label><button className="pill-primary" type="submit">UĐI U RANDOM <Icon name="arrow" size={21}/></button></form><small>Probni pristup · bez registracije</small><a href="#studio">Content Studio</a></div></section>}
  </div><p className="preview-footer">RANDOM · demo 0.2 · interaktivni preview <span>Fotografije su generisane uredničke ilustracije.</span></p></div>;
}
