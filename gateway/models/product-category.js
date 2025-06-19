const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PrdocutCategory = sequelize.define('product_categories', {
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
  tableName: 'product_categories',
  timestamps: true,
  paranoid: true, // for soft deletes using deletedAt
});

// @ts-ignore
PrdocutCategory.associate = (models) => {
 
};

module.exports = PrdocutCategory;
