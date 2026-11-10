import { useEffect, useState } from 'react'
import {
  getPlaylists, createPlaylist, updatePlaylist, deletePlaylist
} from '../services/playlist.service.js'

const empty = { name: '', description: '', isPublic: false }

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const load = async () => setPlaylists(await getPlaylists())
  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editingId) await updatePlaylist(editingId, form)   // UPDATE
      else await createPlaylist(form)                        // CREATE
      setForm(empty)
      setEditingId(null)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving')
    }
  }

  const startEdit = (p) => {
    setEditingId(p._id)
    setForm({ name: p.name, description: p.description, isPublic: p.isPublic })
  }

  const remove = async (id) => {                            // DELETE
    await deletePlaylist(id)
    load()
  }

  return (
    <div>
      <h2>My playlists</h2>
      <form onSubmit={submit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />{' '}
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />{' '}
        <label>
          <input type="checkbox" checked={form.isPublic} onChange={(e) => setForm({ ...form, isPublic: e.target.checked })} /> Public
        </label>{' '}
        <button type="submit">{editingId ? 'Save changes' : 'Create playlist'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(empty) }}>CANCEL</button>}
      </form>

      <ul>
        {playlists.map((p) => (                              // READ
          <li key={p._id} style={{ margin: '12px 0' }}>
            <strong>{p.name}</strong> {p.isPublic ? '(public)' : '(private)'} - {p.tracks.length} songs
            <br />{p.description}
            <br />
            <button onClick={() => startEdit(p)}>Edit</button>{' '}
            <button onClick={() => remove(p._id)}>Delete</button>
          </li>
        ))}
        {playlists.length === 0 && <li>You don't have any playlists yet.</li>}
      </ul>
    </div>
  )
}
