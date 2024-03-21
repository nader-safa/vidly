import Mongoose from 'mongoose'
import Joi from 'joi'

export const customerJoiSchema = Joi.object({
  name: Joi.string().min(5).max(50).required(),
  isGold: Joi.boolean(),
  phone: Joi.string().min(5).max(50).required(),
})

export const customerSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
    trim: true,
  },
  isGold: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
    trim: true,
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

export default Mongoose.model('Customer', customerSchema)
