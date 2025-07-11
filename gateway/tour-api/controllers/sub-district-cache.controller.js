'use strict';

const subDistrictCacheService = require('../services/sub-district-cache.service');
const buildResponse = require('../common/build.response');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

const findAll = async (req, res) => {
  try {
    const countries = await subDistrictCacheService.getAllSubDistricts();
    await recordAuditTrail("READ", "SubDistrictCache", null, req, 'SUCCESS', 'Get all cached countries');
    return buildResponse.findOk(res, countries, countries.length);
  } catch (err) {
    await recordAuditTrail("READ", "SubDistrictCache", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findById = async (req, res) => {
  try {
    const subDistrict = await subDistrictCacheService.getSubDistrictById(req.params.id);
    if (!subDistrict) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "SubDistrictCache", subDistrict, req, 'SUCCESS', 'Get cached subDistrict by ID');
    return buildResponse.findOk(res, subDistrict);
  } catch (err) {
    await recordAuditTrail("READ", "SubDistrictCache", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const name = req.query.name || '';
    const countries = await subDistrictCacheService.searchSubDistrictsByName(name);
    await recordAuditTrail("READ", "SubDistrictCache", null, req, 'SUCCESS', `Search cached countries by name: ${name}`);
    return buildResponse.findOk(res, countries.countries, countries.countries.length);
  } catch (err) {
    await recordAuditTrail("READ", "SubDistrictCache", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

module.exports = {
  findAll,
  findById,
  find,
};
