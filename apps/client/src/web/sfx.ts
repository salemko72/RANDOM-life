export const SFX_KEY='random-life.sfx.v1';
export function loadSfx(){try{return localStorage.getItem(SFX_KEY)!=='off';}catch{return true;}}
/** Original synthesized UI sounds; no downloaded recordings or audio dependencies. */
export class InterfaceSfx{
 private context:AudioContext|undefined;private enabled=true;private lastTick=-Infinity;private disposed=false;private welcomePlayed=false;private wheelSource:AudioBufferSourceNode|undefined;
 setEnabled(value:boolean){this.enabled=value;try{localStorage.setItem(SFX_KEY,value?'on':'off');}catch{}if(!value)this.pause();}
 async unlock(){if(!this.enabled||this.disposed||document.visibilityState==='hidden')return;try{const Constructor=window.AudioContext??(window as any).webkitAudioContext;if(!Constructor)return;this.context??=new Constructor();if(this.context!.state==='suspended')await this.context!.resume();}catch{/* Silent fallback on devices without audio access. */}}
 pause(){this.stopWheel();if(this.context?.state==='running')void this.context.suspend().catch(()=>{});}
 dispose(){this.stopWheel();this.disposed=true;if(this.context)void this.context.close().catch(()=>{});}
 private tone(frequency:number,duration:number,volume:number,type:OscillatorType='sine',delay=0,glide=true){const c=this.context;if(!this.enabled||this.disposed||!c||c.state!=='running'||document.visibilityState==='hidden')return;try{const t=c.currentTime+delay,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(frequency,t);if(glide)o.frequency.exponentialRampToValueAtTime(frequency*.65,t+duration);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.min(.15,volume*1.5),t+(glide?.003:.025));g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+duration+.01);o.onended=()=>{o.disconnect();g.disconnect();};}catch{}}
 click(){this.tone(650,.035,.035,'sine');}
 tick(){const now=performance.now();if(now-this.lastTick<35)return;this.lastTick=now;this.tone(1050,.023,.035,'triangle');}
 welcome(){if(this.welcomePlayed||!this.enabled||this.context?.state!=='running')return;this.welcomePlayed=true;[349.23,440,523.25,659.25].forEach((frequency,i)=>this.tone(frequency,1.7,.045,'sine',i*.24,false));}
 private stopWheel(){if(this.wheelSource){try{this.wheelSource.stop();}catch{}this.wheelSource=undefined;}}
 spin(durationMs:number){const c=this.context;if(!this.enabled||!c||c.state!=='running'||durationMs<=0||document.visibilityState==='hidden')return;this.stopWheel();try{const duration=durationMs/1000,buffer=c.createBuffer(1,Math.ceil(c.sampleRate*duration),c.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;const source=c.createBufferSource(),filter=c.createBiquadFilter(),gain=c.createGain(),t=c.currentTime;source.buffer=buffer;filter.type='bandpass';filter.Q.value=.6;filter.frequency.setValueAtTime(950,t);filter.frequency.exponentialRampToValueAtTime(180,t+duration);gain.gain.setValueAtTime(.0001,t);gain.gain.linearRampToValueAtTime(.0405,t+.08);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);source.connect(filter);filter.connect(gain);gain.connect(c.destination);this.wheelSource=source;source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();if(this.wheelSource===source)this.wheelSource=undefined;};source.start(t);source.stop(t+duration);}catch{}}
 finish(){this.stopWheel();this.tone(523,.18,.05);this.tone(784,.22,.035,'sine',.09);}
 save(){this.tone(660,.12,.035);this.tone(880,.15,.03,'sine',.065);}
}
