'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('user_roles', [
      {
        oid: uuidv4(),
        roleName: 'Admin',
        targetType: 'System',
        isAdministrative: true,
        readState: true,
        writeState: true,
        createState: true,
        deleteState: true,
        navigateState: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        oid: uuidv4(),
        roleName: 'Editor',
        targetType: 'System',
        isAdministrative: false,
        readState: true,
        writeState: true,
        createState: true,
        deleteState: false,
        navigateState: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        oid: uuidv4(),
        roleName: 'Viewer',
        targetType: 'System',
        isAdministrative: false,
        readState: true,
        writeState: false,
        createState: false,
        deleteState: false,
        navigateState: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('user_roles', null, {});
  }
};
