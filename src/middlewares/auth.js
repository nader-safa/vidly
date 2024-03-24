import jwt from 'jsonwebtoken'
import config from 'config'
import User from '../models/user.model.js'

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    if (!token) throw new Error('Access denied. No token provided')
    const decoded = jwt.verify(token, config.get('jwt_secret'))
    const user = await User.findOne({
      _id: decoded._id,
    })
    if (!user) throw new Error()
    req.token = token
    req.user = user
    next()
  } catch (err) {
    res.status(401).json({ error: 'Access denied.' })
  }
}

export const adminProtected = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) throw new Error()
    next()
  } catch (err) {
    res
      .status(403)
      .json({
        error: 'Access denied. You are not allowed to perform this action',
      })
  }
}
