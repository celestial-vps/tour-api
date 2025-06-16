'use strict';

const districtService = require('../services/district.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

const jwtMaker = new JwtMaker();

const create = async (req, res) => {
  console.log('🟢 [CREATE] District controller called');
  try {
    const userJwt = req.authorization_payload;
    const { district, err } = await districtService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "District", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }
    await recordAuditTrail("CREATE", "District", district, req, 'SUCCESS', 'Create district success');
    return buildResponse.createOk(res, district, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "District", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { district, err } = await districtService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "District", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }
    await recordAuditTrail("UPDATE", "District", district, req, 'SUCCESS', 'Update district success');
    return buildResponse.updateOk(res, district, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "District", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { district, err } = await districtService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "District", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }
    await recordAuditTrail("DELETE", "District", district, req, 'SUCCESS', 'Delete district success');
    return buildResponse.sendDeleteOk(res, district);
  } catch (err) {
    await recordAuditTrail("DELETE", "District", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { districts, err } = await districtService.findAll();

    if (err) {
      await recordAuditTrail("READ", "District", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }
    await recordAuditTrail("READ", "District", districts, req, 'SUCCESS', 'Get all districts success');
    return buildResponse.findOk(res, districts, districts.length);
  } catch (err) {
    await recordAuditTrail("READ", "District", err, req, 'ERROR', err.message);
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
      await recordAuditTrail("READ", "District", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }
    await recordAuditTrail("READ", "District", result.districts, req, 'SUCCESS', 'Get districts with filters success');
    return buildResponse.sendPagination(res, result.districts, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    await recordAuditTrail("READ", "District", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const { district, err } = await districtService.findById(req.params.oid, { include: [] });

    if (err) {
      await recordAuditTrail("READ", "District", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!district) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "District", district, req, 'SUCCESS', 'Get district by ID success');
    return buildResponse.findOk(res, district);
  } catch (err) {
    await recordAuditTrail("READ", "District", err, req, 'ERROR', err.message);
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
