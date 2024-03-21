import debug from 'debug'
import mongoose from 'mongoose'

import genreModel, { genreSchema } from '../models/genre.model.js'

const serverDebug = debug('vidly:server')

// createGenre
const createGenre = async (req, res) => {
  try {
    const { error } = genreSchema.validate(req.body)

    if (error)
      return res.status(400).json({ message: error.details[0].message })

    if (await genreModel.exists(req.body))
      return res.status(400).json({ message: 'Genre already exists' })

    const newGenre = await genreModel.create(req.body)

    res.json({ message: 'Genre created successfully', data: newGenre })
  } catch (err) {
    serverDebug('error in createGenre:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// getGenres
const getGenres = async (req, res) => {
  // Comparison Operators:

  // - $eq: equal to
  // - $ne: not equal to
  // - $in: in
  // - $nin: not in
  // - $gt: greater than
  // - $lt: less than
  // - $gte: greater than or equal to
  // - $lte: less than or equal to

  // Logical Operators:

  // - $and: and
  // - $or: or
  // - $not: not
  // - $nor: nor

  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const genres = await genreModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .select({ name: 1, _id: 1 })
    // .count()
    if (!genres) return res.status(404).json({ message: 'No genres found' })

    res.json({
      message: 'Genres found',
      data: genres,
      page,
      limit,
      total: genres.length,
    })
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
  // Update Operators:

  // - $set: set the value of the field to the specified value
  // - $inc: increment the value of the field by the specified amount
  // - $min: only update if the value of the field is greater than the specified value
  // - $max: only update if the value of the field is less than the specified value
  // - $mul: multiply the value of the field by the specified amount
  // - $rename: rename the field to the specified value
  // - $unset: unset the value of the field.
  // - $currentDate: set the value of the field to the current date

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'Invalid genre id' })

    const { error } = genreSchema.validate(req.body)

    if (error)
      return res.status(400).json({ message: error.details[0].message })

    const genre = await genreModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true, // return the updated document
      }
    )

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
