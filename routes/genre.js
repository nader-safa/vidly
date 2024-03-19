const express = require('express')
const Joi = require('joi')

const router = express.Router()

const genreSchema = Joi.object({
  name: Joi.string().min(3).required(),
})

const genres = [
  { id: 1, name: 'horror' },
  { id: 2, name: 'action' },
  { id: 3, name: 'romance' },
]

router.get('/', (req, res) => {
  res.json(genres)
})

router.get('/:id', (req, res) => {
  const genre = genres.find((genre) => genre.id === parseInt(req.params.id))

  if (!genre)
    return res.status(404).json({ message: 'No genre found with the given id' })

  res.json(genre)
})

router.post('/', (req, res) => {
  const { error } = genreSchema.validate(req.body)

  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  if (genres.find((genre) => genre.name === req.body.name)) {
    return res.status(400).json({ message: 'Genre already exists' })
  }

  const newGenre = { id: genres.length + 1, name: req.body.name }

  genres.push(newGenre)

  res.json({ message: 'Genre added successfully', data: newGenre })
})

router.delete('/:id', (req, res) => {
  const genre = genres.find((genre) => genre.id === parseInt(req.params.id))

  if (!genre)
    return res.status(404).json({ message: 'No genre found with the given id' })

  genres = genres.filter((genre) => {
    genre.id !== parseInt(req.params.id)
  })

  res.json(genre)
})

module.exports = router
