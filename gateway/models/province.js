const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust according to your config

const Province = sequelize.define('Province', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
        primaryKey: true,
    },
    countryOid: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    provinceName: {
        type: DataTypes.STRING,
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
    tableName: 'provinces',
    timestamps: true,
    paranoid: true, // Enable soft deletes using deletedAt
});

// Associations
// @ts-ignore
Province.associate = (models) => {
    // Province belongs to Country model
    Province.belongsTo(models.Country, {
        foreignKey: 'countryOid',
        as: 'country', // Optional alias
        onDelete: 'CASCADE',
    });

    // Province has many District models
    // Province.hasMany(models.District, {
    //     foreignKey: 'provinceOid',
    //     as: 'districts', // Optional alias
    //     onDelete: 'CASCADE',
    // });
};

module.exports = Province;
