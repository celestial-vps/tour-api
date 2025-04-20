const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const HotelRoom = sequelize.define('HotelRoom', {
    room_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    hotelOid: {
        type: DataTypes.UUID,  // Ensure this is UUID to match your Hotel's primary key
        allowNull: false,
    },
    room_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price_per_night: {
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
    createdBy: {
        type: Sequelize.UUID,
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
    lastModifiedBy: {
        type: Sequelize.UUID,
    },
    updatedAt: {
        type: Sequelize.DATE,
    },
    deletedBy: {
        type: Sequelize.UUID,
    },
    deletedAt: {
        type: Sequelize.DATE,
    },
}, {
    tableName: 'rooms',
    timestamps: true,
    paranoid: true,
});

// Associations
HotelRoom.associate = (models) => {
    HotelRoom.belongsTo(models.Hotel, {  // Use HotelRoom.belongsTo to associate with the Hotel model
        foreignKey: 'hotelOid',
        as: 'hotel', // Optional alias
        onDelete: 'CASCADE',
    });
};

module.exports = HotelRoom;
