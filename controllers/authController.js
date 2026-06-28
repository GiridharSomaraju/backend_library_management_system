const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// user register API
const userRegister = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (role !== 'member') {
      return res.status(400).send('role must be member');
    }
    const dbUser = `SELECT * FROM users WHERE email = $1`;
    const existedUser = await pool.query(dbUser, [email]);
    if (existedUser.rowCount !== 0) {
      return res.status(409).json({ message: 'Email Already Exists' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password is too Short' });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const insertUserQuery = `INSERT INTO users(name,email,password,role)
                                        VALUES($1,$2,$3,$4)`;
    await pool.query(insertUserQuery, [name, email, hashPassword, role]);
    res.status(201).json({ code: 0, message: 'User Registered Successfully' });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

//login User

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const dbUser = `SELECT * FROM users WHERE email = $1 AND is_deleted = FALSE;`;
    const resultUser = await pool.query(dbUser, [email]);
    if (resultUser.rowCount === 0) {
      return res.status(401).send('Invalid email or password');
    }
    const existedUser = resultUser.rows[0];
    const isPasswordMatched = await bcrypt.compare(
      password,
      existedUser.password,
    );
    if (isPasswordMatched) {
      const payload = {
        id: existedUser.id,
        role: existedUser.role,
      };
      const jwtToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: '1h',
      });
      res.status(200).json({ token: jwtToken });
    } else {
      res.status(401).send('Invalid email or password');
    }
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

module.exports = { userRegister, userLogin };
