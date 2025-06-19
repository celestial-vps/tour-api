'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('brands', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('brands', 'logoUrl', {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    });

    await queryInterface.addColumn('brands', 'isActive', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('brands', 'description');
    await queryInterface.removeColumn('brands', 'logoUrl');
    await queryInterface.removeColumn('brands', 'isActive');
  }
};
