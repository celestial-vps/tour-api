'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sub_districts', {
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
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      lastModifiedBy: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deletedBy: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sub_districts');
  },
};
