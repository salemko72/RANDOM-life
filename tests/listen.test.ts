import{expect,it}from'vitest';
import{choosePlaylist,listenPlaylists,listenItems,listenKey,listenIndexFor,spotifyUri,spotifyUrl}from'../apps/client/src/web/listen-catalog';
it('has exactly three unique playlists for each of the five moods',()=>{
 expect(listenPlaylists).toHaveLength(15);expect(new Set(listenPlaylists.map(p=>p.id)).size).toBe(15);
 for(const mood of ['energy','calm','classics','upbeat','mellow'])expect(listenPlaylists.filter(p=>p.mood===mood)).toHaveLength(3);
 for(const p of listenPlaylists){expect(p.id).toMatch(/^[A-Za-z0-9]{22}$/);expect(Object.keys(p).sort()).toEqual(['id','kind','mood','title']);}
});
it('selects only the requested mood and avoids the previous playlist across random boundaries',()=>{
 for(const mood of ['energy','calm','classics','upbeat','mellow'])for(const random of [0,.5,.999,1,-1,NaN]){
  const first=choosePlaylist(-1,mood,random),next=choosePlaylist(first,mood,random);expect(next).not.toBe(first);expect(listenItems[first].mood).toBe(mood);expect(listenItems[next].mood).toBe(mood);
 }
 expect(listenItems[choosePlaylist(-1,'unknown',0)].mood).toBe('calm');
});
it('keeps saved playlist keys distinct from legacy track keys',()=>{
 for(let i=0;i<listenPlaylists.length;i++){expect(listenKey(i)).toBe('listen:playlist:'+listenItems[i].id);expect(listenIndexFor(listenKey(i))).toBe(i);expect(spotifyUri(listenItems[i])).toBe('spotify:playlist:'+listenItems[i].id);expect(spotifyUrl(listenItems[i])).toBe('https://open.spotify.com/playlist/'+listenItems[i].id);}
 const old=listenIndexFor('listen:3c4IfGyrZZke7B24o2VLZ2');expect(old).toBeGreaterThanOrEqual(15);expect(listenItems[old].kind).toBe('track');expect(spotifyUri(listenItems[old])).toBe('spotify:track:3c4IfGyrZZke7B24o2VLZ2');expect(listenIndexFor('listen:playlist:missing')).toBe(-1);
});
it('allows only exact Spotify track/playlist share links',async()=>{
 const{parseListenShare}=await import('../apps/client/src/web/listen-share');
 for(const kind of ['track','playlist']){const x={type:'lifespinner.listen.share.v1',title:'Music',url:`https://open.spotify.com/${kind}/37i9dQZF1DX3Ogo9pFvBkY`};expect(parseListenShare(JSON.stringify(x))?.message).toContain('Music');for(const url of ['https://evil.test/playlist/37i9dQZF1DX3Ogo9pFvBkY','javascript:alert(1)',x.url+'?redirect=evil',x.url+'#x',x.url.replace(kind,'artist')])expect(parseListenShare(JSON.stringify({...x,url}))).toBeNull();}
});
