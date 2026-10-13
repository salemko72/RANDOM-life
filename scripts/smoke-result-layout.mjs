import {enterDemo} from './browser-helpers.mjs';
import {chromium} from 'playwright-core';import{createServer}from'node:http';import{readFile}from'node:fs/promises';import assert from 'node:assert/strict';
const html=await readFile('apps/client/preview-dist/RANDOM_INTERACTIVE_PREVIEW.html');const s=createServer((q,r)=>{r.setHeader('Content-Type','text/html');r.end(html)});await new Promise(r=>s.listen(0,'127.0.0.1',r));const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try{for(const viewport of [{width:390,height:844},{width:390,height:740},{width:751,height:892},{width:1280,height:1080}]){
const p=await b.newPage({viewport,reducedMotion:'reduce'});await p.goto('http://127.0.0.1:'+s.address().port);await p.evaluate(()=>document.fonts.ready);await enterDemo(p);
for(const category of ['EAT','READ','WATCH','MOVE','GO'])for(let n=0;n<(category==='MOVE'?6:category==='GO'?4:5);n++){
const old=await p.evaluate(()=>document.querySelector('.result-copy h2')?.textContent??null);await p.getByRole('button',{name:category,exact:true}).click();await p.waitForFunction(old=>{const e=document.querySelector('.result-scene.scene-visible .result-copy h2');return e&&e.textContent!==old},old);
const geometry=await p.evaluate(()=>{const rect=q=>document.querySelector(q).getBoundingClientRect();const title=rect('.result-copy h2'),meta=rect('.result-meta'),copy=rect('.result-copy'),actions=rect('.result-actions');const pills=[...document.querySelectorAll('.result-meta>span')].map(e=>e.getBoundingClientRect());return{title:document.querySelector('.result-copy h2').textContent,rightOfTitle:meta.left>=title.right+7,copyBottom:copy.bottom,actionsTop:actions.top,vertical:pills.every((r,i)=>!i||r.top>=pills[i-1].bottom+5),overflow:document.documentElement.scrollWidth>innerWidth};});
assert(geometry.rightOfTitle,JSON.stringify(geometry));assert(geometry.vertical,JSON.stringify(geometry));assert(!geometry.overflow,JSON.stringify(geometry));assert(geometry.copyBottom<=geometry.actionsTop-5,JSON.stringify({viewport,...geometry}));
if(geometry.title.includes('musaka'))await p.screenshot({path:`/workspace/shared/RANDOM_LAYOUT_${viewport.width}_${viewport.height}.png`});
}await p.close();console.log('PASS title/badge/description geometry at '+viewport.width+'x'+viewport.height);}
}finally{await b.close();await new Promise(r=>s.close(r));}
