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

router.delete('/books/:bookId', isAuthenticated, async (req, res, next) => {
  const { bookId } = req.params
  try {
    const bookTarget = await Book.findById(bookId)
    if (bookTarget.createdBy == req.tokenPayload.userId) {
      const newBook = await Book.findByIdAndDelete(bookId)
      res.status(204).json(newBook)
    } else {
      res.status(401).json({ message: 'You cannot delete books that are not yours' })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
