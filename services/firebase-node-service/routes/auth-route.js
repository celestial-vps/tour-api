// routes/auth.route.js
const express = require('express');
const router = express.Router();
const { loginWithGoogle } = require('../controllers/auth.controller');

router.post("/login/google", loginWithGoogle);

module.exports = router;
