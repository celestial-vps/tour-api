const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Province = sequelize.define('Province', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
        primaryKey: true,
    }, 
    provinceName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'provinces',
    timestamps: true,
    paranoid: true,
});

Province.associate = (models) => {
    // Example: if provinces belong to a country model via foreign key
    // Province.belongsTo(models.Country, {
    //     foreignKey: 'country',
    //     targetKey: 'oid',
    //     as: 'countryInfo',
    // });
};

module.exports = Province;
