// models/Payment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Sesuaikan dengan config kamu

const Payment = sequelize.define('Payment', {
  oid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    allowNull: false,
    primaryKey: true,
  },
  payment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  transaction_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'transactions',
      key: 'transaction_id',
    },
    allowNull: false,
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  amount_paid: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  payment_method: {
    type: DataTypes.ENUM('cash', 'transfer', 'credit_card'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('paid', 'pending', 'failed'),
    defaultValue: 'pending',
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
  tableName: 'payments',
  timestamps: false,
});

module.exports = Payment;
