'use strict';

const cityService = require('../services/city.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

const jwtMaker = new JwtMaker();

const create = async (req, res) => {
  console.log('🟢 [CREATE] City controller called');
  try {
    const userJwt = req.authorization_payload;
    const { city, err } = await cityService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "City", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }
    await recordAuditTrail("CREATE", "City", city, req, 'SUCCESS', 'Create city success');
    return buildResponse.createOk(res, city, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "City", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { city, err } = await cityService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "City", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }
    await recordAuditTrail("UPDATE", "City", city, req, 'SUCCESS', 'Update city success');
    return buildResponse.updateOk(res, city, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "City", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { city, err } = await cityService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "City", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }
    await recordAuditTrail("DELETE", "City", city, req, 'SUCCESS', 'Delete city success');
    return buildResponse.sendDeleteOk(res, city);
  } catch (err) {
    await recordAuditTrail("DELETE", "City", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { citys, err } = await cityService.findAll();

    if (err) {
      await recordAuditTrail("READ", "City", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }
    await recordAuditTrail("READ", "City", citys, req, 'SUCCESS', 'Get all citys success');
    return buildResponse.findOk(res, citys, citys.length);
  } catch (err) {
    await recordAuditTrail("READ", "City", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['provinceOid', 'cityName', 'search']);
    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await cityService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "City", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }
    await recordAuditTrail("READ", "City", result.citys, req, 'SUCCESS', 'Get citys with filters success');
    return buildResponse.sendPagination(res, result.citys, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    await recordAuditTrail("READ", "City", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const { city, err } = await cityService.findById(req.params.oid, { include: [] });

    if (err) {
      await recordAuditTrail("READ", "City", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!city) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "City", city, req, 'SUCCESS', 'Get city by ID success');
    return buildResponse.findOk(res, city);
  } catch (err) {
    await recordAuditTrail("READ", "City", err, req, 'ERROR', err.message);
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
