import Mongoose from 'mongoose'

export default Mongoose.model(
  'Customer',
  new Mongoose.Schema({
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
  })
)
