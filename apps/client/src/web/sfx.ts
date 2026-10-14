export const SFX_KEY='random-life.sfx.v1';
export function loadSfx(){try{return localStorage.getItem(SFX_KEY)!=='off';}catch{return true;}}
/** Original synthesized UI sounds; no downloaded recordings or audio dependencies. */
export class InterfaceSfx{
 private context:AudioContext|undefined;private enabled=true;private lastTick=-Infinity;private disposed=false;
 setEnabled(value:boolean){this.enabled=value;try{localStorage.setItem(SFX_KEY,value?'on':'off');}catch{}if(!value)this.pause();}
 async unlock(){if(!this.enabled||this.disposed||document.visibilityState==='hidden')return;try{const Constructor=window.AudioContext??(window as any).webkitAudioContext;if(!Constructor)return;this.context??=new Constructor();if(this.context!.state==='suspended')await this.context!.resume();}catch{/* Silent fallback on devices without audio access. */}}
 pause(){if(this.context?.state==='running')void this.context.suspend().catch(()=>{});}
 dispose(){this.disposed=true;if(this.context)void this.context.close().catch(()=>{});}
 private tone(frequency:number,duration:number,volume:number,type:OscillatorType='sine',delay=0){const c=this.context;if(!this.enabled||this.disposed||!c||c.state!=='running'||document.visibilityState==='hidden')return;try{const t=c.currentTime+delay,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(frequency,t);o.frequency.exponentialRampToValueAtTime(frequency*.65,t+duration);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(volume,t+.003);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+duration+.01);o.onended=()=>{o.disconnect();g.disconnect();};}catch{}}
 click(){this.tone(650,.035,.035,'sine');}
 tick(){const now=performance.now();if(now-this.lastTick<35)return;this.lastTick=now;this.tone(1050,.023,.035,'triangle');}
 finish(){this.tone(523,.18,.05);this.tone(784,.22,.035,'sine',.09);}
 save(){this.tone(660,.12,.035);this.tone(880,.15,.03,'sine',.065);}
}
