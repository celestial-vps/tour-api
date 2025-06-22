const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const HotelRoom = sequelize.define('HotelRoom', {
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
    room_type: {
        type: DataTypes.ENUM(
            'Single Room',
            'Double Room',
            'Twin Room',
            'Deluxe Room',
            'Superior Room',
            'Suite',
            'Junior Suite',
            'Presidential Suite',
            'Family Room',
            'Studio Room',
            'Connecting Room',
            'Accessible Room',
            'Villa',
            'Cabana',
            'Penthouse'
        ),
        allowNull: false,
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    pricePerNight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    amenities: {
        type: DataTypes.TEXT,
        allowNull: true, // assuming amenities can be optional
    },
    status: {
        type: DataTypes.ENUM('available', 'booked', 'maintenance'),
        allowNull: false,
        defaultValue: 'available',
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
    tableName: 'hotel_rooms',
    timestamps: true,
    paranoid: true,
});

// Associations
// @ts-ignore
HotelRoom.associate = (models) => {
    HotelRoom.belongsTo(models.Hotel, {  // Use HotelRoom.belongsTo to associate with the Hotel model
        foreignKey: 'hotelOid',
        as: 'hotel', // Optional alias
        onDelete: 'CASCADE',
    });
    HotelRoom.hasMany(models.HotelRoomAmenity, {
        foreignKey: 'hotelRoomOid',
        as: 'amenities',
        onDelete: 'CASCADE',
    });
};

module.exports = HotelRoom;

