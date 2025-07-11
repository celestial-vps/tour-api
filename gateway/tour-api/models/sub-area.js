const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SubArea = sequelize.define('SubArea', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    cityOid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'cities',
            key: 'oid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    },
    subAreaName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
    },
    longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    openingHour: {
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
    tableName: 'sub_area',
    timestamps: true,
    paranoid: true, // for soft deletes using deletedAt
});

// @ts-ignore
SubArea.associate = (models) => {
    SubArea.belongsTo(models.City, {
        foreignKey: 'cityOid',
        as: 'city',
    });
};

module.exports = SubArea;
