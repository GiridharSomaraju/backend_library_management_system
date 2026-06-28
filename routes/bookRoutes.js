const express = require("express")
const router = express.Router()
const {authMiddleware,authorizeRole} = require("../middleware/authMiddleware")
const { getBooks, specificBook, addBook, deleteBook, updateBook, borrowBook, returnBook } = require("../controllers/bookController");

router.get('/api/books',authMiddleware,getBooks);
router.get('/api/books/:id',authMiddleware,authorizeRole(['librarian']),specificBook);
router.post('/api/books', authMiddleware, authorizeRole(['librarian']),addBook);
router.delete('/api/books/:id',authMiddleware,authorizeRole(['librarian']),deleteBook);
router.put('/api/books/:id', authMiddleware, authorizeRole(['librarian']),updateBook);
router.post('/api/books/:id/borrow',authMiddleware,authorizeRole(['member']),borrowBook);
router.post(
  '/api/books/:id/return',
  authMiddleware,
  authorizeRole(['member']),
  returnBook,
);

module.exports = router