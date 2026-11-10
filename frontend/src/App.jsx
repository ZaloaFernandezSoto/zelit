import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import PrivateRoute from './routes/PrivateRoute.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import PlaylistsPage from './pages/PlaylistsPage.jsx'

export default function App() {
  const { user, logout } = useAuth()
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 16, fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1>ZELIT</h1>
        <nav>
          {user ? (
            <>
              <span>{user.name} ({user.role}) </span>
              <button onClick={logout}>Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login">Log In</Link> | <Link to="/register">Sign Up</Link>
            </>
          )}
        </nav>
      </header>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/playlists" element={<PrivateRoute><PlaylistsPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/playlists" replace />} />
      </Routes>
    </div>
  )
}
