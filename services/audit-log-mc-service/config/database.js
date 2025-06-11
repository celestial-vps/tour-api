// config/sequelize.js
const { Sequelize } = require('sequelize');
const config = require('./config'); // Ensure this path is correct
const environment = process.env.NODE_ENV || 'development';
const sequelizeConfig = config[environment];

const sequelize = new Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, {
  logging: console.log, // Enable query logging
  host: sequelizeConfig.host,
  dialect: sequelizeConfig.dialect,
  define: {
    timestamps: false,
  },
});

module.exports = sequelize;
