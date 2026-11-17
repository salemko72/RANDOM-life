export type AdEvent='ready'|'spin'|'home'|'busy'|'privacy';
export type AdMessage={event:AdEvent;seq:number};
export function parseAdMessage(raw:string):AdMessage|null{
 if(raw.length>180)return null;
 try{const m=JSON.parse(raw);if(!m||Object.keys(m).sort().join(',')!=='event,seq,type'||m.type!=='lifespinner.ads.v1'||!['ready','spin','home','busy','privacy'].includes(m.event)||!Number.isSafeInteger(m.seq)||m.seq<1)return null;return{event:m.event,seq:m.seq};}catch{return null;}
}
type Saved={spins:number;activeMs:number;shownAt:number[]};
export class AdPolicy{
 private state:Saved={spins:0,activeMs:0,shownAt:[]};private active=false;private uiReady=false;private at:number;
 constructor(raw:string|null,now:number){this.at=now;try{const s=JSON.parse(raw??'null');if(s&&Number.isSafeInteger(s.spins)&&s.spins>=0&&Number.isFinite(s.activeMs)&&s.activeMs>=0&&Array.isArray(s.shownAt)&&s.shownAt.length<=3&&s.shownAt.every((n:unknown)=>typeof n==='number'&&Number.isFinite(n)&&n>=0))this.state={spins:Math.min(6,s.spins),activeMs:Math.min(120000,s.activeMs),shownAt:s.shownAt};}catch{}}
 private tick(now:number){if(this.active&&this.uiReady)this.state.activeMs=Math.min(120000,this.state.activeMs+Math.max(0,now-this.at));this.at=now;}
 setActive(active:boolean,now:number){this.tick(now);this.active=active;}
 ready(now:number){this.tick(now);this.uiReady=true;}
 spin(now:number){this.tick(now);if(this.active&&this.uiReady)this.state.spins=Math.min(6,this.state.spins+1);}
 eligible(now:number){this.tick(now);const times=this.state.shownAt;return this.active&&this.uiReady&&this.state.spins>=6&&this.state.activeMs>=120000&&times.filter(t=>now-t<1800000).length<3&&times.every(t=>now-t>=180000);}
 reserve(now:number){this.tick(now);this.state.spins=0;this.state.shownAt=[...this.state.shownAt.filter(t=>now-t<1800000),now].slice(-3);}
 serialize(now:number){this.tick(now);return JSON.stringify(this.state);}
}
