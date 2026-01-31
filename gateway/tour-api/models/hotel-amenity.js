const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HotelAmenity = sequelize.define('HotelAmenity', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    hotelOid: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    hotelAmenityName: {
        type: DataTypes.ENUM('pool', 'gym', 'parking', 'spa', 'restaurant', 'bar', 'business_center', 'conference_room', 'restaurant', 'bar', 'laundry', 'room_service', 'pet_friendly', 'accessible', 'business_center', 'conference_room'),
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
    tableName: 'hotel_amenities',
    timestamps: true,
    paranoid: true, // for soft deletes using deletedAt
});

// @ts-ignore
HotelAmenity.associate = (models) => {
    HotelAmenity.belongsTo(models.Hotel, {
        foreignKey: 'hotelOid',
        as: 'hotel',
    });
};

module.exports = HotelAmenity;
