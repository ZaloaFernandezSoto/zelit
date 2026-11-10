import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import playlistRoutes from './routes/playlist.routes.js'
import { notFound, errorHandler } from './middleware/error.middleware.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'ZELIT' }))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/playlists', playlistRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
