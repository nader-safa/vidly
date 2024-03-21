import Mongoose from 'mongoose'
import Joi from 'joi'
import { objectIdRegex } from '../utils.js'

export const rentalJoiSchema = Joi.object({
  customerId: Joi.string().regex(objectIdRegex).required(),
  movieId: Joi.string().regex(objectIdRegex).required(),
})

export const rentalSchema = new Mongoose.Schema({
  customer: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  movie: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  dateModified: {
    type: Date,
    default: Date.now,
  },
})

export default Mongoose.model('Rental', rentalSchema)
