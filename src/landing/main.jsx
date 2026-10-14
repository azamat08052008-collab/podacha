import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/wix-madefor-display/600.css'
import '@fontsource/wix-madefor-display/700.css'
import '@fontsource/wix-madefor-text/400.css'
import '@fontsource/wix-madefor-text/500.css'
import './landing.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
