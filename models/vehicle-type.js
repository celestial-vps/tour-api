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
}, {
    tableName: 'vehicle-types',
    timestamps: true,
    paranoid: true, // for soft deletes using deletedAt
});

VehicleType.associate = (models) => {
    // Add associations here if needed
};

module.exports = VehicleType;
