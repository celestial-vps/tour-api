
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true // satu booking cuma bisa satu review
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    comment: {
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
    tableName: 'reviews',
    timestamps: false,
    underscored: true
});

// @ts-ignore
Review.associate = function (models) {
    Review.belongsTo(models.Booking, {
        foreignKey: 'booking_id',
        as: 'booking'
    });
};


module.exports = Review;