import movieController from '../controllers/movie.controller.js'
import express from 'express'

const router = express.Router()

router.get('/', movieController.getMovies)
router.get('/:id', movieController.getMovie)
router.post('/', movieController.createMovie)
router.put('/:id', movieController.updateMovie)
router.delete('/:id', movieController.deleteMovie)

export default router
