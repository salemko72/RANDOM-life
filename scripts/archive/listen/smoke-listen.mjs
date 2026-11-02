import{build}from'esbuild';import{createServer}from'node:http';import{readFile,mkdir}from'node:fs/promises';import{chromium}from'playwright-core';import assert from'node:assert/strict';
const b=await build({stdin:{contents:"export {createProfile} from './apps/client/src/web/preferences';export {listenPlaylists} from './apps/client/src/web/listen-catalog';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',write:false});
const{createProfile,listenPlaylists}=await import('data:text/javascript;base64,'+Buffer.from(b.outputFiles[0].contents).toString('base64'));
const html=await readFile('apps/client/preview-dist/RANDOM_INTERACTIVE_PREVIEW.html');
const server=createServer((req,res)=>{if(req.url.startsWith('/api/'))res.writeHead(503).end();else res.writeHead(200,{'Content-Type':'text/html'}).end(html);});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});await mkdir('/workspace/shared/listen-preview',{recursive:true});
const sdk=`window.__spotifyCalls=[];window.onSpotifyIframeApiReady({createController(node,options,callback){
 const frame=document.createElement('iframe');frame.title='Spotify mock';frame.allow='autoplay; encrypted-media';let uri=options.uri;
 const sync=()=>frame.src='https://open.spotify.com/embed/'+uri.split(':').slice(1).join('/');sync();node.replaceWith(frame);const listeners={};
 const controller={loadUri(next){uri=next;sync();window.__spotifyCalls.push({action:'load',uri});},play(){window.__spotifyCalls.push({action:'play',uri});listeners.playback_update?.({data:{isPaused:false}});},pause(){window.__spotifyCalls.push({action:'pause',uri});listeners.playback_update?.({data:{isPaused:true}});},addListener(n,fn){listeners[n]=fn;},destroy(){window.__spotifyCalls.push({action:'destroy',uri});frame.remove();}};callback(controller);listeners.ready?.();listeners.ready?.();
}});`;
const playlistFor=src=>listenPlaylists.find(p=>src.includes('/playlist/'+p.id));
try{
 for(const[locale,width,height]of[['bs',320,568],['en',390,844]]){
  const en=locale==='en',page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  await page.route('https://open.spotify.com/**',r=>r.fulfill({status:200,contentType:r.request().url().includes('iframe-api')?'text/javascript':'text/html',body:r.request().url().includes('iframe-api')?sdk:'<p>Spotify transport mock</p>'}));
  await page.addInitScript(({p,locale})=>{localStorage.setItem('random-life.local-profile.v1',JSON.stringify(p));localStorage.setItem('random-life.locale.v1',locale);navigator.share=async x=>window.__shared=x;},{p:{...createProfile(),onboarded:true},locale});
  await page.goto('http://127.0.0.1:'+server.address().port);
  const listen=page.getByRole('button',{name:en?'LISTEN':'SLUŠAJ',exact:true});await listen.waitFor();assert.equal(await page.locator('.wheel-sector-control').count(),6);await listen.click();
  const frame=page.locator('.listen-card iframe');await frame.waitFor();assert.equal(playlistFor(await frame.getAttribute('src'))?.mood,'calm');await frame.evaluate(e=>e.dataset.instance='original');
  assert.equal(await page.evaluate(()=>window.__spotifyCalls.filter(x=>x.action==='play').length),1,'repeated embed ready must not restart playback');
  for(const[mood,label]of [['energy',en?'Energy':'Energija'],['classics',en?'Feel-good classics':'Feel-good klasici'],['upbeat',en?'Upbeat':'Vedro i ritmično'],['mellow',en?'A little wistful':'Lagano sjetno'],['calm',en?'Ambient & chill':'Ambijent i chill']]){
   await page.getByRole('button',{name:en?'Different vibe?':'Drugačiji vibe?',exact:true}).click();await page.getByRole('button',{name:label,exact:true}).click();
   assert.equal(playlistFor(await frame.getAttribute('src'))?.mood,mood);assert.equal(await frame.getAttribute('data-instance'),'original');
   const id=playlistFor(await frame.getAttribute('src')).id;assert(await page.evaluate(uri=>window.__spotifyCalls.some(x=>x.action==='play'&&x.uri===uri),'spotify:playlist:'+id),'mood must play whole playlist');
  }
  const saved=playlistFor(await frame.getAttribute('src'));
  await page.getByRole('button',{name:en?'Share':'Podijeli',exact:true}).click();assert.equal(await page.evaluate(()=>window.__shared.url),'https://open.spotify.com/playlist/'+saved.id);
  await page.getByRole('button',{name:en?'Like':'Sviđa mi se',exact:true}).click();await page.getByRole('button',{name:en?'Already listened':'Već poslušano',exact:true}).click();
  await page.locator('[data-nav="favorites"]').click();await page.locator('.saved-item').filter({hasText:saved.title}).click();assert.equal(await page.getByRole('button',{name:en?'Like':'Sviđa mi se',exact:true}).getAttribute('aria-pressed'),'true');
  await page.locator('.bottom-nav button').first().click();await page.locator('.listen-compact').waitFor();await page.getByRole('button',{name:en?'GO':'IZAĐI',exact:true}).click();await page.locator('.result-item-title').waitFor();assert.equal(await frame.getAttribute('data-instance'),'original','other spins retain playback');
  const cta=await page.locator('.result-actions').boundingBox(),dock=await page.locator('.listen-compact').boundingBox();assert(dock.y+dock.height<=cta.y);assert(dock.height<=44&&dock.width<=140);assert(dock.x+dock.width<=width);await page.screenshot({path:'/workspace/shared/listen-preview/compact-'+locale+'.png'});
  await page.locator('.music-nav').click();await page.locator('.listen-full').waitFor();await page.locator('.listen-card').evaluate(e=>e.scrollTop=0);await page.screenshot({path:'/workspace/shared/listen-preview/playlists-'+locale+'.png'});
  await page.getByRole('button',{name:en?'Pause music':'Pauziraj muziku',exact:true}).click();await page.getByRole('button',{name:en?'Play music':'Pokreni muziku',exact:true}).waitFor();await page.getByRole('button',{name:en?'Stop music':'Ugasi muziku',exact:true}).click();assert.equal(await page.locator('.listen-card iframe').count(),0);
  await listen.click();await frame.waitFor();const next=playlistFor(await frame.getAttribute('src'));assert.equal(next?.mood,'calm');assert.notEqual(next.id,saved.id);await page.close();
  console.log('PASS '+locale+' '+width+': all five playlist moods, playlist sharing/favourites, no repeated embed play, persistent background player, small upper-right controls, pause/stop and calm no-repeat. Spotify mocked.');
 }
 const fallback=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await fallback.route('https://open.spotify.com/**',r=>r.request().url().includes('iframe-api')?r.abort():r.fulfill({status:200,contentType:'text/html',body:'<p>Manual Spotify embed mock</p>'}));
 await fallback.addInitScript(p=>localStorage.setItem('random-life.local-profile.v1',JSON.stringify(p)),{...createProfile(),onboarded:true});await fallback.goto('http://127.0.0.1:'+server.address().port);await fallback.locator('.rail-category').last().click();await fallback.locator('.listen-card iframe').waitFor();assert.equal(playlistFor(await fallback.locator('.listen-card iframe').getAttribute('src'))?.mood,'calm');await fallback.locator('.listen-play-hint').waitFor();assert(!(await fallback.locator('.music-nav').getAttribute('class')).includes('music-playing'));await fallback.close();console.log('PASS manual playlist fallback without false playback status.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
