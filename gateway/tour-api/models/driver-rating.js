const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DriverRating = sequelize.define('DriverRating', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    driver_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'drivers',
            key: 'id'
        }
    },
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    booking_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'bookings',
            key: 'id'
        }
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    comments: {
        type: DataTypes.TEXT,
        allowNull: true
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
    tableName: 'driver_ratings',
    timestamps: true,
    paranoid: true, // for soft deletes using deletedAt
    indexes: [
        {
            fields: ['driver_id']
        },
        {
            fields: ['user_id']
        },
        {
            fields: ['booking_id'],
            unique: true // Ensure one rating per booking
        }
    ]
});

// @ts-ignore
DriverRating.associate = (models) => {
    DriverRating.belongsTo(models.Driver, {
        foreignKey: 'driver_id',
        as: 'driver',
        onDelete: 'CASCADE'
    });

    DriverRating.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE'
    });

    DriverRating.belongsTo(models.Booking, {
        foreignKey: 'booking_id',
        as: 'booking',
        onDelete: 'CASCADE'
    });
};

module.exports = DriverRating;
