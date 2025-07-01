


const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TravelRoute = sequelize.define('TravelRoute', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    // cityOid: {
    //     type: DataTypes.UUID,
    //     allowNull: false,
    // },
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
    estimatedTime: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, // HH:mm:ss format
        },
        get() {
            // opsional: parse string to object (if needed)
            const rawValue = this.getDataValue('estimatedTime');
            return rawValue;
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
    // TravelRoute.belongsTo(models.City, {
    //     foreignKey: 'cityOid',
    //     as: 'city',
    // });

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
