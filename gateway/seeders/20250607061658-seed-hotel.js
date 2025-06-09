'use strict';

const { v4: uuidv4 } = require('uuid');

function generateHotelName(index) {
  return `Hotel Nusantara ${index}`;
}

function generateAddress(index) {
  return `Jl. Contoh Alamat No.${index}, Kota Contoh`;
}

function generatePhone(index) {
  return `+62-21-555${1000 + index}`;
}

function generateRoomType(index) {
  const types = ['Standard', 'Deluxe', 'Suite'];
  return types[index % types.length];
}

function generateAmenities(roomType) {
  if (roomType === 'Standard') return 'Wi-Fi, AC, TV';
  if (roomType === 'Deluxe') return 'Wi-Fi, AC, TV, Breakfast, Mini Bar';
  if (roomType === 'Suite') return 'Wi-Fi, AC, TV, Breakfast, Mini Bar, Jacuzzi, Balcony';
  return '';
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const hotels = [];
    const rooms = [];

    for (let i = 1; i <= 25; i++) {
      const hotelOid = uuidv4();
      const createdBy = uuidv4();
      const lastModifiedBy = uuidv4();

      hotels.push({
        oid: hotelOid,
        hotelName: generateHotelName(i),
        address: generateAddress(i),
        phone: generatePhone(i),
        star_rating: Math.floor(Math.random() * 5) + 1, // 1 - 5 stars
        createdBy,
        lastModifiedBy,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Buat 3 kamar per hotel
      for (let j = 0; j < 3; j++) {
        const roomType = generateRoomType(j);
        rooms.push({
          hotelOid: hotelOid,
          room_type: roomType,
          capacity: roomType === 'Suite' ? 4 : 2,
          price_per_night: roomType === 'Standard' ? 500000 :
                           roomType === 'Deluxe' ? 1000000 : 2000000,
          amenities: generateAmenities(roomType),
          status: 'available',
          createdBy,
          lastModifiedBy,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    // Insert data hotels dan rooms ke DB
    await queryInterface.bulkInsert('hotels', hotels, {});
    await queryInterface.bulkInsert('rooms', rooms, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('rooms', null, {});
    await queryInterface.bulkDelete('hotels', null, {});
  }
};
