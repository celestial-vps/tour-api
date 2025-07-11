'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the 'isActive' column
    await queryInterface.removeColumn('brands', 'isActive');

    // Add the 'imageOid' column
    await queryInterface.addColumn('brands', 'imageOid', {
      type: Sequelize.UUID,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert: add the 'isActive' column back
    await queryInterface.addColumn('brands', 'isActive', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });

    // Revert: remove the 'imageOid' column
    await queryInterface.removeColumn('brands', 'imageOid');
  },
};
