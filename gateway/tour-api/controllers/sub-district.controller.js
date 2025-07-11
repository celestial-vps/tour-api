'use strict';

const subDistrictService = require('../services/sub-district.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

const jwtMaker = new JwtMaker();

const create = async (req, res) => { 
  try {
    const userJwt = req.authorization_payload;
    const { subDistrict, err } = await subDistrictService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "sub_districts", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }
    await recordAuditTrail("CREATE", "sub_districts", subDistrict, req, 'SUCCESS', 'Create Sub District success');
    return buildResponse.createOk(res, subDistrict, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "sub_districts", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { subDistrict, err } = await subDistrictService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "sub_districts", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }
    await recordAuditTrail("UPDATE", "sub_districts", subDistrict, req, 'SUCCESS', 'Update Sub District success');
    return buildResponse.updateOk(res, subDistrict, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "sub_districts", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { subDistrict, err } = await subDistrictService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "sub_districts", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }
    await recordAuditTrail("DELETE", "sub_districts", subDistrict, req, 'SUCCESS', 'Delete Sub District success');
    return buildResponse.sendDeleteOk(res, subDistrict);
  } catch (err) {
    await recordAuditTrail("DELETE", "sub_districts", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { subDistricts, err } = await subDistrictService.findAll();

    if (err) {
      await recordAuditTrail("READ", "sub_districts", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }
    await recordAuditTrail("READ", "sub_districts", subDistricts, req, 'SUCCESS', 'Get all Sub Districts success');
    return buildResponse.findOk(res, subDistricts, subDistricts.length);
  } catch (err) {
    await recordAuditTrail("READ", "sub_districts", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['districtOid', 'subDistrictName', 'search']);
    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await subDistrictService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "sub_districts", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }
    await recordAuditTrail("READ", "sub_districts", result.subDistricts, req, 'SUCCESS', 'Get Sub Districts with filters success');
    return buildResponse.sendPagination(res, result.subDistricts, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    await recordAuditTrail("READ", "sub_districts", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const { subDistrict, err } = await subDistrictService.findById(req.params.oid, { include: [] });

    if (err) {
      await recordAuditTrail("READ", "sub_districts", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!subDistrict) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "sub_districts", subDistrict, req, 'SUCCESS', 'Get Sub District by ID success');
    return buildResponse.findOk(res, subDistrict);
  } catch (err) {
    await recordAuditTrail("READ", "sub_districts", err, req, 'ERROR', err.message);
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
