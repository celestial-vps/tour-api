'use strict';

const provinceCacheService = require('../services/province-cache.service');
const buildResponse = require('../common/build.response');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

const findAll = async (req, res) => {
  try {
    const provinces = await provinceCacheService.getAllProvinces();
    await recordAuditTrail("READ", "ProvinceCache", null, req, 'SUCCESS', 'Get all cached provinces');
    return buildResponse.findOk(res, provinces, provinces.length);
  } catch (err) {
    await recordAuditTrail("READ", "ProvinceCache", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findById = async (req, res) => {
  try {
    const province = await provinceCacheService.getProvinceById(req.params.id);
    if (!province) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "ProvinceCache", province, req, 'SUCCESS', 'Get cached province by ID');
    return buildResponse.findOk(res, province);
  } catch (err) {
    await recordAuditTrail("READ", "ProvinceCache", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const name = req.query.name || '';
    const provinces = await provinceCacheService.searchProvincesByName(name);
    await recordAuditTrail("READ", "ProvinceCache", null, req, 'SUCCESS', `Search cached provinces by name: ${name}`);
    return buildResponse.findOk(res, provinces.provinces, provinces.provinces.length);
  } catch (err) {
    await recordAuditTrail("READ", "ProvinceCache", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

module.exports = {
  findAll,
  findById,
  find,
};
