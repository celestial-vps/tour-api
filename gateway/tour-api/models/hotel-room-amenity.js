const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HotelRoomAmenity = sequelize.define('HotelRoomAmenity', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    hotelRoomOid: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('wifi', 'ac', 'tv', 'breakfast', 'pool', 'gym', 'parking', 'spa', 'restaurant', 'bar', 'laundry', 'room_service', 'pet_friendly', 'accessible', 'business_center', 'conference_room'),
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
    tableName: 'hotel_room_amenities',
    timestamps: true,
    paranoid: true, // for soft deletes using deletedAt
});

// @ts-ignore
HotelRoomAmenity.associate = (models) => {
    HotelRoomAmenity.belongsTo(models.HotelRoom, {
        foreignKey: 'hotelRoomOid',
        as: 'hotelRoom',
    });
};

module.exports = HotelRoomAmenity;
