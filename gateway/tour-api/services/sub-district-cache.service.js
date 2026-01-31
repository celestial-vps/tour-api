'use strict';

const GeoCacheSubDistrictService = require('../lib/redis/services/geo-cache-sub-district.service');
const geoCacheSubDistrictService = new GeoCacheSubDistrictService();
const buildResponse = require('../common/build.response');

const getAllSubDistricts = async () => {
  try {
    const subDistricts = await geoCacheSubDistrictService.getSubDistricts();
    return { subDistricts, err: null };
  } catch (err) {
    console.error('getAllSubDistricts cache failed:', err);
    return {
      subDistricts: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const getSubDistrictById = async (id) => {
  try {
    const subDistrict = await geoCacheSubDistrictService.getSubDistrictById(id);
    if (!subDistrict) {
      return { subDistrict: null, err: null };
    }
    return { subDistrict, err: null };
  } catch (err) {
    console.error('getSubDistrictById cache failed:', err);
    return {
      subDistrict: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const searchSubDistrictsByName = async (name) => {
  try {
    const subDistricts = await geoCacheSubDistrictService.searchSubDistrictsByName(name);
    return { subDistricts, err: null };
  } catch (err) {
    console.error('searchSubDistrictsByName cache failed:', err);
    return {
      subDistricts: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

module.exports = {
  getAllSubDistricts,
  getSubDistrictById,
  searchSubDistrictsByName,
};
