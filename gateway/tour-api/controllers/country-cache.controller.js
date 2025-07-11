'use strict';

const countryCacheService = require('../services/country-cache.service');
const buildResponse = require('../common/build.response');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

const findAll = async (req, res) => {
  try {
    const countries = await countryCacheService.getAllCountries();
    await recordAuditTrail("READ", "CountryCache", null, req, 'SUCCESS', 'Get all cached countries');
    return buildResponse.findOk(res, countries, countries.length);
  } catch (err) {
    await recordAuditTrail("READ", "CountryCache", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findById = async (req, res) => {
  try {
    const country = await countryCacheService.getCountryById(req.params.id);
    if (!country) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "CountryCache", country, req, 'SUCCESS', 'Get cached country by ID');
    return buildResponse.findOk(res, country);
  } catch (err) {
    await recordAuditTrail("READ", "CountryCache", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const name = req.query.name || '';
    const countries = await countryCacheService.searchCountriesByName(name);
    await recordAuditTrail("READ", "CountryCache", null, req, 'SUCCESS', `Search cached countries by name: ${name}`);
    return buildResponse.findOk(res, countries.countries, countries.countries.length);
  } catch (err) {
    await recordAuditTrail("READ", "CountryCache", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

module.exports = {
  findAll,
  findById,
  find,
};
