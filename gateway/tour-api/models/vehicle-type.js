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
  typeName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
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
  tableName: 'vehicle_types',
  timestamps: true,
  paranoid: true, // for soft deletes using deletedAt
});

// @ts-ignore
VehicleType.associate = (models) => {
  // Add associations here if needed
  VehicleType.hasMany(models.Vehicle, {
    foreignKey: 'vehicleTypeOid',
    as: 'vehicles', // Optional alias
    onDelete: 'CASCADE',
  });
};

module.exports = VehicleType;
