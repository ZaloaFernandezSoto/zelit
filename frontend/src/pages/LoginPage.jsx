import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/playlists')
    } catch (err) {
      setError(err.response?.data?.message || 'Error logging in')
    }
  }

  return (
    <form onSubmit={submit}>
      <h2>Entrar</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p><input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /></p>
      <p><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /></p>
      <button type="submit">Entrar</button>
    </form>
  )
}
