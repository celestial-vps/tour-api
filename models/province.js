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
    createdBy: {
        type: DataTypes.UUID, // Use DataTypes.UUID instead of Sequelize.UUID
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Use DataTypes.DATE instead of Sequelize.DATE
    },
    lastModifiedBy: {
        type: DataTypes.UUID, // Use DataTypes.UUID instead of Sequelize.UUID
    },
    updatedAt: {
        type: DataTypes.DATE, // Use DataTypes.DATE instead of Sequelize.DATE
    },
    deletedBy: {
        type: DataTypes.UUID, // Use DataTypes.UUID instead of Sequelize.UUID
    },
    deletedAt: {
        type: DataTypes.DATE, // Use DataTypes.DATE instead of Sequelize.DATE
    },
}, {
    tableName: 'provinces',
    timestamps: true,
    paranoid: true, // Enable soft deletes using deletedAt
});

// Associations
Province.associate = (models) => {
    // Province belongs to Country model
    Province.belongsTo(models.Country, {
        foreignKey: 'countryOid',
        as: 'country', // Optional alias
        onDelete: 'CASCADE',
    });

    // Province has many District models
    Province.hasMany(models.District, {
        foreignKey: 'provinceOid',
        as: 'districts', // Optional alias
        onDelete: 'CASCADE',
    });
};

module.exports = Province;
