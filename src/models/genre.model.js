import Mongoose from 'mongoose'

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

export default Mongoose.model(
  'Genre',
  new Mongoose.Schema({
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
    price: {
      type: Number,
      min: 0,
      required: function () {
        return this.isPublished
      },
    },
    tags: {
      type: [String],
      validate: {
        // custom validator
        isAsync: true,
        validator: function (value, callback) {
          const result = value && value.length > 0
          callback(result)
        },
        message: 'Genre must have at least one tag',
      },
    },
  })
)
