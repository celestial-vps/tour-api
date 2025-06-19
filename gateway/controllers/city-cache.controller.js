'use strict';

const cityCacheService = require('../services/city-cache.service');
const buildResponse = require('../common/build.response');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

const findAll = async (req, res) => {
  try {
    const countries = await cityCacheService.getAllCities();
    await recordAuditTrail("READ", "CityCache", null, req, 'SUCCESS', 'Get all cached countries');
    return buildResponse.findOk(res, countries, countries.length);
  } catch (err) {
    await recordAuditTrail("READ", "CityCache", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findById = async (req, res) => {
  try {
    const city = await cityCacheService.getCityById(req.params.id);
    if (!city) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "CityCache", city, req, 'SUCCESS', 'Get cached city by ID');
    return buildResponse.findOk(res, city);
  } catch (err) {
    await recordAuditTrail("READ", "CityCache", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const name = req.query.name || '';
    const countries = await cityCacheService.searchCitiesByName(name);
    await recordAuditTrail("READ", "CityCache", null, req, 'SUCCESS', `Search cached countries by name: ${name}`);
    return buildResponse.findOk(res, countries.countries, countries.countries.length);
  } catch (err) {
    await recordAuditTrail("READ", "CityCache", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

module.exports = {
  findAll,
  findById,
  find,
};
