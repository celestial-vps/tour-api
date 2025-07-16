'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('vehicle_types', [
      {
        oid: uuidv4(),
        typeName: 'Sedan',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        oid: uuidv4(),
        typeName: 'SUV',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        oid: uuidv4(),
        typeName: 'Truck',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        oid: uuidv4(),
        typeName: 'Motorcycle',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        oid: uuidv4(),
        typeName: 'Convertible',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        oid: uuidv4(),
        typeName: 'Coupe',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        oid: uuidv4(),
        typeName: 'Van',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        oid: uuidv4(),
        typeName: 'Minivan',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        oid: uuidv4(),
        typeName: 'Hatchback',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        oid: uuidv4(),
        typeName: 'Wagon',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        oid: uuidv4(),
        typeName: 'Electric',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('vehicle_types', null, {});
  }
};
