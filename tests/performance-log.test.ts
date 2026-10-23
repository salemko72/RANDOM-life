import {expect,it} from 'vitest';
import {PerformanceLog,parsePerformanceMessage} from '../apps/client/src/native/performance-log';
it('keeps a bounded report and accepts only numeric diagnostic metrics',()=>{
 const log=new PerformanceLog();for(let i=0;i<300;i++)log.add({name:'spin',at:i,metrics:{durationMs:i}});
 expect(log.rows).toHaveLength(80);
 expect(parsePerformanceMessage(JSON.stringify({type:'random-life.performance.v1',name:'spin',at:4,metrics:{durationMs:50,name:'private name',token:'secret',bad:Infinity}}))).toEqual({name:'spin',at:4,metrics:{durationMs:50}});
 expect(parsePerformanceMessage('{')).toBeNull();expect(parsePerformanceMessage(JSON.stringify({type:'random-life.performance.v1',name:'private route',at:0,metrics:{}}))).toBeNull();
 const restored=new PerformanceLog(JSON.stringify(log.rows));expect(restored.rows).toEqual(log.rows);
});

it('reports slow frames without claiming a frame rate for hidden or reduced-motion runs',async()=>{
 const {summarizeFrames}=await import('../apps/client/src/web/performance');
 expect(summarizeFrames([16,17,50,100],true,false,4800)).toEqual({durationMs:4800,frames:4,p95Ms:100,maxMs:100,slowFrames:2,hidden:1,reduced:0});
 expect(summarizeFrames([],false,true,0)).toMatchObject({frames:0,maxMs:0,p95Ms:0,reduced:1});
});

it('preserves Spotify lifecycle numbers without retaining SDK messages, tokens or device IDs',()=>{
 const event=parsePerformanceMessage(JSON.stringify({type:'random-life.performance.v1',name:'spotify_player',at:2,metrics:{source:1,stage:5,paused:1,positionMs:450,token:'private',message:'private account',device_id:'private'}}));expect(event).toEqual({name:'spotify_player',at:2,metrics:{source:1,stage:5,paused:1,positionMs:450}});
});
