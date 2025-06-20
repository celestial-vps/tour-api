'use strict';

const districtService = require('../services/district.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

const jwtMaker = new JwtMaker();

const create = async (req, res) => {  
  try {
    const userJwt = req.authorization_payload;
    const { district, err } = await districtService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "districts", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }
    await recordAuditTrail("CREATE", "districts", district, req, 'SUCCESS', 'Create District success');
    return buildResponse.createOk(res, district, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "districts", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { district, err } = await districtService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "districts", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }
    await recordAuditTrail("UPDATE", "districts", district, req, 'SUCCESS', 'Update District success');
    return buildResponse.updateOk(res, district, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "districts", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { district, err } = await districtService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "districts", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }
    await recordAuditTrail("DELETE", "districts", district, req, 'SUCCESS', 'Delete District success');
    return buildResponse.sendDeleteOk(res, district);
  } catch (err) {
    await recordAuditTrail("DELETE", "districts", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { districts, err } = await districtService.findAll();

    if (err) {
      await recordAuditTrail("READ", "districts", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }
    await recordAuditTrail("READ", "districts", districts, req, 'SUCCESS', 'Get all Districts success');
    return buildResponse.findOk(res, districts, districts.length);
  } catch (err) {
    await recordAuditTrail("READ", "districts", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['cityOid', 'districtName', 'search']);
    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await districtService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "districts", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }
    await recordAuditTrail("READ", "districts", result.districts, req, 'SUCCESS', 'Get Districts with filters success');
    return buildResponse.sendPagination(res, result.districts, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    await recordAuditTrail("READ", "districts", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const { district, err } = await districtService.findById(req.params.oid, { include: [] });

    if (err) {
      await recordAuditTrail("READ", "districts", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!district) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "districts", district, req, 'SUCCESS', 'Get District by ID success');
    return buildResponse.findOk(res, district);
  } catch (err) {
    await recordAuditTrail("READ", "districts", err, req, 'ERROR', err.message);
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
