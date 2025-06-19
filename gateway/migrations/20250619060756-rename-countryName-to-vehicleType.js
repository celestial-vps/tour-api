'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('vehicle-types', 'countryName', 'vehicleType');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('vehicle-types', 'vehicleType', 'countryName');
  }
};
