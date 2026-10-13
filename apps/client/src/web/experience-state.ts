export interface ExperienceState{history:string[];seen:string[];favorites:string[]}
export function loadExperience(id:string):ExperienceState{
 try{const value=JSON.parse(localStorage.getItem('random-life.experience.'+id)??'{}');const safe=(x:unknown):string[]=>Array.isArray(x)?x.filter(v=>typeof v==='string'&&v.length<200).slice(-200):[];return{history:safe(value.history),seen:safe(value.seen),favorites:safe(value.favorites)};}catch{return{history:[],seen:[],favorites:[]};}
}
export function saveExperience(id:string,state:ExperienceState){try{localStorage.setItem('random-life.experience.'+id,JSON.stringify({history:state.history.slice(-200),seen:state.seen.slice(-200),favorites:state.favorites.slice(-200)}));return true;}catch{return false;}}
