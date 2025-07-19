const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Customer = sequelize.define('Customer', {
  oid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userOid: {
    type: DataTypes.UUID,
    allowNull: true, // Nullable, karena bisa tanpa login
    references: {
      model: 'users',
      key: 'oid',
    }
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  customerPostalCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bankOid: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'banks',
      key: 'oid',
    }
  },
  lastModifiedBy: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  deletedBy: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'customers',
  timestamps: true,
  paranoid: true,
});

// Associations
// @ts-ignore
Customer.associate = (models) => {
  // Relasi ke User (optional)
  Customer.belongsTo(models.User, {
    foreignKey: 'userOid',
    as: 'user',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });

  // Relasi ke Bank
  Customer.belongsTo(models.Bank, {
    foreignKey: 'bankOid',
    as: 'bank',
    onDelete: 'CASCADE',
  });
};

module.exports = Customer;
