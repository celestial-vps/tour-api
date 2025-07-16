const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TravelBooking = sequelize.define('TravelBooking', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    userOid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'oid'
        }
    },
    scheduleOid: {
       type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'schedules',
            key: 'oid'
        }
    },
    seatNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    status: {
        type: DataTypes.ENUM('pending', 'paid', 'cancelled', 'completed'),
        defaultValue: 'pending',
        allowNull: false
    },
    paymentStatus: {
        type: DataTypes.ENUM('unpaid', 'paid', 'refunded'),
        defaultValue: 'unpaid',
        allowNull: false
    },
    bookedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
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
    tableName: 'banks',
    timestamps: true,
    paranoid: true, // for soft deletes using deletedAt
});

// @ts-ignore
TravelBooking.associate = (models) => {
    TravelBooking.belongsTo(models.User, {
        foreignKey: 'userOid',
        as: 'user',
        onDelete: 'RESTRICT', // Prevent deletion if bookings exist
        onUpdate: 'CASCADE'   // Update if user id changes
    });

    // Belongs to Schedule
    TravelBooking.belongsTo(models.Schedule, {
        foreignKey: 'scheduleOid',
        as: 'schedule',
        onDelete: 'RESTRICT', // Prevent deletion if bookings exist
        onUpdate: 'CASCADE'   // Update if schedule id changes
    });
};

module.exports = TravelBooking;
