'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('countries', {
      oid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      countryName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      countryCurrency: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdBy: {
        type: Sequelize.UUID,
        allowNull: true, // Allowing null in case not all records have a creator
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      lastModifiedBy: {
        type: Sequelize.UUID,
        allowNull: true, // Allowing null for records that haven't been modified
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true, // Allowing null for records that haven't been updated
      },
      deletedBy: {
        type: Sequelize.UUID,
        allowNull: true, // Allowing null for records that haven't been deleted
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true, // Allowing null for records that haven't been deleted
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('countries');
  },
};
