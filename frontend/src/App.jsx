
import {
  Routes,
  Route,
  Navigate,
  NavLink,
  Link,
  useLocation
} from 'react-router-dom'

import { useAuth } from './context/AuthContext.jsx'
import PrivateRoute from './routes/PrivateRoute.jsx'

import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import PlaylistsPage from './pages/PlaylistsPage.jsx'

import './styles/App.css'
import './styles/HomePage.css'

function HomePage({ user }) {
  return (
    <>
      <header className="topbar">
        <div>
          <p className="topbar-greeting">
            {user ? `WELCOME BACK, ${user.name.toUpperCase()}` : 'WELCOME TO ZELIT'}
          </p>
          <h1 className="topbar-title">Your music space</h1>
        </div>

        {!user && (
          <div className="auth-links">
            <Link to="/login" className="auth-link">Log In</Link>
            <Link to="/register" className="primary-button">Sign Up</Link>
          </div>
        )}
      </header>

      <section className="hero-card">
        <div className="hero-content">
          <span className="hero-eyebrow">YOUR MUSIC. YOUR WORLD.</span>

          <h2 className="hero-title">
            Discover your sound.
            <br />
            <span className="gradient-text">Create your vibe.</span>
          </h2>

          <p className="hero-description">
            Bring your favourite music together. Create playlists,
            organise your songs and make your musical world yours.
          </p>

          <Link
            to={user ? '/playlists' : '/register'}
            className="primary-button hero-button"
          >
            {user ? 'Explore my playlists' : 'Get started'}
            <span> →</span>
          </Link>
        </div>

        <div className="hero-decoration">
          <div className="music-disc">
            <div className="disc-center">Z</div>
          </div>
          <div className="sound-wave">
            {Array.from({ length: 13 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="home-features">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">THE ZELIT EXPERIENCE</p>
            <h2>Everything starts with music</h2>
          </div>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon purple-icon">♫</div>
            <h3>Create playlists</h3>
            <p>
              Organise your favourite songs into playlists
              for every mood and moment.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon pink-icon">✦</div>
            <h3>Build your collection</h3>
            <p>
              Keep your favourite tracks together
              in your own music space.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon violet-icon">♡</div>
            <h3>Enjoy your music</h3>
            <p>
              Discover new ways to organise and enjoy
              the music you love.
            </p>
          </article>
        </div>
      </section>

      <section className="home-cta">
        <div>
          <h2>Ready to create your sound?</h2>
          <p>Start building your music collection with ZELIT.</p>
        </div>

        <Link
          to={user ? '/playlists' : '/register'}
          className="primary-button"
        >
          {user ? 'My playlists' : 'Join ZELIT'}
        </Link>
      </section>
    </>
  )
}

function AppLayout({ user, logout }) {
  const location = useLocation()

  const isAuthPage = ['/login', '/register'].includes(location.pathname)

  if (isAuthPage) {
    return (
      <div className="auth-page">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    )
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <Link to="/" className="brand">
          <div className="brand-symbol">Z</div>
          <span className="brand-name">ZELIT</span>
        </Link>

        <p className="sidebar-label">MENU</p>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="nav-icon">⌂</span>
            Home
          </NavLink>

          <NavLink
            to="/playlists"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="nav-icon">♫</span>
            Playlists
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          {user ? (
            <>
              <div className="sidebar-user">
                <span className="user-avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </span>

                <div>
                  <strong>{user.name}</strong>
                  <span>{user.role}</span>
                </div>
              </div>

              <button className="logout-button" onClick={logout}>
                Log Out
              </button>
            </>
          ) : (
            <div className="sidebar-guest">
              <p>Join the ZELIT community.</p>
              <Link to="/register" className="primary-button">
                Create account
              </Link>
            </div>
          )}
        </div>
      </aside>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />

          <Route
            path="/playlists"
            element={
              <PrivateRoute>
                <PlaylistsPage />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  const { user, logout } = useAuth()

  return <AppLayout user={user} logout={logout} />
}
