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
  lastModifiedBy: {
    type: DataTypes.UUID,
    allowNull: true, // Adjust based on your requirements
  },
  deletedBy: {
    type: DataTypes.UUID,
    allowNull: true, // Adjust based on your requirements
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true, // Adjust based on your requirements    
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
