require('dotenv').config();

const pool = require('./config/db');
const express = require('express');

//routes
const userRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const memberRoutes = require('./routes/memberRoutes');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send({
    project: 'Library Management System API',
    version: '1.0.0',
    status: 'success',
    message: 'Welcome to the Library Management System API'
  });
});

app.use('/', userRoutes);
app.use('/', bookRoutes);
app.use('/', memberRoutes);

//server database connection
const connectDBWithServer = async () => {
  try {
    app.listen(process.env.PORT, () => {
      console.log(`server running at port ${process.env.PORT}`);
    });
  } catch (e) {
    console.log(`Database Error : ${e.message}`);
    process.exit(1);
  }
};

connectDBWithServer();
