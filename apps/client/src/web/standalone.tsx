import {installPerformance} from './performance';
import React from 'react';
import { createRoot } from 'react-dom/client';
import WebExperience from './WebExperience';
import SharedItem from './SharedItem';
installPerformance();
createRoot(document.getElementById('root')!).render(location.pathname.startsWith('/item/')?<SharedItem/>:<WebExperience />);
