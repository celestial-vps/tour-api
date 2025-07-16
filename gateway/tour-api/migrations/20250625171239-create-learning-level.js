'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('learning_levels', {
      oid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      levelName: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      type: {
        type: Sequelize.ENUM('academic', 'general','language','skill','test-prep','early-child'),
        allowNull: false,
        defaultValue: 'academic'
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

    // Add indexes
    await queryInterface.addIndex('learning_levels', ['levelName']);
    await queryInterface.addIndex('learning_levels', ['type']);
    await queryInterface.addIndex('learning_levels', ['deletedAt']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('learning_levels');
  }
};