import Mongoose from 'mongoose'
import Joi from 'joi'
import { genreSchema } from './genre.model.js'

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
})

export default Mongoose.model('Movie', movieSchema)

export const movieJoiSchema = Joi.object({
  title: Joi.string().min(5).max(255).required(),
  genreId: Joi.string().required(),
  numberInStock: Joi.number().min(0).required(),
  dailyRentalRate: Joi.number().min(0).required(),
})
