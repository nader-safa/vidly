import express from 'express'
import genreController from '../controllers/genre.controller.js'
import { adminProtected, auth } from '../middlewares/auth.js'

const router = express.Router()

router.get('/', genreController.getGenres)
router.get('/:id', genreController.getGenre)
router.post('/', [auth, adminProtected], genreController.createGenre)
router.put('/:id', genreController.updateGenre)
router.delete('/:id', genreController.deleteGenre)

export default router
