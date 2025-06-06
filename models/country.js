const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Country = sequelize.define('countries', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, 
        allowNull: false,
        primaryKey: true,
    },
    countryCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    countryName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },  
    countryCurrency: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    lastModifiedBy: {
        type: DataTypes.UUID,
        allowNull: true, // Adjust based on your requirements
    },
    updatedAt: {
        type: DataTypes.DATE,
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
    tableName: 'countries',
    timestamps: true,
    paranoid: true, // for soft deletes using deletedAt
});

// @ts-ignore
Country.associate = (models) => {
    // Add associations here if needed
    Country.hasMany(models.Province, {
        foreignKey: 'countryOid',
        as: 'provinces', // Optional alias
        onDelete: 'CASCADE',
    });
};

module.exports = Country;
