import mongoose from 'mongoose'

import Genre, { genreJoiSchema } from '../models/genre.model.js'

// createGenre
const createGenre = async (req, res) => {
  const { error } = genreJoiSchema.validate(req.body)

  if (error) return res.status(400).json({ message: error.details[0].message })

  if (await Genre.exists(req.body))
    return res.status(400).json({ message: 'Genre already exists' })

  const newGenre = await Genre.create(req.body)

  res.json({ message: 'Genre created successfully', data: newGenre })
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

  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const total = await Genre.countDocuments()
  const genres = await Genre.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .select({ name: 1, _id: 1 })

  if (!genres) return res.status(404).json({ message: 'No genres found' })

  res.json({
    message: 'Genres found',
    data: genres,
    limit,
    page,
    total,
  })
}

// getGenre
const getGenre = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ message: 'Invalid genre id' })

  const genre = await Genre.findOne({ _id: req.params.id })

  if (!genre)
    return res.status(404).json({ message: 'No genre found with the given id' })

  res.json({ message: 'Genre found', data: genre })
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

  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ message: 'Invalid genre id' })

  const { error } = genreJoiSchema.validate(req.body)

  if (error) return res.status(400).json({ message: error.details[0].message })

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    {
      new: true, // return the updated document
    }
  )

  if (!genre)
    return res.status(404).json({ message: 'No genre found with the given id' })

  res.json({ message: 'Genre updated successfully', data: genre })
}

// deleteGenre
const deleteGenre = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ message: 'Invalid genre id' })

  const genre = await Genre.findByIdAndDelete(req.params.id)

  if (!genre)
    return res.status(404).json({ message: 'No genre found with the given id' })

  res.json({ message: 'Genre deleted successfully', data: genre })
}

export default { createGenre, getGenres, getGenre, updateGenre, deleteGenre }
