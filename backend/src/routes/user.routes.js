import { Router } from 'express'
import { listUsers, getUser, updateUser, deleteUser } from '../controllers/user.controller.js'
import { protect } from '../middleware/auth.middleware.js'
import { adminOnly } from '../middleware/admin.middleware.js'

const router = Router()
router.use(protect)
router.get('/', adminOnly, listUsers)
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser)
export default router
