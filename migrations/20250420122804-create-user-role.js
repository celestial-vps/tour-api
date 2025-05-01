'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_roles', {
      oid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        allowNull: false,
        primaryKey: true,
      },
      roleName: {
        type: Sequelize.STRING(50),
        unique: true,
        allowNull: false,
      },
      targetType: {
        type: Sequelize.STRING(50),        
        allowNull: false,
      },
      isAdministrative: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      readState: {
        type: Sequelize.BOOLEAN,
      },
      writeState: {
        type: Sequelize.BOOLEAN,
      },
      createState: {
        type: Sequelize.BOOLEAN,
      },
      deleteState: {
        type: Sequelize.BOOLEAN,
      },
      navigateState: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('user_roles');
  }
};
