// config/config.js
require('dotenv').config();
module.exports = {
  development: {
    username: 'root',
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: 'localhost',
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: 'localhost',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: 'localhost',
    dialect: 'mysql',
  },
};
