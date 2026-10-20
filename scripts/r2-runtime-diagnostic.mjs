// Short-lived read-only runtime observation. Never persists request headers, cookies,
// payloads, full log messages, websocket URLs or credentials.
import fs from'node:fs/promises';import path from'node:path';import{fileURLToPath}from'node:url';import WebSocket from'ws';
const account=process.env.CLOUDFLARE_ACCOUNT_ID,base=`https://api.cloudflare.com/client/v4/accounts/${account}/pages/projects/random-life-preview/deployments`,headers={Authorization:`Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,'Content-Type':'application/json'},dir=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../r2-handoff'),report=[];
const current=JSON.parse(await fs.readFile(path.join(dir,'cloud-final-verification.json'))).deployment;
for(const[id,origin,route]of[['ea061935-e85f-4179-bce5-eba8e80d7f55','https://ea061935.random-life-preview.pages.dev','/api/catalog'],[current.id,current.url,'/api/catalog/manifest'],[current.id,current.url,'/api/catalog']]){
 const r=await fetch(base+'/'+id+'/tails',{method:'POST',headers,body:JSON.stringify({filters:[]})}),j=await r.json();if(!j.success){report.push({deployment:id,tailAvailable:false,status:r.status,errorCodes:j.errors?.map(e=>e.code)});continue;}
 const tail=j.result,events=[];let socket;
 try{
  socket=new WebSocket(tail.url,'trace-v1',{headers:{'User-Agent':'LifeSpinner-runtime-diagnostic'}});
  await new Promise((resolve,reject)=>{socket.once('open',resolve);socket.once('error',()=>reject(Error('Runtime observation websocket unavailable')));setTimeout(()=>reject(Error('Runtime observation timeout')),10000).unref();});socket.send(JSON.stringify({debug:false}),{binary:false,compress:false,mask:false,fin:true});await new Promise(r=>setTimeout(r,1000));
  socket.on('message',raw=>{try{const e=JSON.parse(raw.toString());events.push({outcome:e.outcome,eventTimestamp:e.eventTimestamp,cpuTime:e.cpuTime,cpuTimeMs:e.cpuTimeMs,wallTime:e.wallTime,wallTimeMs:e.wallTimeMs,exceptionNames:e.exceptions?.map(x=>x.name),topLevelKeys:Object.keys(e)});}catch{}});
  const start=performance.now();let response;for(let attempt=0;attempt<3;attempt++){try{response=await fetch(origin+route,{signal:AbortSignal.timeout(20000)});await response.arrayBuffer();break;}catch(e){if(attempt===2)throw e;}}await new Promise(r=>setTimeout(r,12000));report.push({deployment:id,route,httpStatus:response.status,elapsedWallMs:Math.round(performance.now()-start-12000),events});
 }catch(e){report.push({deployment:id,observationError:e.message});}
 finally{socket?.terminate();await fetch(base+'/'+id+'/tails/'+tail.id,{method:'DELETE',headers});}
}
await fs.writeFile(path.join(dir,'runtime-diagnostic.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
