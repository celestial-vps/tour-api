'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('countries', {
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
      countryCurrency: {
        type: Sequelize.STRING,
        allowNull: false,
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('countries');
  },
};
