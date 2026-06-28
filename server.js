require('dotenv').config();

const pool = require('./config/db');
const express = require('express');

//routes
const userRoutes = require('./routes/authRoutes')
const bookRoutes = require('./routes/bookRoutes')
const memberRoutes = require('./routes/memberRoutes')

const app = express();
app.use(express.json());

app.use('/',userRoutes)
app.use('/',bookRoutes)
app.use('/',memberRoutes)


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
