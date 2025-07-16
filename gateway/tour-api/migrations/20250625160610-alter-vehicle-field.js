'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vehicles', 'seatCapacity', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.addColumn('vehicles', 'licensePlate', {
      type: Sequelize.STRING(8),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('vehicles', 'seatCapacity');
    await queryInterface.removeColumn('vehicles', 'licensePlate');
  }
};