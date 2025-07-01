


const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TravelRoute = sequelize.define('TravelRoute', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    cityOid: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    originSubAreaOid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'sub_areas',
            key: 'oid',
        },
    },
    destinationSubAreaOid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'sub_areas',
            key: 'oid',
        },
    },
    distanceKm: {
        type: DataTypes.DECIMAL(10, 2), // Adjust precision as needed
        allowNull: false,
        validate: {
            min: 0
        }
    },
    estimatedTimeMinutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
        }
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
    tableName: 'travel_routes',
    timestamps: true,
    paranoid: true, // for soft deletes using deletedAt
});

// @ts-ignore
TravelRoute.associate = (models) => {
    TravelRoute.belongsTo(models.City, {
        foreignKey: 'cityOid',
        as: 'city',
    });

    TravelRoute.belongsTo(models.SubArea, {
        foreignKey: 'originSubAreaOid',
        as: 'originSubArea',
    });

    TravelRoute.belongsTo(models.SubArea, {
        foreignKey: 'destinationSubAreaOid',
        as: 'destinationSubArea',
    });
};

module.exports = TravelRoute;
