const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehicle = sequelize.define('Vehicle', {
  oid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    allowNull: false,
    primaryKey: true,
  },
  vehicleTypeOid: {  // Correct foreign key name
    type: DataTypes.UUID,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('available', 'rented', 'service'),
    defaultValue: 'available',
  },
  price_per_day: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.UUID, // Corrected to DataTypes.UUID
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Corrected to DataTypes.NOW
  },
  lastModifiedBy: {
    type: DataTypes.UUID, // Corrected to DataTypes.UUID
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
  deletedBy: {
    type: DataTypes.UUID, // Corrected to DataTypes.UUID
  },
  deletedAt: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'vehicles',
  timestamps: true,
  paranoid: true, // for soft deletes using deletedAt
});

// Associations
Vehicle.associate = (models) => {
  // A vehicle belongs to a VehicleType
  Vehicle.belongsTo(models.VehicleType, {
    foreignKey: 'vehicleTypeOid', // Correct foreign key
    as: 'vehicleType',           // Alias for association
    onDelete: 'CASCADE',
  });
};

module.exports = Vehicle;
