/** Playlist references only. Spotify owns the songs, artwork, ordering and availability. */
export type ListenMood='energy'|'calm'|'classics'|'upbeat'|'mellow';
export type ListenItem={kind:'playlist'|'track';id:string;title:string;mood:ListenMood};
export const listenPlaylists:readonly ListenItem[]=[
 {kind:'playlist',id:'37i9dQZF1DX3Ogo9pFvBkY',title:'Ambient Chill',mood:'calm'},
 {kind:'playlist',id:'37i9dQZF1DX889U0CL85jj',title:'Chill Vibes',mood:'calm'},
 {kind:'playlist',id:'37i9dQZF1DWTvNyxOwkztu',title:'Chillout Lounge',mood:'calm'},
 {kind:'playlist',id:'37i9dQZF1DX76Wlfdnj7AP',title:'Beast Mode',mood:'energy'},
 {kind:'playlist',id:'37i9dQZF1DWUVpAXiEPK8P',title:'Power Workout',mood:'energy'},
 {kind:'playlist',id:'37i9dQZF1DX70RN3TfWWJh',title:'Workout',mood:'energy'},
 {kind:'playlist',id:'37i9dQZF1DXbTxeAdrVG2l',title:'All Out 90s',mood:'classics'},
 {kind:'playlist',id:'37i9dQZF1DX4UtSsGT1Sbe',title:'All Out 80s',mood:'classics'},
 {kind:'playlist',id:'37i9dQZF1DWTJ7xPn4vNaz',title:'All Out 70s',mood:'classics'},
 {kind:'playlist',id:'37i9dQZF1DXdPec7aLTmlC',title:'Happy Hits!',mood:'upbeat'},
 {kind:'playlist',id:'37i9dQZF1DX3rxVfibe1L0',title:'Mood Booster',mood:'upbeat'},
 {kind:'playlist',id:'37i9dQZF1DX2sUQwD7tbmL',title:'Feel-Good Indie Rock',mood:'upbeat'},
 {kind:'playlist',id:'37i9dQZF1DX0SM0LYsmbMT',title:'Mellow Morning',mood:'mellow'},
 {kind:'playlist',id:'37i9dQZF1DWVV27DiNWxkR',title:'Sad Indie',mood:'mellow'},
 {kind:'playlist',id:'37i9dQZF1DX4E3UdUs7fUx',title:'Acoustic Chill',mood:'mellow'},
];
// Compatibility references only: existing favourites/history must still open their original song.
const legacy:readonly ListenItem[]=[
 {kind:'track',id:'3c4IfGyrZZke7B24o2VLZ2',title:'Clear',mood:'calm'},
 {kind:'track',id:'0ofHAoxe9vBkTCp2UQIavz',title:'Dreams',mood:'calm'},
 {kind:'track',id:'11dFghVXANMlKmJXsNCbNl',title:'Cutting Shapes',mood:'energy'},
 {kind:'track',id:'4uLU6hMCjMI75M1A2tKUQC',title:'Never Gonna Give You Up',mood:'upbeat'},
];
export const listenItems:readonly ListenItem[]=[...listenPlaylists,...legacy];
export const DEFAULT_LISTEN_INDEX=0;
export const spotifyUri=(item:ListenItem)=>`spotify:${item.kind}:${item.id}`;
export const spotifyUrl=(item:ListenItem)=>`https://open.spotify.com/${item.kind}/${item.id}`;
export const listenKey=(index:number)=>'listen:'+(listenItems[index].kind==='playlist'?'playlist:':'')+listenItems[index].id;
export const listenIndexFor=(key:string)=>listenItems.findIndex((_,i)=>listenKey(i)===key);
export function choosePlaylist(previous=-1,mood:string='calm',random=Math.random()){
 const matching=listenPlaylists.map((p,i)=>({p,i})).filter(({p})=>p.mood===mood);
 const pool=matching.length?matching:listenPlaylists.map((p,i)=>({p,i})).filter(({p})=>p.mood==='calm');
 const candidates=pool.filter(({i})=>i!==previous),choices=candidates.length?candidates:pool;
 return choices[Math.floor(Math.max(0,Math.min(.999999,Number.isFinite(random)?random:0))*choices.length)].i;
}
