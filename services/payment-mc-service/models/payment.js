// src/models/payment.js
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('payments', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending',
    },
    method: {
      type: DataTypes.STRING, // e.g., 'credit_card', 'paypal'
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    }
  }, {
    tableName: 'payments',
    timestamps: true,
  });

  return Payment;
};
