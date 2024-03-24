import Mongoose from 'mongoose'
import Joi from 'joi'
import config from 'config'
import jwt from 'jsonwebtoken'

export const userJoiSchema = Joi.object({
  name: Joi.string().min(5).max(50).required(),
  email: Joi.string().min(5).max(255).required().email(),
  password: Joi.string()
    .min(8)
    .max(255)
    .required()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/
    )
    .example('Password123!'),
  // At least one lowercase letter, one uppercase letter, one digit, and one special character, 8 or more characters long
})

export const userSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
    trim: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  dateModified: {
    type: Date,
    default: Date.now,
  },
})

/**
 * Generate authentication token for the user.
 *
 * @return {string} The generated authentication token.
 */
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get('jwt_secret'),
    {
      expiresIn: '1d',
    }
  )
  return token
}

export default Mongoose.model('User', userSchema)
