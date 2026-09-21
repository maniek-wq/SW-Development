import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Tells the boot screen in index.html that the app is mounted. It waits for its
// own minimum display time before leaving, so this only ends the "loading" part.
requestAnimationFrame(() => window.dispatchEvent(new Event('sw-app-ready')))
