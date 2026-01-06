// src/config/env.js
const dotenv = require("dotenv");

function loadEnv() {
  dotenv.config();
}

module.exports = { loadEnv };
