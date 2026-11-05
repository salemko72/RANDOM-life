// Rank references to already approved records. Never manufacture dietary labels.
export const reserveFoodRequirements=[
 {name:'reviewed low phosphate',minimum:7,test:r=>r.dietaryTags.includes('low-phosphate')&&r.phosphateAssessment?.reviewed===true&&r.phosphateAssessment.suitability==='low'},
 {name:'vegan',minimum:7,test:r=>r.dietaryTags.includes('vegan')},
 {name:'gluten + lactose free',minimum:3,test:r=>r.dietaryTags.includes('gluten-free')&&r.dietaryTags.includes('lactose-free')},
 {name:'lactose free',minimum:7,test:r=>r.dietaryTags.includes('lactose-free')}
];
export function prioritizeReserveFood(rows,previousIds=[]){
 const previous=new Set(previousIds),selected=[];
 function missing(q){return Math.max(0,q.minimum-selected.filter(q.test).length);}
 for(const q of reserveFoodRequirements){while(missing(q)>0){const candidates=rows.filter(r=>!selected.includes(r)&&q.test(r));candidates.sort((a,b)=>{
  const score=r=>reserveFoodRequirements.reduce((n,rule)=>n+(missing(rule)>0&&rule.test(r)?1:0),0);
  return score(b)-score(a)||Number(previous.has(b.id))-Number(previous.has(a.id))||a.id.localeCompare(b.id);
 });if(!candidates.length)throw Error('Not enough approved recipes for '+q.name);selected.push(candidates[0]);if(selected.length>20)throw Error('Dietary coverage does not fit 20 recipes');}}
 const rest=rows.filter(r=>!selected.includes(r)).sort((a,b)=>Number(previous.has(b.id))-Number(previous.has(a.id))||a.id.localeCompare(b.id));return[...selected,...rest];
}
export function assertReserveFoodCoverage(rows){for(const q of reserveFoodRequirements)if(rows.filter(q.test).length<q.minimum)throw Error('Reserve lacks '+q.name);}
