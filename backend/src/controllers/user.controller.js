import User from '../models/User.js'
import Playlist from '../models/Playlist.js'

const isOwnerOrAdmin = (req, id) =>
  req.user.role === 'admin' || req.user._id.toString() === id

// GET /api/users  (solo admin)
export const listUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 })
  res.json(users)
}

// GET /api/users/:id
export const getUser = async (req, res) => {
  if (!isOwnerOrAdmin(req, req.params.id)) {
    return res.status(403).json({ message: 'Unauthorized' })
  }
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })
  res.json(user)
}

// PUT /api/users/:id
export const updateUser = async (req, res) => {
  if (!isOwnerOrAdmin(req, req.params.id)) {
    return res.status(403).json({ message: 'Unauthorized' })
  }
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })

  const { name, email, password, role } = req.body
  if (name !== undefined) user.name = name
  if (email !== undefined) user.email = email
  if (password) user.password = password
  if (role !== undefined && req.user.role === 'admin') user.role = role // Only admins can change roles

  await user.save()
  res.json({ _id: user._id, name: user.name, email: user.email, role: user.role })
}

// DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  if (!isOwnerOrAdmin(req, req.params.id)) {
    return res.status(403).json({ message: 'Unauthorized' })
  }
  const user = await User.findByIdAndDelete(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })
  await Playlist.deleteMany({ owner: user._id })
  res.json({ message: 'User deleted successfully' })
}
