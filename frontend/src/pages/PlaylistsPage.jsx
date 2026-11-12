
import { useEffect, useState } from 'react'
import {
  getPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addTrack,
  removeTrack,
} from '../services/playlist.service.js'
import '../styles/Playlists.css'

const emptyPlaylist = {
  name: '',
  description: '',
  isPublic: false,
}

const emptyTrack = {
  youtubeUrl: '',
  title: '',
  channel: '',
}

const getYouTubeId = (value) => {
  const input = value.trim()

  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input

  try {
    const url = new URL(input)
    const host = url.hostname.replace('www.', '')
    let videoId = ''

    if (host === 'youtu.be') {
      videoId = url.pathname.slice(1).split('/')[0]
    } else if (host === 'youtube.com' || host === 'm.youtube.com') {
      videoId =
        url.searchParams.get('v') ||
        url.pathname.match(/\/(shorts|embed)\/([^/?]+)/)?.[2]
    }

    return /^[a-zA-Z0-9_-]{11}$/.test(videoId || '') ? videoId : ''
  } catch {
    return ''
  }
}

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([])
  const [form, setForm] = useState(emptyPlaylist)
  const [editingId, setEditingId] = useState(null)
  const [addingTo, setAddingTo] = useState(null)
  const [trackForm, setTrackForm] = useState(emptyTrack)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const loadPlaylists = async () => {
    try {
      const data = await getPlaylists()
      setPlaylists(Array.isArray(data) ? data : data.playlists || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load playlists.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPlaylists()
  }, [])

  const handlePlaylistChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handlePlaylistSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      if (editingId) {
        await updatePlaylist(editingId, form)
      } else {
        await createPlaylist(form)
      }

      setForm(emptyPlaylist)
      setEditingId(null)
      await loadPlaylists()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save playlist.')
    }
  }

  const handleEdit = (playlist) => {
    setForm({
      name: playlist.name || '',
      description: playlist.description || '',
      isPublic: playlist.isPublic || false,
    })
    setEditingId(playlist._id)
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeletePlaylist = async (playlistId) => {
    if (!window.confirm('Are you sure you want to delete this playlist?')) return

    setError('')

    try {
      await deletePlaylist(playlistId)
      await loadPlaylists()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete playlist.')
    }
  }

  const handleTrackChange = (e) => {
    const { name, value } = e.target
    setTrackForm((current) => ({ ...current, [name]: value }))
  }

  const handleAddTrack = async (e) => {
    e.preventDefault()
    setError('')

    const youtubeId = getYouTubeId(trackForm.youtubeUrl)

    if (!youtubeId) {
      setError('Please enter a valid YouTube URL or video ID.')
      return
    }

    if (!trackForm.title.trim()) {
      setError('Please enter the song title.')
      return
    }

    try {
      await addTrack(addingTo, {
        youtubeId,
        title: trackForm.title.trim(),
        channel: trackForm.channel.trim(),
        thumbnail: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
      })

      setTrackForm(emptyTrack)
      setAddingTo(null)
      await loadPlaylists()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add song.')
    }
  }

  const handleRemoveTrack = async (playlistId, trackId) => {
    setError('')

    try {
      await removeTrack(playlistId, trackId)
      await loadPlaylists()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not remove song.')
    }
  }

  if (loading) {
    return (
      <div className="playlist-loading">
        <div className="loading-spinner" />
        <p>Loading your music...</p>
      </div>
    )
  }

  return (
    <main className="playlists-page">
      <div className="playlists-heading">
        <div>
          <p className="section-eyebrow">YOUR MUSIC COLLECTION</p>
          <h1>My Playlists</h1>
          <p className="playlists-intro">
            Create your collections and keep your favourite music together.
          </p>
        </div>
        <div className="playlist-count">
          <span>{playlists.length}</span>
          <small>{playlists.length === 1 ? 'PLAYLIST' : 'PLAYLISTS'}</small>
        </div>
      </div>

      {error && (
        <div className="playlist-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setError('')} aria-label="Dismiss error">
            ×
          </button>
        </div>
      )}

      <section className="playlist-editor">
        <div className="editor-heading">
          <div className="editor-icon">♫</div>
          <div>
            <h2>{editingId ? 'Edit playlist' : 'Create a playlist'}</h2>
            <p>
              {editingId
                ? 'Update the details of your collection.'
                : 'Give your next music collection a name.'}
            </p>
          </div>
        </div>

        <form className="playlist-form" onSubmit={handlePlaylistSubmit}>
          <div className="form-fields">
            <label>
              Playlist name
              <input
                name="name"
                value={form.name}
                onChange={handlePlaylistChange}
                placeholder="e.g. Late night vibes"
                required
              />
            </label>

            <label>
              Description
              <input
                name="description"
                value={form.description}
                onChange={handlePlaylistChange}
                placeholder="What is this playlist about?"
              />
            </label>
          </div>

          <div className="editor-actions">
            <label className="visibility-toggle">
              <input
                type="checkbox"
                name="isPublic"
                checked={form.isPublic}
                onChange={handlePlaylistChange}
              />
              <span>{form.isPublic ? 'Public playlist' : 'Private playlist'}</span>
            </label>

            <div className="form-buttons">
              {editingId && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setForm(emptyPlaylist)
                    setEditingId(null)
                  }}
                >
                  Cancel
                </button>
              )}
              <button type="submit" className="primary-button">
                {editingId ? 'Save changes' : '+ Create playlist'}
              </button>
            </div>
          </div>
        </form>
      </section>

      <section className="playlist-library">
        <div className="library-heading">
          <div>
            <p className="section-eyebrow">YOUR COLLECTION</p>
            <h2>All playlists</h2>
          </div>
        </div>

        {playlists.length === 0 ? (
          <div className="empty-playlists">
            <div className="empty-icon">♫</div>
            <h3>Your music space is waiting</h3>
            <p>Create your first playlist to start collecting your favourite songs.</p>
          </div>
        ) : (
          <div className="playlist-grid">
            {playlists.map((playlist) => (
              <article className="playlist-card" key={playlist._id}>
                <div className="playlist-cover">
                  {playlist.tracks?.find((track) => track.thumbnail)?.thumbnail ? (
                    <img
                      src={playlist.tracks.find((track) => track.thumbnail).thumbnail}
                      alt={`${playlist.name} cover`}
                    />
                  ) : (
                    <div className="cover-placeholder">♫</div>
                  )}
                  <span className="cover-track-count">
                    {playlist.tracks?.length || 0} songs
                  </span>
                </div>

                <div className="playlist-card-content">
                  <div className="playlist-card-title">
                    <div>
                      <h3>{playlist.name}</h3>
                      <span className={`privacy-label ${playlist.isPublic ? 'public' : ''}`}>
                        {playlist.isPublic ? 'PUBLIC' : 'PRIVATE'}
                      </span>
                    </div>
                    <span className="playlist-music-icon">♫</span>
                  </div>

                  <p className="playlist-description">
                    {playlist.description || 'No description added yet.'}
                  </p>

                  <div className="playlist-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => handleEdit(playlist)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => handleDeletePlaylist(playlist._id)}
                    >
                      Delete
                    </button>
                  </div>

                  <div className="tracks-section">
                    <div className="tracks-heading">
                      <h4>Songs</h4>
                      <span>{playlist.tracks?.length || 0}</span>
                    </div>

                    {playlist.tracks?.length > 0 ? (
                      <div className="track-list">
                        {playlist.tracks.map((track) => (
                          <div className="track-item" key={track._id}>
                            {track.thumbnail ? (
                              <img src={track.thumbnail} alt="" className="track-thumbnail" />
                            ) : (
                              <div className="track-thumbnail track-placeholder">♫</div>
                            )}

                            <div className="track-info">
                              <strong>{track.title}</strong>
                              <span>{track.channel || 'Unknown artist'}</span>
                            </div>

                            <button
                              type="button"
                              className="remove-track-button"
                              onClick={() => handleRemoveTrack(playlist._id, track._id)}
                              aria-label={`Remove ${track.title}`}
                              title="Remove song"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-tracks">No songs in this playlist yet.</p>
                    )}

                    <button
                      type="button"
                      className="add-track-button"
                      onClick={() => {
                        setAddingTo(addingTo === playlist._id ? null : playlist._id)
                        setTrackForm(emptyTrack)
                        setError('')
                      }}
                    >
                      {addingTo === playlist._id ? '− Close form' : '+ Add a song'}
                    </button>

                    {addingTo === playlist._id && (
                      <form className="track-form" onSubmit={handleAddTrack}>
                        <label>
                          YouTube URL or video ID
                          <input
                            name="youtubeUrl"
                            value={trackForm.youtubeUrl}
                            onChange={handleTrackChange}
                            placeholder="Paste a YouTube link"
                            required
                          />
                        </label>
                        <label>
                          Song title
                          <input
                            name="title"
                            value={trackForm.title}
                            onChange={handleTrackChange}
                            placeholder="Enter song title"
                            required
                          />
                        </label>
                        <label>
                          Artist or channel
                          <input
                            name="channel"
                            value={trackForm.channel}
                            onChange={handleTrackChange}
                            placeholder="Enter artist name"
                          />
                        </label>
                        <button type="submit" className="primary-button">
                          Save song
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
