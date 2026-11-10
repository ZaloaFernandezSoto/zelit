import { Router } from 'express'
import {
  createPlaylist, listPlaylists, getPlaylist, updatePlaylist,
  deletePlaylist, addTrack, removeTrack
} from '../controllers/playlist.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = Router()
router.use(protect)
router.route('/').post(createPlaylist).get(listPlaylists)
router.route('/:id').get(getPlaylist).put(updatePlaylist).delete(deletePlaylist)
router.post('/:id/tracks', addTrack)
router.delete('/:id/tracks/:trackId', removeTrack)
export default router
