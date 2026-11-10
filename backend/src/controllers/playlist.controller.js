import Playlist from '../models/Playlist.js'

// Find the playlist and check whether the user owns it (or is an admin)
const getOwned = async (req, res) => {
  const playlist = await Playlist.findById(req.params.id)
  if (!playlist) {
    res.status(404).json({ message: 'Playlist not found' })
    return null
  }
  const isOwner = playlist.owner.toString() === req.user._id.toString()
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403).json({ message: 'Unauthorized' })
    return null
  }
  return playlist
}

// CREATE  POST /api/playlists
export const createPlaylist = async (req, res) => {
  const { name, description, isPublic } = req.body
  const playlist = await Playlist.create({ name, description, isPublic, owner: req.user._id })
  res.status(201).json(playlist)
}

// READ GET /api/playlists (user's playlists; admin can see all)
export const listPlaylists = async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { owner: req.user._id }
  const playlists = await Playlist.find(filter).sort({ createdAt: -1 })
  res.json(playlists)
}

// READ  GET /api/playlists/:id
export const getPlaylist = async (req, res) => {
  const playlist = await getOwned(req, res)
  if (playlist) res.json(playlist)
}

// UPDATE  PUT /api/playlists/:id
export const updatePlaylist = async (req, res) => {
  const playlist = await getOwned(req, res)
  if (!playlist) return
  const { name, description, isPublic } = req.body
  if (name !== undefined) playlist.name = name
  if (description !== undefined) playlist.description = description
  if (isPublic !== undefined) playlist.isPublic = isPublic
  await playlist.save()
  res.json(playlist)
}

// DELETE  DELETE /api/playlists/:id
export const deletePlaylist = async (req, res) => {
  const playlist = await getOwned(req, res)
  if (!playlist) return
  await playlist.deleteOne()
  res.json({ message: 'Playlist deleted succesfully' })
}

// POST /api/playlists/:id/tracks
export const addTrack = async (req, res) => {
  const playlist = await getOwned(req, res)
  if (!playlist) return
  const { youtubeId, title, channel, thumbnail } = req.body
  if (playlist.tracks.some((t) => t.youtubeId === youtubeId)) {
    return res.status(409).json({ message: 'The song is already on the playlist' })
  }
  playlist.tracks.push({ youtubeId, title, channel, thumbnail })
  await playlist.save()
  res.status(201).json(playlist)
}

// DELETE /api/playlists/:id/tracks/:trackId
export const removeTrack = async (req, res) => {
  const playlist = await getOwned(req, res)
  if (!playlist) return
  playlist.tracks.pull({ _id: req.params.trackId })
  await playlist.save()
  res.json(playlist)
}
