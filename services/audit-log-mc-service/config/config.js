// config/config.js
require('dotenv').config();
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Dialect:', process.env.dialect);

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'Serverh5n&*#', // Update with your actual password
    database: process.env.DATABASE || 'audit_trail_local',
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.dialect || 'postgres',
    dbport: process.env.DB_PORT || 5432,
  },
  local: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'Serverh5n&*#', // Update with your actual password
    database: process.env.DATABASE || 'audit_trail_dev',
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.dialect || 'postgres',
    dbport: process.env.DB_PORT || 5432,
  },
  production: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'Serverh5n&*#', // Update with your actual password
    database: process.env.DATABASE || 'audit_trail',
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.dialect || 'postgres',
    dbport: process.env.DB_PORT || 5432,
  },
}; 