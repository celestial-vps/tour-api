const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PrdocutCategory = sequelize.define('ProductCategory', {
  oid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    allowNull: false,
    primaryKey: true,
  },
  categoryName: {
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
  tableName: 'product_categories',
  timestamps: true,
  paranoid: true, // for soft deletes using deletedAt
});

// @ts-ignore
PrdocutCategory.associate = (models) => {
 
};

module.exports = PrdocutCategory;
