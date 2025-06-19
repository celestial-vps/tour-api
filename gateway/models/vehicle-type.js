const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VehicleType = sequelize.define('VehicleType', {
  oid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    allowNull: false,
    primaryKey: true,
  },
  vehicleType: {
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
  tableName: 'vehicle_types',
  timestamps: true,
  paranoid: true, // for soft deletes using deletedAt
});

// @ts-ignore
VehicleType.associate = (models) => {
  // Add associations here if needed
  VehicleType.hasMany(models.Vehicle, {
    foreignKey: 'vehicleOid',
    as: 'vehicles', // Optional alias
    onDelete: 'CASCADE',
  });
};

module.exports = VehicleType;
