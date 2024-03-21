import { customerSchema } from '../models/customer.model.js'
import { genreSchema } from '../models/genre.model.js'
import { movieSchema } from '../models/movie.model.js'
import { rentalSchema } from '../models/rental.model.js'

rentalSchema.pre('save', function (next) {
  this.dateModified = Date.now()
  next()
})

customerSchema.pre('save', function (next) {
  this.dateModified = Date.now()
  next()
})

genreSchema.pre('save', function (next) {
  this.dateModified = Date.now()
  next()
})

movieSchema.pre('save', function (next) {
  this.dateModified = Date.now()
  next()
})
