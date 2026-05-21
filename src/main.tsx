import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { syncPerformanceProfileClass } from './utils/performanceProfile'
import App from './App.tsx'

syncPerformanceProfileClass()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
