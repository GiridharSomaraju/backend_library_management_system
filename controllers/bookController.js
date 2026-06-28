const pool = require('../config/db');

// get books API

const getBooks = async (req, res) => {
  try {
    const getAllBooks = `SELECT * FROM books WHERE is_deleted = FALSE;`;
    const result = await pool.query(getAllBooks);
    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'No books found',
      });
    }
    const availBooks = result.rows;
    res.status(200).send(availBooks);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

//get a specific book API

const specificBook = async (req, res) => {
  try {
    const { id } = req.params;
    const getBook = `SELECT * FROM books WHERE id = $1 AND is_deleted = FALSE;`;
    const result = await pool.query(getBook, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'book not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

//add book API

const addBook = async (req, res) => {
  try {
    const { title, author, isbn, category, quantity } = req.body;
    const insertBookQuery = `INSERT INTO books(title,author,isbn,category,quantity,available_quantity)
                                VALUES($1,$2,$3,$4,$5,$5)`;
    const resultQuery = await pool.query(insertBookQuery, [
      title,
      author,
      isbn,
      category,
      quantity,
    ]);
    res.status(201).send('Book Inserted successfully');
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

//update a book API

const updateBook = async (req, res) => {
  try {
    const { title, author, isbn, category, quantity } = req.body;
    const { id } = req.params;
    const book = `SELECT * FROM books WHERE id = $1 AND is_deleted = FALSE`;
    const bookResult = await pool.query(book, [id]);
    if (bookResult.rowCount === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const bookdetails = bookResult.rows[0];
    const quantityDifference = quantity - bookdetails.quantity;
    const updatedAvailableQuantity =
      bookdetails.available_quantity + quantityDifference;

    if (updatedAvailableQuantity < 0) {
      return res.status(412).json({
        success: false,
        message: `Updated quantitiy less than borrowed quantity ${bookdetails.available_quantity}`,
      });
    }

    const updateBookQuery = `UPDATE books SET title = $1,author = $2,isbn=$3,category=$4,quantity=$5,available_quantity = $6 WHERE id = $7 AND is_deleted = FALSE`;
    await pool.query(updateBookQuery, [
      title,
      author,
      isbn,
      category,
      quantity,
      updatedAvailableQuantity,
      id,
    ]);
    res.status(200).json({ message: 'Book Updated successfully' });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

// delete book API

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const checkBookQuery = `SELECT * FROM books WHERE id = $1 AND is_deleted = FALSE`;
    const bookResult = await pool.query(checkBookQuery, [id]);
    if (bookResult.rowCount === 0) {
      return res.status(404).json({
        message: 'Book not found',
      });
    }

    const borrowRecord = `SELECT * FROM borrow_record WHERE bookid = $1 AND status = 'borrowed'`;
    const borrowed = await pool.query(borrowRecord, [id]);
    if (borrowed.rowCount > 0) {
      return res.status(400).json({
        message: 'Cannot delete.Book is currently borrowed',
      });
    }

    const deleteQuery = `UPDATE books SET is_deleted = TRUE WHERE id = $1;`;
    await pool.query(deleteQuery, [id]);
    res.status(200).json({
      message: 'Book deleted successfully',
    });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

//boorow book API

const borrowBook = async (req, res) => {
  try {
    const id = req.id;
    const { id: bookId } = req.params;

    const getBook = `SELECT * FROM books WHERE id = $1 AND is_deleted=FALSE`;
    const resultBook = await pool.query(getBook, [bookId]);
    const book = resultBook.rows[0];
    if (!book) {
      return res.status(404).json({ message: 'book not found' });
    }

    if (book.available_quantity === 0) {
      return res.status(412).json({ message: 'book not available' });
    }

    const borrowRecord = `SELECT * FROM borrow_record WHERE bookid = $1 AND memberid = $2 AND status = 'borrowed'`;
    const result = await pool.query(borrowRecord, [bookId, id]);
    if (result.rowCount != 0) {
      return res.status(409).json({ message: 'book already borrowed' });
    }

    await pool.query('Begin;');

    const borrowQuery = `INSERT INTO borrow_record(memberId,bookId,status)
                                VALUES($1,$2,$3)`;
    const resultQuery = await pool.query(borrowQuery, [id, bookId, 'borrowed']);

    const reduceQuantity = `UPDATE books SET available_quantity = available_quantity - 1 WHERE id = $1`;
    await pool.query(reduceQuantity, [bookId]);

    await pool.query('Commit;');
    res.status(201).json({ message: 'Book Borrowed successfully' });
  } catch (e) {
    await pool.query('Rollback;');
    res.status(500).send({ error: e.message });
  }
};

// return book API

const returnBook = async (req, res) => {
  try {
    const id = req.id;
    const { id: bookId } = req.params;

    const getBook = `SELECT * FROM books WHERE id = $1 AND is_deleted = FALSE`;
    const resultBook = await pool.query(getBook, [bookId]);
    const book = resultBook.rows[0];
    if (!book) {
      return res.status(404).json({ message: 'book not found' });
    }

    const borrowRecord = `SELECT * FROM borrow_record WHERE bookid = $1 AND memberid = $2 AND status = 'borrowed'`;
    const result = await pool.query(borrowRecord,[bookId,id]);
    if (result.rowCount === 0) {
      return res.status(412).json({ message: 'book not borrowed' });
    }

    await pool.query('Begin;');

    const returnQuery = `UPDATE borrow_record SET status = $1,returndate = CURRENT_TIMESTAMP WHERE bookid = $2 AND memberid = $3`;
    const resultQuery = await pool.query(returnQuery, ['returned',bookId,id]);

    const reduceQuantity = `UPDATE books SET available_quantity = available_quantity + 1 WHERE id = $1`;
    await pool.query(reduceQuantity,[bookId]);

    await pool.query('Commit;');
    res.status(200).json({ message: 'Book Returned successfully' });
  } catch (e) {
    await pool.query('Rollback;');
    res.status(500).send({ error: e.message });
    console.log(e);
  }
};

module.exports = {
  getBooks,
  specificBook,
  addBook,
  deleteBook,
  updateBook,
  borrowBook,
  returnBook,
};
