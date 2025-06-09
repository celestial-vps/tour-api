'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subdistricts', {
      oid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      districtOid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'districts',
          key: 'oid',
        },
        onDelete: 'CASCADE',
      },
      subDistrictName: {
        type: Sequelize.STRING,
        field: 'subDistrictName',
        allowNull: false,
      },
      postalCode: {
        type: Sequelize.STRING,
        field: 'postalCode', // 👈 this maps the JS name to DB column
        allowNull: false,
      },
      createdBy: {
        type: Sequelize.UUID,
      },
      lastModifiedBy: {
        type: Sequelize.UUID,
      },
      deletedBy: {
        type: Sequelize.UUID,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('subdistricts');
  },
};
