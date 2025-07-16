'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('hotel_amenities', {
            oid: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4
            },
            hotelOid: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'hotels', // pastikan ini sesuai dengan nama tabel Hotel
                    key: 'oid'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            hotelAmenityName: {
                type: Sequelize.ENUM(
                    'pool',
                    'gym',
                    'parking',
                    'spa',
                    'restaurant',
                    'bar',
                    'business_center',
                    'conference_room',
                    'laundry',
                    'room_service',
                    'pet_friendly',
                    'accessible'
                ),
                allowNull: false
            },
            lastModifiedBy: {
                type: Sequelize.UUID,
                allowNull: true
            },
            deletedBy: {
                type: Sequelize.UUID,
                allowNull: true
            },
            deletedAt: {
                type: Sequelize.DATE,
                allowNull: true
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW')
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW')
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('hotel_amenities');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_hotel_amenities_hotelAmenityName";');
    }
};
