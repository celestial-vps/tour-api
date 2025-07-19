'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('travel_schedules', {
      oid: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      routeOid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'travel_routes',
          key: 'oid'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      vehicleOid: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'vehicles',
          key: 'oid'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      driverOid: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'drivers',
          key: 'oid'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      depatureTime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      arrivalTime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('scheduled', 'on_the_way', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'scheduled'
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
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('travel_schedules');
    // hapus enum jika perlu (Postgres)
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_travel_schedules_status";');
  }
};
