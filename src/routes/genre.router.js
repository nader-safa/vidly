import express from 'express'
import genreController from '../controllers/genre.controller.js'

const router = express.Router()

router.get('/', genreController.getGenres)
router.get('/:id', genreController.getGenre)
router.post('/', genreController.createGenre)
router.patch('/:id', genreController.updateGenre)
router.delete('/:id', genreController.deleteGenre)

export default router
