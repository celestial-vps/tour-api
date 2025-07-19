'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ubah vehicleOid menjadi allowNull: true
    await queryInterface.changeColumn('travel_schedules', 'vehicleOid', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'vehicles',
        key: 'oid'
      },
      onDelete: 'RESTRICT'
    });

    // Ubah driverOid menjadi allowNull: true
    await queryInterface.changeColumn('travel_schedules', 'driverOid', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'drivers',
        key: 'oid'
      },
      onDelete: 'RESTRICT'
    });

    // Ubah depatureTime menjadi allowNull: true
    await queryInterface.changeColumn('travel_schedules', 'depatureTime', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    // Ubah arrivalTime menjadi allowNull: true
    await queryInterface.changeColumn('travel_schedules', 'arrivalTime', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert vehicleOid ke allowNull: false
    await queryInterface.changeColumn('travel_schedules', 'vehicleOid', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'vehicles',
        key: 'oid'
      },
      onDelete: 'RESTRICT'
    });

    // Revert driverOid ke allowNull: false
    await queryInterface.changeColumn('travel_schedules', 'driverOid', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'drivers',
        key: 'oid'
      },
      onDelete: 'RESTRICT'
    });

    // Revert depatureTime ke allowNull: false
    await queryInterface.changeColumn('travel_schedules', 'depatureTime', {
      type: Sequelize.DATE,
      allowNull: false,
    });

    // Revert arrivalTime ke allowNull: false
    await queryInterface.changeColumn('travel_schedules', 'arrivalTime', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  }
};
