'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('hotel_room_amenities', {
      oid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      hotelRoomOid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'hotel_rooms', // nama tabel hotel rooms (sesuaikan)
          key: 'oid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.ENUM(
          'wifi', 'ac', 'tv', 'breakfast', 'pool', 'gym', 'parking', 'spa', 'restaurant',
          'bar', 'laundry', 'room_service', 'pet_friendly', 'accessible',
          'business_center', 'conference_room'
        ),
        allowNull: false,
      },
        createdBy: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      lastModifiedBy: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deletedBy: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Hapus ENUM sebelum hapus tabel supaya gak error
    await queryInterface.dropTable('hotel_room_amenities');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_hotel_room_amenities_status";');
  }
};
