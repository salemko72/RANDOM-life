import React,{createContext,useContext,useEffect,useState}from'react';
import{resolveUnitSystem,type UnitPreference,type UnitSystem,type Locale}from'@random/shared';
import{preferredDeviceLanguages}from'./device-language';
import{uiText}from'./ui-copy';
// Prefix already accepted by older native bridges: downgrades retain the snapshot.
export const UNIT_PREFERENCE_KEY='random-life.experience.units.v1';
export function readUnitPreference(storage:{getItem:(key:string)=>string|null}):UnitPreference{
 try{const x=storage.getItem(UNIT_PREFERENCE_KEY);return x==='metric'||x==='us'?x:'auto';}catch{return'auto';}
}
function deviceSystem():UnitSystem{
 const w=window as unknown as{__lifespinnerRegionalSettings?:unknown;__lifespinnerDeviceLanguages?:unknown};
 return resolveUnitSystem('auto',w.__lifespinnerRegionalSettings,preferredDeviceLanguages(w.__lifespinnerDeviceLanguages,navigator));
}
const Context=createContext<{preference:UnitPreference;system:UnitSystem;setPreference:(next:UnitPreference)=>void}>({preference:'auto',system:'metric',setPreference:()=>{}});
export function MeasurementProvider({children}:{children:React.ReactNode}){
 const[preference,setPreference]=useState<UnitPreference>(()=>{try{return readUnitPreference(localStorage);}catch{return'auto';}});
 const[automatic,setAutomatic]=useState<UnitSystem>(deviceSystem);
 useEffect(()=>{const update=()=>setAutomatic(deviceSystem());window.addEventListener('lifespinner.regionchange',update);window.addEventListener('languagechange',update);return()=>{window.removeEventListener('lifespinner.regionchange',update);window.removeEventListener('languagechange',update);};},[]);
 useEffect(()=>{try{localStorage.setItem(UNIT_PREFERENCE_KEY,preference);}catch{}},[preference]);
 return <Context.Provider value={{preference,system:preference==='auto'?automatic:preference,setPreference}}>{children}</Context.Provider>;
}
export const useMeasurements=()=>useContext(Context);
export function UnitChooser({locale}:{locale:Locale}){
 const{preference,system,setPreference}=useMeasurements();
 const labels:{code:UnitPreference;label:string}[]=[{code:'auto',label:uiText('Automatic','Automatski',locale)},{code:'metric',label:uiText('Metric (g, ml, °C)','Metrički (g, ml, °C)',locale)},{code:'us',label:uiText('US (oz, fl oz, °F)','US (oz, fl oz, °F)',locale)}];
 return <div className="unit-settings"><p className="eyebrow">{uiText('Measurement units','Mjerne jedinice',locale)}</p><div className="language-chooser unit-chooser" role="group" aria-label={uiText('Measurement units','Mjerne jedinice',locale)}>{labels.map(({code,label})=><button type="button" key={code} data-unit-choice={code} aria-pressed={preference===code} onClick={()=>setPreference(code)}>{label}{code==='auto'&&preference==='auto'?` · ${system==='metric'?'g / ml':'oz / fl oz'}`:''}</button>)}</div><p className="panel-note units-note">{uiText('Measures with an unspecified size keep their original units.','Mjere bez navedene veličine zadržavaju izvorne jedinice.',locale)}</p></div>;
}
