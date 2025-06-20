'use strict';

const provinceService = require('../services/province.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

const jwtMaker = new JwtMaker();

const create = async (req, res) => {
  console.log('🟢 [CREATE] Province controller called');
  try {
    const userJwt = req.authorization_payload;
    const { province, err } = await provinceService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "provinces", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }
    await recordAuditTrail("CREATE", "provinces", province, req, 'SUCCESS', 'Create Province success');
    return buildResponse.createOk(res, province, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "provinces", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { province, err } = await provinceService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "provinces", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }
    await recordAuditTrail("UPDATE", "provinces", province, req, 'SUCCESS', 'Update Province success');
    return buildResponse.updateOk(res, province, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "provinces", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { province, err } = await provinceService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "provinces", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }
    await recordAuditTrail("DELETE", "provinces", province, req, 'SUCCESS', 'Delete Province success');
    return buildResponse.sendDeleteOk(res, province);
  } catch (err) {
    await recordAuditTrail("DELETE", "provinces", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { provinces, err } = await provinceService.findAll();

    if (err) {
      await recordAuditTrail("READ", "provinces", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }
    await recordAuditTrail("READ", "provinces", provinces, req, 'SUCCESS', 'Get all Provinces success');
    return buildResponse.findOk(res, provinces, provinces.length);
  } catch (err) {
    await recordAuditTrail("READ", "provinces", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['countryOid', 'provinceName', 'search']);
    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await provinceService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "provinces", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }
    await recordAuditTrail("READ", "provinces", result.provinces, req, 'SUCCESS', 'Get Provinces with filters success');
    return buildResponse.sendPagination(res, result.provinces, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    await recordAuditTrail("READ", "provinces", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const { province, err } = await provinceService.findById(req.params.oid, { include: [] });

    if (err) {
      await recordAuditTrail("READ", "provinces", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!province) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "provinces", province, req, 'SUCCESS', 'Get Province by ID success');
    return buildResponse.findOk(res, province);
  } catch (err) {
    await recordAuditTrail("READ", "provinces", err, req, 'ERROR', err.message);
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
