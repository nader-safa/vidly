import Rental, { rentalJoiSchema } from '../models/rental.model.js'
import Movie from '../models/movie.model.js'
import Customer from '../models/customer.model.js'
import Mongoose from 'mongoose'

// createRental
const createRental = async (req, res) => {
  const { error } = rentalJoiSchema.validate(req.body)
  if (error) return res.status(400).json({ message: error.details[0].message })

  const customer = await Customer.findById(req.body.customerId)
  if (!customer)
    return res
      .status(404)
      .json({ message: 'No customer found with the given id' })

  const movie = await Movie.findById(req.body.movieId)
  if (!movie)
    return res.status(404).json({ message: 'No movie found with the given id' })

  if (movie.numberInStock === 0)
    return res.status(400).json({ message: 'Movie not in stock' })

  const session = await Mongoose.startSession()

  session.startTransaction()
  try {
    await movie.updateOne({ $inc: { numberInStock: -1 } }, { session })
    const rental = await Rental.create(
      [
        {
          customer: customer._id,
          movie: movie._id,
        },
      ],
      { session }
    )

    await session.commitTransaction()
    res
      .status(201)
      .json({ message: 'Rental created successfully', data: rental })
  } catch (err) {
    await session.abortTransaction()
    throw new Error('Error creating rental ACID transaction', err)
  } finally {
    session.endSession()
  }
}

// getRentals
const getRentals = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10
  const page = parseInt(req.query.page) || 1
  const count = await Rental.countDocuments()

  const rentals = await Rental.find()
    .limit(limit)
    .skip((page - 1) * limit)
    .sort('-dateOut')
    .populate('movie', { title: 1, _id: 0 })
    .populate('customer', { name: 1, _id: 0 })

  res.json({
    message: 'Rentals found',
    data: rentals,
    limit,
    page,
    count,
  })
}

// getRental
const getRental = async (req, res) => {
  if (Mongoose.Types.ObjectId.isValid(req.params.id) === false)
    return res.status(400).json({ message: 'Invalid rental id' })

  const rental = await Rental.findById(req.params.id)
  if (!rental)
    return res
      .status(404)
      .json({ message: 'No rental found with the given id' })
  res.json({ message: 'Rental found', data: rental })
}

// updateRental
const updateRental = async (req, res) => {
  if (Mongoose.Types.ObjectId.isValid(req.params.id) === false)
    return res.status(400).json({ message: 'Invalid rental id' })

  const { error } = rentalJoiSchema.validate(req.body)
  if (error) return res.status(400).json({ message: error.details[0].message })

  const rental = await Rental.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  if (!rental)
    return res
      .status(404)
      .json({ message: 'No rental found with the given id' })

  res.json({ message: 'Rental updated', data: rental })
}

// deleteRental
const deleteRental = async (req, res) => {
  if (Mongoose.Types.ObjectId.isValid(req.params.id) === false)
    return res.status(400).json({ message: 'Invalid rental id' })

  const rental = await Rental.findByIdAndDelete(req.params.id)

  if (!rental)
    return res
      .status(404)
      .json({ message: 'No rental found with the given id' })

  res.json({ message: 'Rental deleted', data: rental })
}

export default {
  createRental,
  getRentals,
  getRental,
  updateRental,
  deleteRental,
}
