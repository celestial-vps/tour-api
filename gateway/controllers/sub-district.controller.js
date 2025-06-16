'use strict';

const subdistrictService = require('../services/sub-district.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

const jwtMaker = new JwtMaker();

const create = async (req, res) => {
  console.log('🟢 [CREATE] Subdistrict controller called');
  try {
    const userJwt = req.authorization_payload;
    const { subdistrict, err } = await subdistrictService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "Subdistrict", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }
    await recordAuditTrail("CREATE", "Subdistrict", subdistrict, req, 'SUCCESS', 'Create subdistrict success');
    return buildResponse.createOk(res, subdistrict, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "Subdistrict", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { subdistrict, err } = await subdistrictService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "Subdistrict", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }
    await recordAuditTrail("UPDATE", "Subdistrict", subdistrict, req, 'SUCCESS', 'Update subdistrict success');
    return buildResponse.updateOk(res, subdistrict, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "Subdistrict", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { subdistrict, err } = await subdistrictService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "Subdistrict", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }
    await recordAuditTrail("DELETE", "Subdistrict", subdistrict, req, 'SUCCESS', 'Delete subdistrict success');
    return buildResponse.sendDeleteOk(res, subdistrict);
  } catch (err) {
    await recordAuditTrail("DELETE", "Subdistrict", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { subdistricts, err } = await subdistrictService.findAll();

    if (err) {
      await recordAuditTrail("READ", "Subdistrict", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }
    await recordAuditTrail("READ", "Subdistrict", subdistricts, req, 'SUCCESS', 'Get all subdistricts success');
    return buildResponse.findOk(res, subdistricts, subdistricts.length);
  } catch (err) {
    await recordAuditTrail("READ", "Subdistrict", err, req, 'ERROR', err.message);
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

    const result = await subdistrictService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "Subdistrict", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }
    await recordAuditTrail("READ", "Subdistrict", result.subDistricts, req, 'SUCCESS', 'Get subDistricts with filters success');
    return buildResponse.sendPagination(res, result.subDistricts, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    await recordAuditTrail("READ", "Subdistrict", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const { subdistrict, err } = await subdistrictService.findById(req.params.oid, { include: [] });

    if (err) {
      await recordAuditTrail("READ", "Subdistrict", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!subdistrict) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "Subdistrict", subdistrict, req, 'SUCCESS', 'Get subdistrict by ID success');
    return buildResponse.findOk(res, subdistrict);
  } catch (err) {
    await recordAuditTrail("READ", "Subdistrict", err, req, 'ERROR', err.message);
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
