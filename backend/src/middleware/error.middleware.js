export const notFound = (req, res) => {
  res.status(404).json({ message: `Path not found: ${req.method} ${req.originalUrl}` })
}

export const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join(', ')
    return res.status(400).json({ message })
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'That email address is already registered.' })
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID' })
  }
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
}
