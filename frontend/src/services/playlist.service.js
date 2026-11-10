import api from './api.js'

export const getPlaylists = () => api.get('/playlists').then((r) => r.data)
export const createPlaylist = (data) => api.post('/playlists', data).then((r) => r.data)
export const updatePlaylist = (id, data) => api.put(`/playlists/${id}`, data).then((r) => r.data)
export const deletePlaylist = (id) => api.delete(`/playlists/${id}`).then((r) => r.data)
