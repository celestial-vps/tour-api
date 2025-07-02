'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('drivers', {
      oid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      licenseNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      licenseExpiry: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'suspended'),
        allowNull: false,
        defaultValue: 'active'
      },
      hiredAt: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      terminatedAt: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      ratingAvg: {
        type: Sequelize.DECIMAL(2, 1),
        allowNull: false,
        defaultValue: 0.0
      },
      totalTrips: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
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
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Optional: if using PostgreSQL and uuid_generate_v4 is not enabled
    // await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('drivers');
  }
};
