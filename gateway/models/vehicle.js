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
    type: DataTypes.STRING(4), // Assuming year is a 4-digit string
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
  pricePerDay: {
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
  tableName: 'vehicles',
  timestamps: true,
  paranoid: true, // for soft deletes using deletedAt
});

// Associations
// @ts-ignore
Vehicle.associate = (models) => {
  // A vehicle belongs to a VehicleType
  Vehicle.belongsTo(models.VehicleType, {
    foreignKey: 'vehicleTypeOid', // Correct foreign key
    as: 'vehicleType',           // Alias for association
    onDelete: 'CASCADE',
  });
};

module.exports = Vehicle;
