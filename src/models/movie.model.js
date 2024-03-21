import Mongoose from 'mongoose'
import Joi from 'joi'
import { genreSchema } from './genre.model.js'
import { objectIdRegex } from '../utils.js'

export const movieJoiSchema = Joi.object({
  title: Joi.string().min(5).max(255).required(),
  genreId: Joi.string().regex(objectIdRegex).required(),
  numberInStock: Joi.number().min(0).required(),
  dailyRentalRate: Joi.number().min(0).required(),
})

export const movieSchema = new Mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
    trim: true,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
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

export default Mongoose.model('Movie', movieSchema)
