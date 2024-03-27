import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'

import errorHandler from '../middlewares/error.js'
import allowCORS from '../middlewares/allowCORS.middleware.js'

import genreRouter from './genre.router.js'
import customerRouter from './customer.router.js'
import movieRouter from './movie.router.js'
import rentalRouter from './rental.router.js'
import userRouter from './user.router.js'
import authRouter from './auth.router.js'
import winston from 'winston'

const createRouters = (app) => {
  app.use(allowCORS)
  app.use(express.json())
  app.use(express.static('public'))
  app.use(helmet())

  if (app.get('env') === 'development') {
    app.use(morgan('dev'))
    winston.info('morgan enabled')
  }

  app.use('/api/genres', genreRouter)
  app.use('/api/customers', customerRouter)
  app.use('/api/movies', movieRouter)
  app.use('/api/rentals', rentalRouter)
  app.use('/api/users', userRouter)
  app.use('/api/auth', authRouter)

  app.use(errorHandler)
}

export default createRouters
