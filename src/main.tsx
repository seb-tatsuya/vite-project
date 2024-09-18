import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const root = createRoot(document.getElementById('root') as Element); //as Element=型アサーション（別の型を割り当てる機能

root.render(

  <StrictMode>
    {/* <App />でindex.htmlの<div id="root"></div>をレンダリングしている */}
    <App />
  </StrictMode>
);


