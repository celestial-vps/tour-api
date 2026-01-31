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
  paymentOid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  transactionOid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  amountPaid: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'transfer', 'credit_card'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('paid', 'pending', 'failed'),
    defaultValue: 'pending',
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
  tableName: 'payments',
  timestamps: false,
});

module.exports = Payment;
