import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/jost'
import '@fontsource-variable/oswald'
import '@fontsource/fira-sans/400.css'
import '@fontsource/fira-sans/500.css'
import '@fontsource/fira-sans/600.css'
import '@fontsource-variable/lora'
import '@fontsource-variable/lora/wght-italic.css'
import '@fontsource-variable/montserrat'
import './demo.css'
import Menu from './Menu'
import { VENUES } from './venues'

const root = document.getElementById('root')
const id = root.dataset.venue
document.documentElement.className = `v-${id}`

createRoot(root).render(
  <StrictMode>
    <Menu id={id} venue={VENUES[id]} />
  </StrictMode>,
)
