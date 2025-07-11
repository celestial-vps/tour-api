'use strict';

const countryService = require('../services/country.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

const jwtMaker = new JwtMaker();

const create = async (req, res) => {  
  try {
    const userJwt = req.authorization_payload;
    const { country, err } = await countryService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "countries", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }
    await recordAuditTrail("CREATE", "countries", country, req, 'SUCCESS', 'Create Country success');
    return buildResponse.createOk(res, country, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "countries", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { country, err } = await countryService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "countries", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }
    await recordAuditTrail("UPDATE", "countries", country, req, 'SUCCESS', 'Update Country success');
    return buildResponse.updateOk(res, country, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "countries", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { country, err } = await countryService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "countries", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }
    await recordAuditTrail("DELETE", "countries", country, req, 'SUCCESS', 'Delete Country success');
    return buildResponse.sendDeleteOk(res, country);
  } catch (err) {
    await recordAuditTrail("DELETE", "countries", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { countrys, err } = await countryService.findAll();

    if (err) {
      await recordAuditTrail("READ", "countries", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }
    await recordAuditTrail("READ", "countries", countrys, req, 'SUCCESS', 'Get all Countries success');
    return buildResponse.findOk(res, countrys, countrys.length);
  } catch (err) {
    await recordAuditTrail("READ", "countries", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['countryCode', 'countryName', 'search']);
    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await countryService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "countries", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }
    await recordAuditTrail("READ", "countries", result.countrys, req, 'SUCCESS', 'Get Countries with filters success');
    return buildResponse.sendPagination(res, result.countrys, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    await recordAuditTrail("READ", "countries", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const { country, err } = await countryService.findById(req.params.oid, { include: [] });

    if (err) {
      await recordAuditTrail("READ", "countries", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!country) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "countries", country, req, 'SUCCESS', 'Get Country by ID success');
    return buildResponse.findOk(res, country);
  } catch (err) {
    await recordAuditTrail("READ", "countries", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

module.exports = {
  create,
  update,
  remove,
  findAll,
  find,
  findById,
};
