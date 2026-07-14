import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { UsernameProvider } from './context/UsernameContext'
import { BrowserRouter } from 'react-router-dom'
import App from './ui/App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UsernameProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UsernameProvider>
  </StrictMode>,
)
