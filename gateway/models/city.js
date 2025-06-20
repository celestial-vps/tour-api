const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust according to your config

const City = sequelize.define('City', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
        primaryKey: true,
    },
    provinceOid: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    cityName: {
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
    tableName: 'cities',
    timestamps: true,
    paranoid: true, // Enable soft deletes using deletedAt
});

// Associations
// @ts-ignore
City.associate = (models) => {
    // City belongs to Country model
    City.belongsTo(models.Province, {
        foreignKey: 'provinceOid',
        as: 'province', // Optional alias
        onDelete: 'CASCADE',
    });

    // City has many District models
    City.hasMany(models.District, {
        foreignKey: 'cityOid', // ✅ foreign key in the District model that refers to City
        as: 'districts',
        onDelete: 'CASCADE',
    });
};

module.exports = City;
