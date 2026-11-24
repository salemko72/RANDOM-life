import React,{useEffect,useRef}from'react';

/** The navigation stays outside this scrolling surface. No React render per scroll frame. */
export default function DetailScrollSurface({active,children}:{active:boolean;children:React.ReactNode}){
 const surface=useRef<HTMLDivElement>(null),fade=useRef<HTMLDivElement>(null),guard=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const el=surface.current;if(!el)return;
  const update=()=>{
   const progress=active?Math.max(0,Math.min(1,el.scrollTop/48)):0;
   if(fade.current)fade.current.style.opacity=String(progress);
   // Masked/faded controls still receive taps unless a layer intercepts this zone.
   if(guard.current)guard.current.style.pointerEvents=progress>0?'auto':'none';
  };
  update();el.addEventListener('scroll',update,{passive:true});
  return()=>el.removeEventListener('scroll',update);
 },[active]);
 return <><div ref={surface} className="details-screen" inert={!active} aria-hidden={!active}>{children}</div><div ref={fade} className="detail-top-fade" aria-hidden="true"/><div ref={guard} className="detail-top-guard" aria-hidden="true"/></>;
}
