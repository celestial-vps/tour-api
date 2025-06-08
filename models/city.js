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
    createdBy: {
        type: DataTypes.UUID, // Use DataTypes.UUID instead of Sequelize.UUID
    },
    lastModifiedBy: {
        type: DataTypes.UUID, // Use DataTypes.UUID instead of Sequelize.UUID
    },
    deletedBy: {
        type: DataTypes.UUID, // Use DataTypes.UUID instead of Sequelize.UUID
    },
    deletedAt: {
        type: DataTypes.DATE, // Use DataTypes.DATE instead of Sequelize.DATE
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
