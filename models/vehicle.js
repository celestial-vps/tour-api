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
      }
}, {
    tableName: 'vehicles',
    timestamps: true,
    paranoid: true, // for soft deletes using deletedAt
});

Vehicle.associate = (models) => {
    // Add associations here if needed
};

module.exports = Vehicle;
