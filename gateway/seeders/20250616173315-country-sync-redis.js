'use strict';

const { QueryTypes } = require('sequelize');
const Redis = require('ioredis');

module.exports = {
  async up(queryInterface, Sequelize) {
    // @ts-ignore
    const redis = new Redis();

    // Ambil semua countries dari DB
    const countries = await queryInterface.sequelize.query(
      `SELECT oid, "countryName" FROM countries`,
      { type: QueryTypes.SELECT }
    );
    // Filter hanya data yang valid
    const cleanCountries = countries.filter(c => c.oid && c.countryName);

    // Simpan seluruh countries ke satu key di Redis
    await redis.set('geo:countries', JSON.stringify(cleanCountries));

    await redis.quit();
  },

  async down(queryInterface, Sequelize) {
    // @ts-ignore
    const redis = new Redis();
    await redis.del('geo:countries');
    await redis.quit();
  }
};
