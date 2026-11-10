import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

const publicUser = (u) => ({ _id: u._id, name: u.name, email: u.email, role: u.role })

// POST /api/auth/register  (el rol siempre es "user")
export const register = async (req, res) => {
  const { name, email, password } = req.body
  const user = await User.create({ name, email, password })
  res.status(201).json({ token: generateToken(user), user: publicUser(user) })
}

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Incorrect passwords' })
  }
  res.json({ token: generateToken(user), user: publicUser(user) })
}

// GET /api/auth/me
export const me = async (req, res) => {
  res.json({ user: publicUser(req.user) })
}
