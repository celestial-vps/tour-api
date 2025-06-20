const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  oid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    allowNull: false,
    primaryKey: true,
  },

  transactionOid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  customerOid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  referenceType: {
    type: DataTypes.ENUM('rental', 'hotel', 'tutor'),
    allowNull: false,
  },
  referenceOid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  serviceName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('booked', 'completed', 'cancelled', 'pending'),
    defaultValue: 'booked',
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
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
  tableName: 'transactions',
  timestamps: true,
  paranoid: true, // for soft deletes using deletedAt
});

// @ts-ignore
Transaction.associate = (models) => {
  // Add associations here if needed
};

module.exports = Transaction;
