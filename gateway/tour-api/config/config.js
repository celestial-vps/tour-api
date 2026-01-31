// config/config.js
require('dotenv').config();
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Dialect:', process.env.DB_DIALECT);

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'Serverh5n&*#', // Update with your actual password
    database: process.env.DATABASE || 'tourdb',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || 'postgres',
  },
  local: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'Serverh5n&*#', // Update with your actual password
    database: process.env.DATABASE || 'tourdb',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || 'postgres',
  },
  production: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'Serverh5n&*#', // Update with your actual password
    database: process.env.DATABASE || 'tourdb',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || 'postgres',
  },
}; 