
import { useEffect, useState } from 'react'
import {
  getPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addTrack,
  removeTrack,
} from '../services/playlist.service.js'

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

// Extract the YouTube video ID from a URL or a raw video ID
const getYouTubeId = (value) => {
  const input = value.trim()

  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input
  }

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

    return /^[a-zA-Z0-9_-]{11}$/.test(videoId || '')
      ? videoId
      : ''
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
  }

  const handleDeletePlaylist = async (playlistId) => {
    if (!window.confirm('Are you sure you want to delete this playlist?')) {
      return
    }

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

    setTrackForm((current) => ({
      ...current,
      [name]: value,
    }))
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
    return <p>Loading playlists...</p>
  }

  return (
    <main>
      <h1>My Playlists</h1>

      {error && <p role="alert">{error}</p>}

      <section>
        <h2>{editingId ? 'Edit Playlist' : 'Create Playlist'}</h2>

        <form onSubmit={handlePlaylistSubmit}>
          <input
            name="name"
            value={form.name}
            onChange={handlePlaylistChange}
            placeholder="Playlist name"
            required
          />

          <input
            name="description"
            value={form.description}
            onChange={handlePlaylistChange}
            placeholder="Description"
          />

          <label>
            <input
              type="checkbox"
              name="isPublic"
              checked={form.isPublic}
              onChange={handlePlaylistChange}
            />
            Public playlist
          </label>

          <button type="submit">
            {editingId ? 'Save Changes' : 'Create Playlist'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setForm(emptyPlaylist)
                setEditingId(null)
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </section>

      <section>
        <h2>Your Playlists</h2>

        {playlists.length === 0 ? (
          <p>You have no playlists yet.</p>
        ) : (
          playlists.map((playlist) => (
            <article key={playlist._id}>
              <h3>{playlist.name}</h3>
              <p>{playlist.description}</p>
              <p>{playlist.isPublic ? 'Public' : 'Private'}</p>

              <button onClick={() => handleEdit(playlist)}>
                Edit Playlist
              </button>

              <button onClick={() => handleDeletePlaylist(playlist._id)}>
                Delete Playlist
              </button>

              <hr />

              <h4>Songs</h4>

              {playlist.tracks?.length > 0 ? (
                <ul>
                  {playlist.tracks.map((track) => (
                    <li key={track._id}>
                      {track.thumbnail && (
                        <img
                          src={track.thumbnail}
                          alt={track.title}
                          width="120"
                        />
                      )}

                      <p>
                        <strong>{track.title}</strong>
                      </p>

                      <p>{track.channel}</p>

                      <button
                        onClick={() =>
                          handleRemoveTrack(playlist._id, track._id)
                        }
                      >
                        Remove Song
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No songs in this playlist yet.</p>
              )}

              <button
                onClick={() => {
                  setAddingTo(addingTo === playlist._id ? null : playlist._id)
                  setTrackForm(emptyTrack)
                  setError('')
                }}
              >
                {addingTo === playlist._id ? 'Close Form' : 'Add Song'}
              </button>

              {addingTo === playlist._id && (
                <form onSubmit={handleAddTrack}>
                  <input
                    name="youtubeUrl"
                    value={trackForm.youtubeUrl}
                    onChange={handleTrackChange}
                    placeholder="YouTube video URL or ID"
                    required
                  />

                  <input
                    name="title"
                    value={trackForm.title}
                    onChange={handleTrackChange}
                    placeholder="Song title"
                    required
                  />

                  <input
                    name="channel"
                    value={trackForm.channel}
                    onChange={handleTrackChange}
                    placeholder="Artist or channel name"
                  />

                  <button type="submit">Save Song</button>
                </form>
              )}
            </article>
          ))
        )}
      </section>
    </main>
  )
}
