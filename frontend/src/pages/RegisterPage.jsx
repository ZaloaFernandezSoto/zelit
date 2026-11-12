
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import '../styles/Auth.css'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(form.name, form.email, form.password)
      navigate('/playlists')
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <Link to="/" className="auth-brand">
        <span className="auth-brand-symbol">Z</span>
        <span>ZELIT</span>
      </Link>

      <div className="auth-card">
        <div className="auth-icon">✦</div>

        <h1>Create your account</h1>
        <p className="auth-subtitle">
          Join ZELIT and make your music space yours.
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={submit} className="auth-form">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your name"
            value={form.name}
            onChange={change}
            required
          />

          <label htmlFor="register-email">Email address</label>
          <input
            id="register-email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={change}
            required
          />

          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            name="password"
            type="password"
            placeholder="At least 6 characters"
            value={form.password}
            onChange={change}
            minLength={6}
            required
          />

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Log in</Link>
        </p>
      </div>

      <p className="auth-tagline">
        YOUR MUSIC. YOUR WORLD.
      </p>
    </div>
  )
}
