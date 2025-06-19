'use strict';

const GeoCacheDistrictService = require('../lib/redis/services/geo-cache-district.service');
const geoCacheDistrictService = new GeoCacheDistrictService();
const buildResponse = require('../common/build.response');

const getAllDistricts = async () => {
  try {
    const countries = await geoCacheDistrictService.getDistricts();
    return { countries, err: null };
  } catch (err) {
    console.error('getAllDistricts cache failed:', err);
    return {
      countries: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const getDistrictById = async (id) => {
  try {
    const district = await geoCacheDistrictService.getDistrictById(id);
    if (!district) {
      return { district: null, err: null };
    }
    return { district, err: null };
  } catch (err) {
    console.error('getDistrictById cache failed:', err);
    return {
      district: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const searchDistrictsByName = async (name) => {
  try {
    const countries = await geoCacheDistrictService.searchDistrictsByName(name);
    return { countries, err: null };
  } catch (err) {
    console.error('searchDistrictsByName cache failed:', err);
    return {
      countries: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

module.exports = {
  getAllDistricts,
  getDistrictById,
  searchDistrictsByName,
};
