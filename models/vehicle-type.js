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
    countryName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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
    tableName: 'vehicle-types',
    timestamps: true,
    paranoid: true, // for soft deletes using deletedAt
});

VehicleType.associate = (models) => {
    // Add associations here if needed
    VehicleType.hasMany(models.Vehicle, {
        foreignKey: 'vehicleOid',
        as: 'vehicles', // Optional alias
        onDelete: 'CASCADE',
    });
};

module.exports = VehicleType;
