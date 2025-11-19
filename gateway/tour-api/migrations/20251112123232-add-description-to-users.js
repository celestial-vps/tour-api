'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,  // bisa diubah ke false jika wajib
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'description');
  }
};
