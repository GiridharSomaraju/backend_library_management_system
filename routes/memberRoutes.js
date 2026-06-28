const express = require("express")
const router = express.Router()
const {authMiddleware,authorizeRole} = require("../middleware/authMiddleware")
const { getMembers, deleteMember, getBorrowedBooks } = require("../controllers/memberController");


router.get('/api/members',authMiddleware,authorizeRole(['librarian']),getMembers);
router.delete('/api/members/:id',authMiddleware,authorizeRole(['librarian']),deleteMember);
router.get(
  '/api/members/me/books',
  authMiddleware,
  authorizeRole(['member']),
  getBorrowedBooks,
);

module.exports = router