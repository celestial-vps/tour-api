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
    type: DataTypes.UUID,
  },
  lastModifiedBy: {
    type: DataTypes.UUID,
  },
  deletedBy: {
    type: DataTypes.UUID,
  },
  deletedAt: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'brands',
  timestamps: true,
  paranoid: true, // for soft deletes using deletedAt
});

// @ts-ignore
Currency.associate = (models) => {
  // Add associations here if needed
};

module.exports = Currency;
