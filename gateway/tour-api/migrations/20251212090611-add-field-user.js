
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'iosToken', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'webToken', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'iosToken');
    await queryInterface.removeColumn('users', 'webToken');
  }
};
