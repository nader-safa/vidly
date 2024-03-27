import _ from 'lodash'
import User, { userJoiSchema } from '../models/user.model.js'
import bcrypt from 'bcrypt'

// createUser
const createUser = async (req, res) => {
  const { error } = userJoiSchema.validate(req.body)
  if (error) return res.status(400).json({ message: error.details[0].message })

  const user = await User.findOne({ email: req.body.email })

  if (user) return res.status(400).json({ message: 'User already exists' })

  const salt = await bcrypt.genSalt()
  const newUser = await User.create({
    ...req.body,
    password: await bcrypt.hash(req.body.password, salt),
  })

  const token = newUser.generateAuthToken()

  res
    .header('Authorization', `Bearer ${token}`)
    // .header('Access-Control-Expose-Headers', 'Authorization')
    // .header('Access-Control-Allow-Credentials', true)
    .status(201)
    .json({
      message: 'User created successfully',
      data: _.pick(newUser, ['_id', 'name', 'email']) || newUser,
    })
}

// getUsers
const getUsers = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10
  const page = parseInt(req.query.page) || 1
  const count = await User.countDocuments()

  const users = await User.find()
    .select('-password')
    .sort('-dateCreated')
    .limit(limit)
    .skip((page - 1) * limit)

  res.json({
    message: 'Users found',
    data: users,
    limit,
    page,
    count,
  })
}

export default {
  createUser,
  getUsers,
}
