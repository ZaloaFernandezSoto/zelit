import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    try {
      await register(form.name, form.email, form.password)
      navigate('/playlists')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse')
    }
  }

  return (
    <form onSubmit={submit}>
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p><input name="name" placeholder="Name" value={form.name} onChange={change} /></p>
      <p><input name="email" placeholder="Email" value={form.email} onChange={change} /></p>
      <p><input name="password" type="password" placeholder="Password (mín. 6)" value={form.password} onChange={change} /></p>
      <button type="submit">Create Account</button>
    </form>
  )
}
