const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TravelOutlet = sequelize.define('TravelOutlet', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, 
        allowNull: false,
        primaryKey: true,
    }, 
    outletName: {
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
    tableName: 'travel_outlets',
    timestamps: true,
    paranoid: true, // for soft deletes using deletedAt
});

// @ts-ignore
TravelOutlet.associate = (models) => {
   
};

module.exports = TravelOutlet;
