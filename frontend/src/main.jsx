import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './registerSW.js' // Register PWA Service Worker

console.log('%c INSTANTPDF VERSION 0.2.1 LOADED', 'background: #222; color: #bada55; font-size: 20px');
console.log('If you do not see "Premium PDF Tools" on the home page, you are viewing an OLD CACHED VERSION.');


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
