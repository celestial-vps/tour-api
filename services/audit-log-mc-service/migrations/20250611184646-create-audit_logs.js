'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('audit_logs', {
      oid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      tableName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      recordOid: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      action: {
        type: Sequelize.ENUM(
          'CREATE',
          'UPDATE',
          'DELETE',
          'READ',
          'LOGIN',
          'LOGOUT',
          'APPROVE',
          'REJECT',
          'IMPORT',
          'EXPORT'
        ),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('SUCCESS', 'FAILED', 'ERROR'),
        allowNull: false,
        defaultValue: 'SUCCESS',
      },
      message: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      previousData: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      newData: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      changedFields: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      userOid: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      ipAddress: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      userAgent: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdBy: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('audit_logs');

    // Drop ENUM types manually (Postgres spesifik)
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_audit_logs_action";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_audit_logs_status";');
  }
};
