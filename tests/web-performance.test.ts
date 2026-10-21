import{afterEach,expect,it,vi}from'vitest';
afterEach(()=>{vi.unstubAllGlobals();vi.resetModules();});
it('restores only safe bounded diagnostics across reloads and records motion preference at boot',async()=>{
 const data=new Map<string,string>();const storage={getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v);}};
 vi.stubGlobal('sessionStorage',storage);vi.stubGlobal('window',{matchMedia:()=>({matches:true}),addEventListener:vi.fn()});vi.stubGlobal('innerWidth',375);vi.stubGlobal('innerHeight',667);
 let mod=await import('../apps/client/src/web/performance');mod.installPerformance();mod.performanceEvent('spin_requested',{reduced:1,locked:0,targeted:1});
 const saved=JSON.parse([...data.values()][0]);expect(saved.some((e:any)=>e.name==='web_boot'&&e.metrics.reduced===1)).toBe(true);expect(saved.at(-1)).toMatchObject({name:'spin_requested',metrics:{reduced:1,locked:0,targeted:1}});
 vi.resetModules();mod=await import('../apps/client/src/web/performance');mod.performanceEvent('spin_stage',{stage:1});expect(JSON.parse([...data.values()][0]).filter((e:any)=>e.name==='spin_requested')).toHaveLength(1);
});
it('diagnostics still work when browser storage is blocked',async()=>{
 vi.stubGlobal('sessionStorage',{getItem:()=>{throw Error('blocked');},setItem:()=>{throw Error('blocked');}});
 const mod=await import('../apps/client/src/web/performance');expect(()=>mod.performanceEvent('spin_requested',{reduced:0})).not.toThrow();
});
