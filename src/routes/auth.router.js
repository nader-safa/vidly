import express from 'express'
import authController from '../controllers/auth.controller.js'
import { auth } from '../middlewares/auth.js'

const router = express.Router()

router.post('/', authController.loginUser)
router.post('/register', authController.registerUser)
router.get('/me', auth, authController.getMe)

export default router
