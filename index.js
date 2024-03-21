import express from 'express'
import Mongoose from 'mongoose'
import config from 'config'
import morgan from 'morgan'
import helmet from 'helmet'
import debug from 'debug'

import allowCORS from './src/middlewares/allowCORS.middleware.js'

import genreRouter from './src/routes/genre.router.js'
import customerRouter from './src/routes/customer.router.js'
import movieRouter from './src/routes/movie.router.js'

const app = express()

const startupDebug = debug('vidly:startup')

/**
 * Connects to the MongoDB database using the provided configuration.
 *
 * @return {Promise} A Promise that resolves when the connection is successful and rejects when an error occurs.
 */
Mongoose.connect(
  `mongodb+srv://${config.get('db.user')}:${config.get(
    config.get('env') === 'production' ? 'db.prod_password' : 'db.dev_password'
  )}@${config.get('db.cluster')}/${config.get(
    'db.database'
  )}?retryWrites=true&w=majority`
)
  .then(() => startupDebug('connected to database'))
  .catch((err) => startupDebug('error connecting to database:', err))

// Parses JSON in the request body and populates `req.body` with the parsed object.
app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(helmet())

if (app.get('env') === 'development') {
  app.use(morgan('dev'))
  startupDebug('morgan enabled')
}

/**
 * Middleware to allow CORS requests.
 *
 * @name CORS Middleware
 * @function
 * @memberof module:index
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
app.use(allowCORS)

/**
 * Mounts the genre router on the '/api/genres' path.
 *
 * @name Mount genre router
 * @function
 * @memberof module:index
 * @inner
 * @param {string} path - The path where the router will be mounted.
 * @param {Object} router - The genre router.
 * @returns {void}
 */
app.use('/api/genres', genreRouter)
app.use('/api/customers', customerRouter)
app.use('/api/movies', movieRouter)

const port = config.get('port') || 3000

/**
 * Starts the express app and listens on the specified port.
 *
 * @return {void} This function does not return anything.
 */
app.listen(port, () => startupDebug(`app started on port ${port}...`))
