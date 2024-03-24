import Mongoose from 'mongoose'
import debug from 'debug'

import Customer, { customerJoiSchema } from '../models/customer.model.js'

const serverDebug = debug('vidly:server')

// createCustomer
const createCustomer = async (req, res) => {
  const { error } = customerJoiSchema.validate(req.body)

  if (error) return res.status(400).json({ message: error.details[0].message })

  if (await Customer.exists(req.body))
    return res.status(400).json({ message: 'Customer already exists' })

  const newCustomer = await Customer.create(req.body)

  res
    .status(201)
    .json({ message: 'Customer created successfully', data: newCustomer })
}

// getCustomers
const getCustomers = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const total = await Customer.countDocuments()

  const customers = await Customer.find()
    .select({ name: 1, _id: 1 })
    .skip((page - 1) * limit)
    .limit(limit)

  res.json({
    message: 'Customers found',
    data: customers,
    limit,
    page,
    total,
  })
}

// getCustomer
const getCustomer = async (req, res) => {
  if (Mongoose.Types.ObjectId.isValid(req.params.id) === false)
    return res.status(400).json({ message: 'Invalid customer id' })

  const customer = await Customer.findById(req.params.id)

  if (!customer) return res.status(404).json({ message: 'Customer not found' })

  res.json({ message: 'Customer found', data: customer })
}

// updateCustomer
const updateCustomer = async (req, res) => {
  if (Mongoose.Types.ObjectId.isValid(req.params.id) === false)
    return res.status(400).json({ message: 'Invalid customer id' })

  const { error } = customerJoiSchema.validate(req.body)

  if (error) return res.status(400).json({ message: error.details[0].message })

  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  if (!customer) return res.status(404).json({ message: 'Customer not found' })

  res.json({ message: 'Customer updated successfully', data: customer })
}

// deleteCustomer
const deleteCustomer = async (req, res) => {
  if (Mongoose.Types.ObjectId.isValid(req.params.id) === false)
    return res.status(400).json({ message: 'Invalid customer id' })

  const customer = await Customer.findByIdAndDelete(req.params.id)

  if (!customer)
    return res
      .status(404)
      .json({ message: 'No customer found with the given id' })

  res.json({ message: 'Customer deleted successfully', data: customer })
}

export default {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
}
