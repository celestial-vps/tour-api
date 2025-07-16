'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const hotels = [
      {
        oid: uuidv4(),
        hotelName: 'Grand Horizon Hotel',
        address: '123 Ocean Drive, Miami, FL',
        phone: '305-555-1000',
        starRating: 5,
        createdAt: now,
        updatedAt: now,
      },
      {
        oid: uuidv4(),
        hotelName: 'Mountain View Resort',
        address: '456 Summit Road, Denver, CO',
        phone: '720-555-2000',
        starRating: 4,
        createdAt: now,
        updatedAt: now,
      },
      {
        oid: uuidv4(),
        hotelName: 'City Central Inn',
        address: '789 Downtown St, New York, NY',
        phone: '212-555-3000',
        starRating: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        oid: uuidv4(),
        hotelName: 'Lakeside Retreat',
        address: '101 Lakeview Blvd, Minneapolis, MN',
        phone: '612-555-4000',
        starRating: 4,
        createdAt: now,
        updatedAt: now,
      },
      {
        oid: uuidv4(),
        hotelName: 'Sunset Paradise Hotel',
        address: '202 Sunset Ave, Los Angeles, CA',
        phone: '213-555-5000',
        starRating: 5,
        createdAt: now,
        updatedAt: now,
      },
      {
        oid: uuidv4(),
        hotelName: 'Desert Oasis Inn',
        address: '303 Desert Rd, Phoenix, AZ',
        phone: '480-555-6000',
        starRating: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        oid: uuidv4(),
        hotelName: 'Coastal Breeze Hotel',
        address: '404 Seaside Blvd, San Diego, CA',
        phone: '619-555-7000',
        starRating: 4,
        createdAt: now,
        updatedAt: now,
      },
      {
        oid: uuidv4(),
        hotelName: 'The Royal Plaza',
        address: '505 King St, Chicago, IL',
        phone: '312-555-8000',
        starRating: 5,
        createdAt: now,
        updatedAt: now,
      },
      {
        oid: uuidv4(),
        hotelName: 'Green Hill Lodge',
        address: '606 Forest Lane, Portland, OR',
        phone: '503-555-9000',
        starRating: 4,
        createdAt: now,
        updatedAt: now,
      },
      {
        oid: uuidv4(),
        hotelName: 'Skyline Suites',
        address: '707 Sky Ave, Seattle, WA',
        phone: '206-555-1001',
        starRating: 4,
        createdAt: now,
        updatedAt: now,
      },
      {
        oid: uuidv4(),
        hotelName: 'Historic River Inn',
        address: '808 River Rd, New Orleans, LA',
        phone: '504-555-1100',
        starRating: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        oid: uuidv4(),
        hotelName: 'Urban Stay Hotel',
        address: '909 Tech Park, Austin, TX',
        phone: '512-555-1200',
        starRating: 4,
        createdAt: now,
        updatedAt: now,
      },
      {
        oid: uuidv4(),
        hotelName: 'The Art Deco Hotel',
        address: '1010 Art District, Miami, FL',
        phone: '305-555-1300',
        starRating: 5,
        createdAt: now,
        updatedAt: now,
      },
      {
        oid: uuidv4(),
        hotelName: 'Northern Lights Inn',
        address: '1111 Aurora Blvd, Anchorage, AK',
        phone: '907-555-1400',
        starRating: 4,
        createdAt: now,
        updatedAt: now,
      },
      {
        oid: uuidv4(),
        hotelName: 'Downtown Hub Hotel',
        address: '1212 Main St, Atlanta, GA',
        phone: '404-555-1500',
        starRating: 3,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert('hotels', hotels, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('hotels', null, {});
  }
};
