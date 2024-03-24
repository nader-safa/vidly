import Mongoose from 'mongoose'
import debug from 'debug'

import Movie, { movieJoiSchema } from '../models/movie.model.js'
import Genre from '../models/genre.model.js'

const serverDebug = debug('vidly:server')

// createMovie
const createMovie = async (req, res) => {
  const { error } = movieJoiSchema.validate(req.body)

  if (error) return res.status(400).json({ message: error.details[0].message })

  if (Mongoose.Types.ObjectId.isValid(req.body.genreId) === false)
    return res.status(400).json({ message: 'Invalid genre id' })

  const genre = await Genre.findById(req.body.genreId, 'name _id')

  if (!genre) return res.status(400).json({ message: 'Genre id not found' })

  if (await Movie.exists(req.body))
    return res.status(400).json({ message: 'Movie already exists' })

  const newMovie = await Movie.create({
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    genre,
  })

  res
    .status(201)
    .json({ message: 'Movie created successfully', data: newMovie })
}

// getMovies
const getMovies = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const total = await Movie.countDocuments()

  const movies = await Movie.find()
    .skip((page - 1) * limit)
    .limit(limit)

  res.json({
    message: 'Movies found',
    data: movies,
    limit,
    page,
    total,
  })
}

// getMovie
const getMovie = async (req, res) => {
  if (Mongoose.Types.ObjectId.isValid(req.params.id) === false)
    return res.status(400).json({ message: 'Invalid movie id' })

  const movie = await Movie.findById(req.params.id)

  if (!movie) return res.status(404).json({ message: 'Movie not found' })

  res.json({ message: 'Movie found', data: movie })
}

// updateMovie
const updateMovie = async (req, res) => {
  if (Mongoose.Types.ObjectId.isValid(req.params.id) === false)
    return res.status(400).json({ message: 'Invalid movie id' })

  const movie = await Movie.findById(req.params.id)

  if (!movie) return res.status(404).json({ message: 'Movie not found' })

  const { error } = movieJoiSchema.validate(req.body)

  if (error) return res.status(400).json({ message: error.details[0].message })

  const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.json({ message: 'Movie updated successfully', data: updatedMovie })
}

// deleteMovie
const deleteMovie = async (req, res) => {
  if (Mongoose.Types.ObjectId.isValid(req.params.id) === false)
    return res.status(400).json({ message: 'Invalid movie id' })

  const movie = await Movie.findByIdAndDelete(req.params.id)

  if (!movie)
    return res.status(404).json({ message: 'No movie found with the given id' })

  res.json({ message: 'Movie deleted successfully', data: movie })
}

export default {
  createMovie,
  getMovies,
  getMovie,
  deleteMovie,
  updateMovie,
}
