import mongoose from 'mongoose'

// Lightweight YouTube metadata: audio is not saved
const trackSchema = new mongoose.Schema(
  {
    youtubeId: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    channel: { type: String, trim: true },
    thumbnail: { type: String }
  },
  { _id: true }
)

const playlistSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'The playlist name is required'], trim: true },
    description: { type: String, trim: true, default: '' },
    isPublic: { type: Boolean, default: false },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tracks: [trackSchema]
  },
  { timestamps: true }
)

export default mongoose.model('Playlist', playlistSchema)
