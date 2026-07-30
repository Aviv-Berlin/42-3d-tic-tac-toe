import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { UsernameProvider } from './ui/context/UsernameContext'
import { GameDataProvider } from './ui/context/GameDataContext'
import App from './ui/App.jsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UsernameProvider>
      <GameDataProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GameDataProvider>
    </UsernameProvider>
  </StrictMode>,
)
