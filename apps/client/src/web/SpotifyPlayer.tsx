import SpotifyConnectedPlayer from './SpotifyConnectedPlayer';
import{spotifyStatus,subscribeSpotify}from'./spotify-auth';
import React,{forwardRef,useEffect,useImperativeHandle,useRef,useState}from'react';
type Controller={loadUri:(uri:string)=>void;play:()=>void;pause:()=>void;addListener:(event:string,handler:(e:{data?:{isPaused?:boolean}})=>void)=>void;destroy?:()=>void};
type Api={createController:(element:HTMLElement,options:{uri:string;width:string;height:number},callback:(c:Controller)=>void)=>void};
type SpotifyWindow=Window&{onSpotifyIframeApiReady?:(api:Api)=>void};
let apiPromise:Promise<Api>|undefined;
function loadApi(){
 if(apiPromise)return apiPromise;
 apiPromise=new Promise<Api>((resolve,reject)=>{const w=window as SpotifyWindow,previous=w.onSpotifyIframeApiReady;const timer=setTimeout(()=>reject(Error('Spotify API unavailable')),10000);w.onSpotifyIframeApiReady=api=>{clearTimeout(timer);resolve(api);previous?.(api);};const script=document.createElement('script');script.src='https://open.spotify.com/embed/iframe-api/v1';script.async=true;script.onerror=()=>{clearTimeout(timer);reject(Error('Spotify API unavailable'));};document.head.appendChild(script);});return apiPromise;
}
export type SpotifyHandle={loadAndPlay:(id:string)=>void;play:()=>void;pause:()=>void};
const EmbedSpotifyPlayer=forwardRef<SpotifyHandle,{id:string;playRequest:number;title:string;onPlayback:(playing:boolean)=>void;onUnavailable:()=>void}>(function SpotifyPlayer({id,playRequest,title,onPlayback,onUnavailable},ref){
 const host=useRef<HTMLDivElement>(null),controller=useRef<Controller|null>(null),loaded=useRef(''),handled=useRef(0);const latest=useRef({id,playRequest,onPlayback,onUnavailable});latest.current={id,playRequest,onPlayback,onUnavailable};const[fallback,setFallback]=useState(false);
 function loadAndPlay(next:string){const c=controller.current;if(!c)return;try{if(loaded.current!==next){c.loadUri('spotify:track:'+next);loaded.current=next;}c.play();}catch{latest.current.onUnavailable();}}
 useImperativeHandle(ref,()=>({loadAndPlay,play:()=>{try{controller.current?.play();}catch{latest.current.onUnavailable();}},pause:()=>{try{controller.current?.pause();}catch{latest.current.onUnavailable();}}}));
 useEffect(()=>{let live=true;void loadApi().then(api=>{if(!live||!host.current)return;const node=document.createElement('div');host.current.replaceChildren(node);const initial=latest.current.id;api.createController(node,{uri:'spotify:track:'+initial,width:'100%',height:352},c=>{if(!live){c.destroy?.();return;}controller.current=c;loaded.current=initial;c.addListener('playback_update',e=>{if(live&&typeof e.data?.isPaused==='boolean')latest.current.onPlayback(!e.data.isPaused);});c.addListener('ready',()=>{if(live&&latest.current.playRequest>0){handled.current=latest.current.playRequest;loadAndPlay(latest.current.id);}});if(latest.current.playRequest>0){handled.current=latest.current.playRequest;loadAndPlay(latest.current.id);}});}).catch(()=>{if(live){setFallback(true);latest.current.onUnavailable();}});return()=>{live=false;try{controller.current?.pause();controller.current?.destroy?.();}catch{}controller.current=null;};},[]);
 useEffect(()=>{if(!controller.current)return;if(loaded.current!==id){try{controller.current.loadUri('spotify:track:'+id);loaded.current=id;latest.current.onPlayback(false);}catch{latest.current.onUnavailable();}}if(playRequest>handled.current){handled.current=playRequest;loadAndPlay(id);}},[id,playRequest]);
 return <div className="spotify-player">{fallback?<iframe title={title} src={`https://open.spotify.com/embed/track/${id}?theme=0`} width="100%" height="352" allow="autoplay; encrypted-media; fullscreen; picture-in-picture"/>:<div className="spotify-controller-host" ref={host}/>}</div>;
});

type PlayerProps={id:string;playRequest:number;title:string;onPlayback:(playing:boolean)=>void;onUnavailable:()=>void};
export default forwardRef<SpotifyHandle,PlayerProps>(function SpotifyPlayer(props,ref){const[,update]=useState(0),wasPremium=useRef(false);useEffect(()=>subscribeSpotify(()=>update(n=>n+1)),[]);const account=spotifyStatus();if(account.premium)wasPremium.current=true;return account.premium?<SpotifyConnectedPlayer {...props} ref={ref}/>:<EmbedSpotifyPlayer {...props} playRequest={wasPremium.current?0:props.playRequest} ref={ref}/>;});
