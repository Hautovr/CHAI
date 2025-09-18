import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'

// Hide loading screen when React app mounts
const hideLoadingScreen = () => {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.style.opacity = '0';
    loadingScreen.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 300);
  }
};

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Hide loading screen after React renders
setTimeout(hideLoadingScreen, 100);
