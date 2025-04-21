'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('banks', {
      oid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        allowNull: false,
        primaryKey: true,
      },
      bankName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      createdBy: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
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

    // Optionally, you can add any constraints here
    // If you have associations, they are handled in the models.

    // In case you want to add foreign keys or constraints directly in migrations, you can add them here.
  },

  down: async (queryInterface, Sequelize) => {
    // Drops the banks table
    await queryInterface.dropTable('banks');
  }
};
