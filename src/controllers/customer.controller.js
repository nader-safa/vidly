import Mongoose from 'mongoose'
import Joi from 'joi'
import debug from 'debug'

import customerModel from '../models/customer.model.js'

// Joi validation
const customerSchema = Joi.object({
  name: Joi.string().min(5).max(50).required(),
  isGold: Joi.boolean(),
  phone: Joi.string().min(5).max(50).required(),
})

const serverDebug = debug('vidly:server')

// createCustomer
const createCustomer = async (req, res) => {
  try {
    const { error } = customerSchema.validate(req.body)

    if (error)
      return res.status(400).json({ message: error.details[0].message })

    if (await customerModel.exists(req.body))
      return res.status(400).json({ message: 'Customer already exists' })

    const newCustomer = await customerModel.create(req.body)

    res.json({ message: 'Customer created successfully', data: newCustomer })
  } catch (err) {
    serverDebug('error in createCustomer:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// getCustomers
const getCustomers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const customers = await customerModel
      .find()
      .select({ name: 1, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit)

    res.json({
      message: 'Customers found',
      data: customers,
      total: customers.length,
      limit: limit,
      page: page,
    })
  } catch (err) {
    serverDebug('error in getCustomers:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// getCustomer
const getCustomer = async (req, res) => {
  try {
    if (Mongoose.Types.ObjectId.isValid(req.params.id) === false) {
      return res.status(400).json({ message: 'Invalid customer ID' })
    }

    const customer = await customerModel.findById(req.params.id)

    if (!customer)
      return res.status(404).json({ message: 'Customer not found' })

    res.json({ message: 'Customer found', data: customer })
  } catch (err) {
    serverDebug('error in getCustomer:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// updateCustomer
const updateCustomer = async (req, res) => {
  try {
    if (Mongoose.Types.ObjectId.isValid(req.params.id) === false) {
      return res.status(400).json({ message: 'Invalid customer ID' })
    }

    const { error } = customerSchema.validate(req.body)

    if (error)
      return res.status(400).json({ message: error.details[0].message })

    const customer = await customerModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    if (!customer)
      return res.status(404).json({ message: 'Customer not found' })

    res.json({ message: 'Customer updated successfully', data: customer })
  } catch (err) {
    serverDebug('error in updateCustomer:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// deleteCustomer
const deleteCustomer = async (req, res) => {
  try {
    if (Mongoose.Types.ObjectId.isValid(req.params.id) === false) {
      return res.status(400).json({ message: 'Invalid customer ID' })
    }

    const customer = await customerModel.findByIdAndDelete(req.params.id)

    if (!customer)
      return res.status(404).json({ message: 'Customer not found' })

    res.json({ message: 'Customer deleted successfully' })
  } catch (err) {
    serverDebug('error in deleteCustomer:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export default {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
}
