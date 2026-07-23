import { Route, Routes, Navigate } from 'react-router-dom'
import Register from './pages/Register'
import RegisterSuccess from './pages/RegisterSuccess'
import Login from './pages/Login'
import Home from './pages/Home'
import Game from './pages/Game'
import GameSettings from './pages/GameSettings'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import NotFound from './pages/NotFound'

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-success" element={<RegisterSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/game-settings" element={<GameSettings />} />
        <Route path="/game" element={<Game />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
  )
}

export default App
