import Mongoose from 'mongoose'
import Joi from 'joi'

// Built-in validators in mongoose
// - required: checks if the field is not empty
// - match: checks if the field matches a certain regex
// - enum: checks if the field is one of a set of values
// - minlength: checks if the field is at least a certain length
// - maxlength: checks if the field is at most a certain length
// - min: checks if the field is at least a certain number
// - max: checks if the field is at most a certain number

// Fields manipulation
// - lowercase: converts the field to lowercase
// - uppercase: converts the field to uppercase
// - trim: removes whitespace from the beginning and end of the field
// - get: function called when the field is accessed to manipulate it
// - set: function called when the field is set to manipulate it

export const genreSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
    trim: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  dateModified: {
    type: Date,
    default: Date.now,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
})

export default Mongoose.model('Genre', genreSchema)

export const genreJoiSchema = Joi.object({
  name: Joi.string().min(5).max(50).required(),
  dateCreated: Joi.date(),
  dateModified: Joi.date(),
  isPublished: Joi.boolean(),
})
