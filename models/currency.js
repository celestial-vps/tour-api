const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Currency = sequelize.define('Currency', {
  oid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    allowNull: false,
    primaryKey: true,
  },
  currencyName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  currencySymbol: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  createdBy: {
    type: Sequelize.UUID,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  lastModifiedBy: {
    type: Sequelize.UUID,
  },
  updatedAt: {
    type: Sequelize.DATE,
  },
  deletedBy: {
    type: Sequelize.UUID,
  },
  deletedAt: {
    type: Sequelize.DATE,
  },
}, {
  tableName: 'brands',
  timestamps: true,
  paranoid: true, // for soft deletes using deletedAt
});

Currency.associate = (models) => {
  // Add associations here if needed
};

module.exports = Currency;
