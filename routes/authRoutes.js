const express = require("express");
const { userLogin, userRegister } = require("../controllers/authController");
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router()


router.post('/api/auth/register',userRegister);
router.post('/api/auth/login',userLogin);

module.exports = router