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
      table_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      record_oid: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
      previous_data: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      new_data: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      changed_fields: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      user_oid: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      ip_address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      user_agent: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
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
