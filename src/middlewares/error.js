import winston from 'winston'

/**
 * Error handler middleware.
 * Logs the error, sends a 500 status response with the error message.
 *
 * @param {Error} err - The error object
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function
 * @return {Object} - The JSON response object with error message and status
 */
const errorHandler = (err, req, res, next) => {
  // Log the error message
  winston.error(err.message, err)

  // Send a 500 status response with the error message
  res.status(500).json({
    error: err.message,
    message: 'Internal server error',
  })
}

export default errorHandler
