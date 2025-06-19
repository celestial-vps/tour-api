'use strict';

const districtCacheService = require('../services/district-cache.service');
const buildResponse = require('../common/build.response');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

const findAll = async (req, res) => {
  try {
    const countries = await districtCacheService.getAllDistricts();
    await recordAuditTrail("READ", "DistrictCache", null, req, 'SUCCESS', 'Get all cached countries');
    return buildResponse.findOk(res, countries, countries.length);
  } catch (err) {
    await recordAuditTrail("READ", "DistrictCache", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findById = async (req, res) => {
  try {
    const district = await districtCacheService.getDistrictById(req.params.id);
    if (!district) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "DistrictCache", district, req, 'SUCCESS', 'Get cached district by ID');
    return buildResponse.findOk(res, district);
  } catch (err) {
    await recordAuditTrail("READ", "DistrictCache", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const name = req.query.name || '';
    const countries = await districtCacheService.searchDistrictsByName(name);
    await recordAuditTrail("READ", "DistrictCache", null, req, 'SUCCESS', `Search cached countries by name: ${name}`);
    return buildResponse.findOk(res, countries.countries, countries.countries.length);
  } catch (err) {
    await recordAuditTrail("READ", "DistrictCache", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

module.exports = {
  findAll,
  findById,
  find,
};
