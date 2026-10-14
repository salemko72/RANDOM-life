import{createServer}from'node:http';
import{readFile}from'node:fs/promises';
import{chromium}from'playwright-core';
import assert from'node:assert/strict';
import{enterDemo}from'./browser-helpers.mjs';
const html=await readFile('apps/client/preview-dist/RANDOM_INTERACTIVE_PREVIEW.html');
const server=createServer((req,res)=>{if(req.url.startsWith('/api/')){res.setHeader('Content-Type','application/json');res.end('{"items":[]}');}else{res.setHeader('Content-Type','text/html');res.end(html);}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try{for(const locale of ['en','bs'])for(const viewport of [{width:390,height:720},{width:402,height:760},{width:430,height:900}]){const page=await browser.newPage({viewport,isMobile:true,hasTouch:true,reducedMotion:'reduce'});await page.goto('http://127.0.0.1:'+server.address().port);await enterDemo(page,'Circle QA',locale);await page.waitForTimeout(400);const boxes=await page.locator('.rail-category>.category-photo').evaluateAll(nodes=>nodes.map(n=>{const b=n.getBoundingClientRect();return {width:b.width,height:b.height}}));assert.equal(boxes.length,5);for(const b of boxes)assert(Math.abs(b.width-b.height)<0.1,`Ellipse ${locale} ${viewport.width}: ${JSON.stringify(b)}`);const last=await page.locator('.rail-category').last().boundingBox(),spin=await page.locator('.rail-respin').boundingBox();assert(last.y+last.height<=spin.y+1,'Categories overlap spin control');await page.close();}console.log('PASS circular category photos and no rail overlap at three phone sizes in ENG/BHS.');}finally{await browser.close();await new Promise(r=>server.close(r));}
