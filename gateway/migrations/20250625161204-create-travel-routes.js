'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('travel_routes', {
      oid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      originOid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'cities',
          key: 'oid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      destinationOid: {
       type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'cities',
          key: 'oid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      distanceKm: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      estimatedTime: {
        type: Sequelize.TIME,
        allowNull: false
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

    // Add index for better query performance
    await queryInterface.addIndex('travel_routes', ['originOid']);
    await queryInterface.addIndex('travel_routes', ['destinationOid']);
    await queryInterface.addIndex('travel_routes', ['deletedAt']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('travel_routes');
  }
};