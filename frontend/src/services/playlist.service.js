import api from './api.js'

export const getPlaylists = () =>
  api.get('/playlists').then((r) => r.data)

export const createPlaylist = (data) =>
  api.post('/playlists', data).then((r) => r.data)

export const updatePlaylist = (id, data) =>
  api.put(`/playlists/${id}`, data).then((r) => r.data)

export const deletePlaylist = (id) =>
  api.delete(`/playlists/${id}`).then((r) => r.data)

// Add a song to a playlist
export const addTrack = (playlistId, trackData) =>
  api.post(`/playlists/${playlistId}/tracks`, trackData)
    .then((r) => r.data)

// Remove a song from a playlist
export const removeTrack = (playlistId, trackId) =>
  api.delete(`/playlists/${playlistId}/tracks/${trackId}`)
    .then((r) => r.data)
