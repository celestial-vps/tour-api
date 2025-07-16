'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('travel_routes', {
      oid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      originSubAreaOid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'sub_area',
          key: 'oid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      destinationSubAreaOid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'sub_area',
          key: 'oid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      distanceKm: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      estimatedTime: {
        type: 'TIME', // Raw type, karena Sequelize tidak punya Sequelize.TIME
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

    await queryInterface.addIndex('travel_routes', ['originSubAreaOid']);
    await queryInterface.addIndex('travel_routes', ['destinationSubAreaOid']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('travel_routes');
  }
};
