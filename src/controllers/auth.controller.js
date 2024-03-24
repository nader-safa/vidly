import Joi from 'joi'
import debug from 'debug'
import bcrypt from 'bcrypt'
import _ from 'lodash'

import User from '../models/user.model.js'

const serverDebug = debug('vidly:server')

const userJoiSchema = Joi.object({
  email: Joi.string().min(5).max(255).required().email(),
  password: Joi.string()
    .min(8)
    .max(255)
    .required()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/
    ),
})

// createUser
const registerUser = async (req, res) => {
  try {
    const { error } = userJoiSchema.validate(req.body)
    if (error)
      return res.status(400).json({ message: error.details[0].message })

    const user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).json({ message: 'User already exists' })

    const newUser = await User.create(req.body)

    res.status(201).json({
      message: 'User created successfully',
      data: _.pick(newUser, ['_id', 'name', 'email']) || newUser,
    })
  } catch (err) {
    serverDebug('error in createUser:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const loginUser = async (req, res) => {
  try {
    const { error } = userJoiSchema.validate(req.body)
    if (error)
      return res.status(400).json({ message: error.details[0].message })

    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword)
      return res.status(400).json({ message: 'Invalid credentials' })

    const token = user.generateAuthToken()

    res
      // .cookie('token', token, {
      //   httpOnly: true,
      //   sameSite: 'none',
      //   secure: true,
      // })
      .header('Authorization', `Bearer ${token}`)
      // .header('Access-Control-Expose-Headers', 'Authorization')
      // .header('Access-Control-Allow-Credentials', true)
      .status(200)
      .json({ message: 'User logged in successfully' })
  } catch (err) {
    serverDebug('error in loginUser:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

/**
 * Asynchronous function to retrieve user information.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @return {Promise} a Promise that resolves to user information or an error message
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -isAdmin')
    if (!user) return res.status(404).json({ message: 'User not found' })

    res.json({ message: 'User found', data: user })
  } catch (err) {
    serverDebug('error in getMe:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export default {
  registerUser,
  loginUser,
  getMe,
}
