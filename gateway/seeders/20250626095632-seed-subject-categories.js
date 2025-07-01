'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const categories = [
      'Matematika',
      'Fisika',
      'Kimia',
      'Biologi',
      'Bahasa Inggris',
      'Bahasa Indonesia',
      'Bahasa Jepang',
      'Bahasa Mandarin',
      'Bahasa Jerman',
      'Bahasa Arab',
      'Sejarah',
      'Geografi',
      'Ekonomi',
      'Sosiologi',
      'Antropologi',
      'Statistika',
      'Akuntansi',
      'Manajemen Bisnis',
      'Kewirausahaan',
      'Hukum Dasar',
      'Ilmu Komputer',
      'Pemrograman',
      'Algoritma & Struktur Data',
      'Desain Grafis',
      'Animasi',
      'Multimedia',
      'Teknik Mesin',
      'Teknik Sipil',
      'Teknik Elektro',
      'Fisika Teknik',
      'Kimia Industri',
      'Psikologi',
      'Kedokteran Dasar',
      'Farmasi Dasar',
      'Musik',
      'Gitar',
      'Piano',
      'Menggambar',
      'Public Speaking'
    ];

    const data = categories.map(name => ({
      oid: uuidv4(),
      categoryName: name,
      lastModifiedBy: null,
      deletedBy: null,
      deletedAt: null,
      createdAt: now,
      updatedAt: now,
    }));

    await queryInterface.bulkInsert('subject_categories', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('subject_categories', null, {});
  }
};
