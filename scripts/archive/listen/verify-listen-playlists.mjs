// Run with node --use-env-proxy. Uses public oEmbed metadata; no OAuth credentials.
import{build}from'esbuild';import{writeFile}from'node:fs/promises';
const b=await build({entryPoints:['apps/client/src/web/listen-catalog.ts'],bundle:true,platform:'node',format:'esm',write:false});
const{listenPlaylists}=await import('data:text/javascript;base64,'+Buffer.from(b.outputFiles[0].contents).toString('base64'));
const normalize=s=>s.normalize('NFKC').toLowerCase().replace(/[^a-z0-9]/g,'');const rows=[];let index=0;
await Promise.all(Array.from({length:3},async()=>{while(index<listenPlaylists.length){const p=listenPlaylists[index++],url='https://open.spotify.com/playlist/'+p.id;let row;
 try{const r=await fetch('https://open.spotify.com/oembed?url='+encodeURIComponent(url),{signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error('HTTP '+r.status);const data=await r.json();if(typeof data.title!=='string'||!data.title.trim())throw Error('Missing playlist title');row={id:p.id,name:p.title,mood:p.mood,url,spotifyTitle:data.title,status:normalize(data.title)===normalize(p.title)?'verified':'title-mismatch'};}
 catch(e){row={id:p.id,name:p.title,mood:p.mood,url,status:'unverified',reason:e instanceof Error?e.message:'request failed'};}
 rows.push(row);console.log(row.status+' · '+p.title+(row.spotifyTitle?' → '+row.spotifyTitle:''));
}}));
const report={checkedAt:new Date().toISOString(),method:'Spotify public oEmbed metadata, not authenticated playback',playlists:listenPlaylists.map(p=>rows.find(r=>r.id===p.id))};
const out=process.argv[2]??'/tmp/lifespinner-playlist-verification.json';await writeFile(out,JSON.stringify(report,null,2)+'\n');console.log('Report: '+out);if(rows.some(r=>r.status!=='verified'))process.exitCode=1;
