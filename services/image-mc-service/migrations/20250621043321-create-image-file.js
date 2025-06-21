'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('image_files', {
      oid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        allowNull: false,
        primaryKey: true,
      },
      fileName: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      filePath: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      fileUrl: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      fileMime: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      fileSize: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'File size in bytes',
      },
      imageWidth: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Width in pixels',
      },
      imageHeight: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Height in pixels',
      },
      storageType: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: 'local',
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
    await queryInterface.dropTable('image_files');
  }
};
