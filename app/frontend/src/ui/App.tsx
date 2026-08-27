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
import ProtectedRoute from './routes/ProtectedRoute'
import ProtectedLogin from './routes/ProtectedLogin'
import MatchSocketProvider from './routes/MatchSocketProvider'
import Lobby from './pages/Lobby'
import GameEnd from './pages/GameEnd'
import Replay from './pages/Replay'
import WaitingRoom from './pages/WaitingRoom'

const App = () => {
  return (
	  <Routes>
			<Route element={<MatchSocketProvider />}>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route element={<ProtectedLogin />}>
        	<Route path="/register" element={<Register />} />
        	<Route path="/register-success" element={<RegisterSuccess />} />
        	<Route path="/login" element={<Login />} />
		</Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/game-settings" element={<GameSettings />} />
          <Route path="/lobby" element={<Lobby />} />
          	<Route path="/waiting/:matchId" element={<WaitingRoom />} />
          	<Route path="/game/:matchId" element={<Game />} />
          <Route path="/game-end" element={<GameEnd />} />
          <Route path="/replay" element={<Replay />} />
          <Route path="/waiting-room" element={<WaitingRoom />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="*" element={<NotFound />} />
	 	  </Route>
    </Routes>
  )
}

export default App
