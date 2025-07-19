'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Tambah kolom userOid
    await queryInterface.addColumn('customers', 'userOid', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'oid',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Tambah kolom customerAddress
    await queryInterface.addColumn('customers', 'customerAddress', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // Jika perlu tambah kolom lain, bisa di sini
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('customers', 'userOid');
    await queryInterface.removeColumn('customers', 'customerAddress');
  }
};
