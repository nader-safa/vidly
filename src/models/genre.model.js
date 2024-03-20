import Mongoose from 'mongoose'

const genreSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
})

export default Mongoose.model('Genre', genreSchema)
