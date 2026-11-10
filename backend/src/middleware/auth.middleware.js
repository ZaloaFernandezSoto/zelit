import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Autenticación: exige un token JWT válido
export const protect = async (req, res, next) => {
  const header = req.headers.authorization || ''
  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authenticted: token missing' })
  }
  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    if (!user) return res.status(401).json({ message: 'The user no longer exists' })
    req.user = user
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}
