const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TravelBooking = sequelize.define('TravelBooking', {
  oid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  customerOid: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'customers',
      key: 'oid',
    }
  },
  scheduleOid: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'travelSchedules',
      key: 'oid',
    }
  },
  seatNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    }
  },
  status: {
    type: DataTypes.ENUM('reserved', 'paid', 'cancelled', 'completed'),
    defaultValue: 'reserved',
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.ENUM('unpaid', 'paid', 'refunded'),
    defaultValue: 'unpaid',
    allowNull: false,
  },
  bookedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
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
  tableName: 'travel_bookings',
  timestamps: true,
  paranoid: true,
});

// Associations
// @ts-ignore
TravelBooking.associate = (models) => {
  // Relasi ke Customer
  TravelBooking.belongsTo(models.Customer, {
    foreignKey: 'customerOid',
    as: 'customer',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  });

  // Relasi ke Schedule
  TravelBooking.belongsTo(models.TravelSchedule, {
    foreignKey: 'scheduleOid',
    as: 'travelSchedule',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  });
};

module.exports = TravelBooking;
