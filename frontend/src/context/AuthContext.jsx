import { createContext, useContext, useState } from 'react'
import api from '../services/api.js'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('zelit_user')
    return saved ? JSON.parse(saved) : null
  })

  const save = ({ token, user }) => {
    localStorage.setItem('zelit_token', token)
    localStorage.setItem('zelit_user', JSON.stringify(user))
    setUser(user)
  }

  const login = async (email, password) =>
    save((await api.post('/auth/login', { email, password })).data)

  const register = async (name, email, password) =>
    save((await api.post('/auth/register', { name, email, password })).data)

  const logout = () => {
    localStorage.removeItem('zelit_token')
    localStorage.removeItem('zelit_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
