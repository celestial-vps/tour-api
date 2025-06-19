'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vehicle_types', {
      oid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        allowNull: false,
        primaryKey: true,
      },
      countryName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('vehicle_types');
  }
};
