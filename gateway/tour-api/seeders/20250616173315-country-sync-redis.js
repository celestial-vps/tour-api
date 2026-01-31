'use strict';

const { QueryTypes } = require('sequelize');
// const redis = require('../../ /lib/redis');

const redis = require('../lib/redis/redis');
module.exports = {
  async up(queryInterface, Sequelize) {
    // @ts-ignore
    // const redis = redis;

    // Ambil semua countries dari DB
    const countries = await queryInterface.sequelize.query(
      `SELECT oid, "countryName" FROM countries`,
      { type: QueryTypes.SELECT }
    );
    // Filter hanya data yang valid
    const cleanCountries = countries.filter(c => c.oid && c.countryName);

    // Ambil semua provinces dari DB
    const provinces = await queryInterface.sequelize.query(
      `SELECT oid, "provinceName" FROM provinces`,
      { type: QueryTypes.SELECT }
    );
    // Filter hanya data yang valid
    const cleanProvinces = provinces.filter(c => c.oid && c.provinceName);

    // Ambil semua cities dari DB
    const cities = await queryInterface.sequelize.query(
      `SELECT oid, "cityName" FROM cities`,
      { type: QueryTypes.SELECT }
    );
    // Filter hanya data yang valid
    const cleanCities = cities.filter(c => c.oid && c.cityName);


    // Ambil semua districts dari DB
    const districts = await queryInterface.sequelize.query(
      `SELECT oid, "districtName" FROM districts`,
      { type: QueryTypes.SELECT }
    );
    // Filter hanya data yang valid
    const cleanDistricts = districts.filter(c => c.oid && c.districtName);


    
    // Ambil semua subDistricts dari DB
    const subDistricts = await queryInterface.sequelize.query(
      `SELECT oid, "subDistrictName" FROM sub_districts`,
      { type: QueryTypes.SELECT }
    );
    // Filter hanya data yang valid
    const cleanSubDistricts = subDistricts.filter(c => c.oid && c.subDistrictName);



    // Simpan seluruh countries ke satu key di Redis
    await redis.set('geo:countries', JSON.stringify(cleanCountries));
    await redis.set('geo:provinces', JSON.stringify(cleanProvinces));
    await redis.set('geo:cities', JSON.stringify(cleanCities));
    await redis.set('geo:districts', JSON.stringify(cleanDistricts));
    // await redis.set('geo:subDistricts', JSON.stringify(cleanSubDistricts));

    // await redis.quit();
  },

  async down(queryInterface, Sequelize) {
    // @ts-ignore
    // const redis = new Redis();
    await redis.del('geo:countries');
    await redis.del('geo:provinces');
    await redis.del('geo:cities');
    await redis.del('geo:districts');
    // await redis.quit();
  }
};
