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
const allowCORS = (req, res, next) => {
  // Allow CORS requests from any origin
  res.header('Access-Control-Allow-Origin', '*')

  // Allow specific headers
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )

  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    // Allow specific methods
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).json({})
  }

  // Call the next middleware
  next()
}

export default allowCORS
