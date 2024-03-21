import express from 'express'
import rentalController from '../controllers/rental.controller.js'

const router = express.Router()

router.post('/', rentalController.createRental)
router.get('/', rentalController.getRentals)
router.get('/:id', rentalController.getRental)
router.put('/:id', rentalController.updateRental)
router.delete('/:id', rentalController.deleteRental)

export default router
