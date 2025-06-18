'use strict';
require('dotenv').config();

const { hashPassword } = require('../misc/password');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const roleOidStr = process.env.RoleId || null;

    return queryInterface.bulkInsert('users', [
      {
        oid: uuidv4(),
        email: 'admin@example.com',
        password: await hashPassword('serverh5n'),
        androidToken: null,
        expiredTime: null,
        isActive: true,
        activatedAt: new Date(),
        roleOid: roleOidStr,
        description: 'Administrator user',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        oid: uuidv4(),
        email: 'weslyaioria@gmail.com',
        password: await hashPassword('serverh5n'),
        androidToken: null,
        expiredTime: null,
        isActive: true,
        activatedAt: new Date(),
        roleOid: roleOidStr,
        description: 'Regular user',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {});
  }
};
