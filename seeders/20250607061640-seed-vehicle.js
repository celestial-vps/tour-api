'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const vehicleTypeIds = [uuidv4(), uuidv4(), uuidv4()];

    const now = new Date();

    // Insert Vehicle Types
    await queryInterface.bulkInsert('vehicle-types', [
      {
        oid: vehicleTypeIds[0],
        vehicleType: 'SUV',
        createdBy: uuidv4(),
        createdAt: now,
        updatedAt: now,
      },
      {
        oid: vehicleTypeIds[1],
        vehicleType: 'Sedan',
        createdBy: uuidv4(),
        createdAt: now,
        updatedAt: now,
      },
      {
        oid: vehicleTypeIds[2],
        vehicleType: 'Truck',
        createdBy: uuidv4(),
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // Insert Vehicles
    await queryInterface.bulkInsert('vehicles', [
      {
        oid: uuidv4(),
        vehicleTypeOid: vehicleTypeIds[0],
        year: 2020,
        color: 'Red',
        status: 'available',
        price_per_day: 500.00,
        createdBy: uuidv4(),
        createdAt: now,
        updatedAt: now,
      },
      {
        oid: uuidv4(),
        vehicleTypeOid: vehicleTypeIds[0],
        year: 2021,
        color: 'Black',
        status: 'rented',
        price_per_day: 550.00,
        createdBy: uuidv4(),
        createdAt: now,
        updatedAt: now,
      },
      {
        oid: uuidv4(),
        vehicleTypeOid: vehicleTypeIds[1],
        year: 2019,
        color: 'White',
        status: 'available',
        price_per_day: 400.00,
        createdBy: uuidv4(),
        createdAt: now,
        updatedAt: now,
      },
      {
        oid: uuidv4(),
        vehicleTypeOid: vehicleTypeIds[2],
        year: 2022,
        color: 'Blue',
        status: 'service',
        price_per_day: 700.00,
        createdBy: uuidv4(),
        createdAt: now,
        updatedAt: now,
      },
      {
        oid: uuidv4(),
        vehicleTypeOid: vehicleTypeIds[1],
        year: 2023,
        color: 'Gray',
        status: 'available',
        price_per_day: 450.00,
        createdBy: uuidv4(),
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('vehicles', null, {});
    await queryInterface.bulkDelete('vehicle-types', null, {});
  }
};
