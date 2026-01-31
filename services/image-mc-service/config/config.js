// config/config.js
require('dotenv').config();
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Dialect:', process.env.dialect);
module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'Serverh5n&*#', // Update with your actual password
    database: process.env.DATABASE || 'tourdb_image',
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.dialect || 'postgres',
  },
  test: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'Serverh5n&*#', // Update with your actual password
    database: process.env.DATABASE || 'tourdb_image',
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.dialect || 'postgres',
  },
  production: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'Serverh5n&*#', // Update with your actual password
    database: process.env.DATABASE || 'tourdb_image',
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.dialect || 'postgres',
  },
}; 