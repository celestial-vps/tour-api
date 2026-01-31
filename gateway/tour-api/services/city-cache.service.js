'use strict';

const GeoCacheCityService = require('../lib/redis/services/geo-cache-city.service');
const geoCacheCityService = new GeoCacheCityService();
const buildResponse = require('../common/build.response');

const getAllCities = async () => {
  try {
    const countries = await geoCacheCityService.getCities();
    return { countries, err: null };
  } catch (err) {
    console.error('getAllCities cache failed:', err);
    return {
      countries: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const getCityById = async (id) => {
  try {
    const city = await geoCacheCityService.getCityById(id);
    if (!city) {
      return { city: null, err: null };
    }
    return { city, err: null };
  } catch (err) {
    console.error('getCityById cache failed:', err);
    return {
      city: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const searchCitiesByName = async (name) => {
  try {
    const countries = await geoCacheCityService.searchCitiesByName(name);
    return { countries, err: null };
  } catch (err) {
    console.error('searchCitiesByName cache failed:', err);
    return {
      countries: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

module.exports = {
  getAllCities,
  getCityById,
  searchCitiesByName,
};
