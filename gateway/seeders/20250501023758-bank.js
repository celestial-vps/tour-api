'use strict';

const { v4: uuidv4 } = require('uuid');
 
module.exports = {
  async up(queryInterface, Sequelize) {
    const bankData = [
      { name: 'Bank Central Asia', code: 'BCA' },
      { name: 'Bank Negara Indonesia', code: 'BNI' },
      { name: 'Bank Mandiri', code: 'MANDIRI' },
      { name: 'Bank Rakyat Indonesia', code: 'BRI' },
      { name: 'Bank Danamon', code: 'DANAMON' },
      { name: 'Bank Permata', code: 'PERMATA' },
      { name: 'Bank CIMB Niaga', code: 'CIMB' },
      { name: 'Bank BTN', code: 'BTN' },
      { name: 'Bank Panin', code: 'PANIN' },
      { name: 'Bank Mega', code: 'MEGA' },
      { name: 'Bank Sinarmas', code: 'SINARMAS' },
      { name: 'Bank Maybank', code: 'MAYBANK' },
      { name: 'Bank BJB', code: 'BJB' },
      { name: 'Bank Jatim', code: 'JATIM' },
      { name: 'Bank Jateng', code: 'JATENG' },
      { name: 'Bank Sumut', code: 'SUMUT' },
      { name: 'Bank Nagari', code: 'NAGARI' },
      { name: 'Bank Papua', code: 'PAPUA' },
      { name: 'Bank Aceh', code: 'ACEH' },
      { name: 'Bank Kalbar', code: 'KALBAR' },
      { name: 'Bank NTB', code: 'NTB' },
      { name: 'Bank NTT', code: 'NTT' },
      { name: 'Bank Sumsel Babel', code: 'SUMSEL' },
      { name: 'Bank Kaltimtara', code: 'KALTIM' },
      { name: 'Bank DKI', code: 'DKI' }
    ];

    const now = new Date();
    const banks = bankData.map((item) => ({
      oid: uuidv4(),
      bankCode: item.code,
      bankName: item.name,
      createdAt: now,
      updatedAt: now
      // bankCurrency intentionally omitted
    }));

    await queryInterface.bulkInsert('banks', banks, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('banks', null, {});
  }
};
