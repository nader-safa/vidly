import express from 'express'
import authController from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/', authController.loginUser)
router.post('/register', authController.registerUser)

export default router
