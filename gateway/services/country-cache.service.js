'use strict';

const GeoCacheCountryService = require('../lib/redis/services/geo-cache-country.service');
const geoCacheCountryService = new GeoCacheCountryService();
const buildResponse = require('../common/build.response');

const getAllCountries = async () => {
  try {
    const countries = await geoCacheCountryService.getCountries();
    return { countries, err: null };
  } catch (err) {
    console.error('getAllCountries cache failed:', err);
    return {
      countries: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const getCountryById = async (id) => {
  try {
    const country = await geoCacheCountryService.getCountryById(id);
    if (!country) {
      return { country: null, err: null };
    }
    return { country, err: null };
  } catch (err) {
    console.error('getCountryById cache failed:', err);
    return {
      country: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const searchCountriesByName = async (name) => {
  try {
    const countries = await geoCacheCountryService.searchCountriesByName(name);
    return { countries, err: null };
  } catch (err) {
    console.error('searchCountriesByName cache failed:', err);
    return {
      countries: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

module.exports = {
  getAllCountries,
  getCountryById,
  searchCountriesByName,
};
