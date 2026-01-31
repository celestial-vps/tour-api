'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Buat enum dulu
    await queryInterface.sequelize.query(`
    CREATE TYPE "enum_hotel_rooms_room_type" AS ENUM (
      'Single Room', 'Double Room', 'Twin Room', 'Deluxe Room',
      'Superior Room', 'Suite', 'Junior Suite', 'Presidential Suite',
      'Family Room', 'Studio Room', 'Connecting Room', 'Accessible Room',
      'Villa', 'Cabana', 'Penthouse'
    );
  `);

    await queryInterface.sequelize.query(`
    CREATE TYPE "enum_hotel_rooms_status" AS ENUM ('available', 'booked', 'maintenance');
  `);

    // Baru buat tabel
    await queryInterface.createTable('hotel_rooms', {
      oid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        allowNull: false,
        primaryKey: true,
      },
      hotelOid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'hotels',
          key: 'oid',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      roomType: {
        type: 'enum_hotel_rooms_room_type',
        allowNull: false,
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      pricePerNight: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      amenities: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: 'enum_hotel_rooms_status',
        allowNull: false,
      },
      createdBy: { type: Sequelize.UUID, allowNull: true },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      lastModifiedBy: { type: Sequelize.UUID, allowNull: true },
      updatedAt: { type: Sequelize.DATE, allowNull: true },
      deletedBy: { type: Sequelize.UUID, allowNull: true },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    });
  },


  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('hotel_rooms');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_hotel_rooms_room_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_hotel_rooms_status";');
  }

};
