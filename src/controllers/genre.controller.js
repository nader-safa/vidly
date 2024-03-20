import genreModel from '../models/genre.model.js'
import Joi from 'joi'
import debug from 'debug'
import mongoose from 'mongoose'

const serverDebug = debug('vidly:server')

// Joi validation
const genreSchema = Joi.object({
  name: Joi.string().min(3),
})

// createGenre
const createGenre = async (req, res) => {
  try {
    const { error } = genreSchema.validate(req.body)

    if (error)
      return res.status(400).json({ message: error.details[0].message })

    if (await genreModel.exists(req.body))
      return res.status(400).json({ message: 'Genre already exists' })

    const newGenre = await genreModel.create(req.body)

    res.json({ message: 'Genre added successfully', data: newGenre })
  } catch (err) {
    serverDebug('error in createGenre:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// getGenres
const getGenres = async (req, res) => {
  try {
    const genres = await genreModel.find()

    if (!genres) return res.status(404).json({ message: 'No genres found' })

    res.json({ message: 'Genres found', data: genres })
  } catch (err) {
    serverDebug('error in getGenres:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// getGenre
const getGenre = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'Invalid genre id' })

    const genre = await genreModel.findOne({ _id: req.params.id })

    if (!genre)
      return res
        .status(404)
        .json({ message: 'No genre found with the given id' })

    res.json({ message: 'Genre found', data: genre })
  } catch (err) {
    serverDebug('error in getGenre:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// updateGenre
const updateGenre = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'Invalid genre id' })

    const { error } = genreSchema.validate(req.body)

    if (error)
      return res.status(400).json({ message: error.details[0].message })

    const genre = await genreModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })

    if (!genre)
      return res
        .status(404)
        .json({ message: 'No genre found with the given id' })

    res.json({ message: 'Genre updated successfully', data: genre })
  } catch (err) {
    serverDebug('error in updateGenre:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// deleteGenre
const deleteGenre = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'Invalid genre id' })

    const genre = await genreModel.findByIdAndDelete(req.params.id)

    if (!genre)
      return res
        .status(404)
        .json({ message: 'No genre found with the given id' })

    res.json({ message: 'Genre deleted successfully', data: genre })
  } catch (err) {
    serverDebug('error in deleteGenre:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export default { createGenre, getGenres, getGenre, updateGenre, deleteGenre }
