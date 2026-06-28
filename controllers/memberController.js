const pool = require('../config/db');

//get members API

const getMembers = async (req, res) => {
  try {
    const getAllMembersQuery = `SELECT * FROM users WHERE role = 'member' AND  is_deleted = FALSE`;
    const result = await pool.query(getAllMembersQuery);
    const members = result.rows;
    for (let member of members) {
      delete member.password;
    }
    res.status(200).send({ members });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

// get specific member API

const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const getMember = `SELECT * FROM users WHERE id = $1 AND is_deleted = FALSE`;
    const resultMember = await pool.query(getMember, [id]);
    if (resultMember.rowCount === 0) {
      return res.status(404).json({ message: 'user not found' });
    }
    if (req.id === id) {
      return res
        .status(409)
        .json({ message: 'You cannot delete your own account' });
    }
    const borrowedBooks = `SELECT * FROM borrow_record WHERE memberid = $1 AND status = 'borrowed';`;

    const borrowedResult = await pool.query(borrowedBooks, [id]);

    if (borrowedResult.rowCount > 0) {
      return res.status(400).json({
        message: 'Member has borrowed books. Cannot delete.',
      });
    }
    const getUser = `UPDATE users SET is_deleted = TRUE WHERE id = $1;`;
    await pool.query(getUser, [id]);
    return res.status(200).json({ message: 'Member Deleted Successfully' });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

//my borrowed books

const getBorrowedBooks = async (req, res) => {
  try {
    const id = req.id;
    const getBorrowBooks = `SELECT * FROM borrow_record br INNER JOIN books b ON br.bookid = b.id WHERE memberid = $1`;
    const resultBooks = await pool.query(getBorrowBooks, [id]);

    for (let resultBook of resultBooks.rows) {
      delete resultBook.available_quantity;
      delete resultBook.quantity;
    }

    res.status(200).json(resultBooks.rows);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

module.exports = { getMembers, deleteMember, getBorrowedBooks };
