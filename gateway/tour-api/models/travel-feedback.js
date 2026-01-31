const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TravelFeedback = sequelize.define('TravelFeedback', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
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
        },
        unique: true // Ensure one feedback per booking
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
    tableName: 'travel_feedbacks',
    timestamps: true,
    paranoid: true, // for soft deletes using deletedAt
    indexes: [
        {
            fields: ['user_id']
        },
        {
            fields: ['booking_id'],
            unique: true
        },
        {
            fields: ['created_at']
        }
    ]
});

// @ts-ignore
TravelFeedback.associate = (models) => {
    TravelFeedback.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE'
    });

    TravelFeedback.belongsTo(models.Booking, {
        foreignKey: 'booking_id',
        as: 'booking',
        onDelete: 'CASCADE'
    });
};

module.exports = TravelFeedback;
