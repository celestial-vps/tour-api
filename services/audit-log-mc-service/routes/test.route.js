// routes/hello.route.js
const express = require('express');

const router = express.Router();

// GET /hello
router.get('/', (req, res) => {
  res.json({
    message: 'Server Running!',
    env: process.env.NODE_ENV || 'local',
    port: process.env.PORT || 5001
  });
});

module.exports = router;
