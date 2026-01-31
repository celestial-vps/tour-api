'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('vehicle_types', 'vehicleType', 'typeName');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('vehicle_types', 'typeName', 'vehicleType');
  }
};
