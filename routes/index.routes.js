const { isAuthenticated } = require('../middlewares/route-guard.middleware')
const Book = require('../models/Book.model')

const router = require('express').Router()

router.get('/', (req, res) => {
  res.json('All good in here')
})

router.get('/books', async (req, res, next) => {
  try {
    const allBooks = await Book.find().populate('createdBy', { passwordHash: 0 })
    res.status(200).json(allBooks)
  } catch (error) {
    next(error)
  }
})

router.post('/books', isAuthenticated, async (req, res, next) => {
  try {
    const newBook = await Book.create({ ...req.body, createdBy: req.tokenPayload.userId })
    res.status(201).json(newBook)
  } catch (error) {
    next(error)
  }
})

module.exports = router
