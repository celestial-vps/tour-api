const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Country = sequelize.define('Country', {
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
    countryCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    countryCurrency: {
        type: DataTypes.STRING,
        allowNull: false,
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
    tableName: 'countries',
    timestamps: true,
    paranoid: true, // for soft deletes using deletedAt
});

Country.associate = (models) => {
    // Add associations here if needed
    Country.hasMany(models.Province, {
        foreignKey: 'countryOid',
        as: 'provinces', // Optional alias
        onDelete: 'CASCADE',
    });
};

module.exports = Country;
