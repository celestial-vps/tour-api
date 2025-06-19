'use strict';

const GeoCacheProvinceService = require('../lib/redis/services/geo-cache-province.service');
const geoCacheProvinceService = new GeoCacheProvinceService();
const buildResponse = require('../common/build.response');

const getAllProvinces = async () => {
  try {
    const provinces = await geoCacheProvinceService.getProvinces();
    return { provinces, err: null };
  } catch (err) {
    console.error('getAllProvinces cache failed:', err);
    return {
      provinces: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const getProvinceById = async (id) => {
  try {
    const province = await geoCacheProvinceService.getProvinceById(id);
    if (!province) {
      return { province: null, err: null };
    }
    return { province, err: null };
  } catch (err) {
    console.error('getProvinceById cache failed:', err);
    return {
      province: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const searchProvincesByName = async (name) => {
  try {
    const provinces = await geoCacheProvinceService.searchProvincesByName(name);
    return { provinces, err: null };
  } catch (err) {
    console.error('searchProvincesByName cache failed:', err);
    return {
      provinces: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

module.exports = {
  getAllProvinces,
  getProvinceById,
  searchProvincesByName,
};
