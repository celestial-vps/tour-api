const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TravelSchedule = sequelize.define('TravelSchedule', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    routeOid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'travel_routes',
            key: 'oid'
        }
    },
    vehicleOid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'vehicles',
            key: 'oid'
        }
    },
    driverOid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'drivers',
            key: 'oid'
        }
    },
    departureTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    arrivalTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('scheduled', 'on_the_way', 'completed', 'cancelled'),
        defaultValue: 'scheduled',
        allowNull: false
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
    tableName: 'travel_schedules',
    timestamps: true,
    paranoid: true, // for soft deletes using deletedAt
});

// @ts-ignore
TravelSchedule.associate = (models) => {
    TravelSchedule.belongsTo(models.TravelRoute, {
        foreignKey: 'routeOid',
        as: 'travelRoute',
        onDelete: 'RESTRICT'
    });

    // Belongs to Vehicle
    TravelSchedule.belongsTo(models.Vehicle, {
        foreignKey: 'vehicleOid',
        as: 'vehicle',
        onDelete: 'RESTRICT'
    });

    // Belongs to Driver
    TravelSchedule.belongsTo(models.Driver, {
        foreignKey: 'driverOid',
        as: 'driver',
        onDelete: 'RESTRICT'
    });

    // // Has many Bookings
    // TravelSchedule.hasMany(models.Booking, {
    //     foreignKey: 'schedule_id',
    //     as: 'bookings'
    // });
};

module.exports = TravelSchedule;
