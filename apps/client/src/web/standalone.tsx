import{SpotifyCallback}from'./SpotifyAccount';
import {installPerformance} from './performance';
import React from 'react';
import { createRoot } from 'react-dom/client';
import WebExperience from './WebExperience';
import SharedItem from './SharedItem';
const spotifyCallback=/^\/auth\/spotify\/callback\/?$/.test(location.pathname);if(!spotifyCallback)installPerformance();
createRoot(document.getElementById('root')!).render(spotifyCallback?<SpotifyCallback/>:location.pathname.startsWith('/item/')?<SharedItem/>:<WebExperience />);
