'use strict';

const subAreaService = require('../services/sub-area.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

const jwtMaker = new JwtMaker();

const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { subArea, err } = await subAreaService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "sub_area", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }
    await recordAuditTrail("CREATE", "sub_area", subArea, req, 'SUCCESS', 'Create Sub Area success');
    return buildResponse.createOk(res, subArea, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "sub_area", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { subArea, err } = await subAreaService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "sub_area", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }
    await recordAuditTrail("UPDATE", "sub_area", subArea, req, 'SUCCESS', 'Update Sub Area success');
    return buildResponse.updateOk(res, subArea, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "sub_area", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { subArea, err } = await subAreaService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "sub_area", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }
    await recordAuditTrail("DELETE", "sub_area", subArea, req, 'SUCCESS', 'Delete Sub Area success');
    return buildResponse.sendDeleteOk(res, subArea);
  } catch (err) {
    await recordAuditTrail("DELETE", "sub_area", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { subAreas, err } = await subAreaService.findAll();

    if (err) {
      await recordAuditTrail("READ", "sub_area", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }
    await recordAuditTrail("READ", "sub_area", subAreas, req, 'SUCCESS', 'Get all Sub Areas success');
    return buildResponse.findOk(res, subAreas, subAreas.length);
  } catch (err) {
    await recordAuditTrail("READ", "sub_area", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['cityOid', 'subAreaName', 'search']);
    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await subAreaService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "sub_area", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }
    await recordAuditTrail("READ", "sub_area", result.subAreas, req, 'SUCCESS', 'Get Sub Areas with filters success');
    return buildResponse.sendPagination(res, result.subAreas, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    await recordAuditTrail("READ", "sub_area", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const { subArea, err } = await subAreaService.findById(req.params.oid, { include: [] });

    if (err) {
      await recordAuditTrail("READ", "sub_area", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!subArea) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "sub_area", subArea, req, 'SUCCESS', 'Get Sub Area by ID success');
    return buildResponse.findOk(res, subArea);
  } catch (err) {
    await recordAuditTrail("READ", "sub_area", err, req, 'ERROR', err.message);
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
