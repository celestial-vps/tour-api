'use strict';

const vehicleTypeService = require('../services/vehicle-type.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

const jwtMaker = new JwtMaker();

const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { vehicletype, err } = await vehicleTypeService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "Vehicle_types", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }
    await recordAuditTrail("CREATE", "Vehicle_types", vehicletype, req, 'SUCCESS', 'Create Vehicle Type success');
    return buildResponse.createOk(res, vehicletype, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "Vehicle_types", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { vehicletype, err } = await vehicleTypeService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "Vehicle_types", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }
    await recordAuditTrail("UPDATE", "Vehicle_types", vehicletype, req, 'SUCCESS', 'Update Vehicle Type success');
    return buildResponse.updateOk(res, vehicletype, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "Vehicle_types", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { vehicletype, err } = await vehicleTypeService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "Vehicle_types", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }
    await recordAuditTrail("DELETE", "Vehicle_types", vehicletype, req, 'SUCCESS', 'Delete Vehicle Type success');
    return buildResponse.sendDeleteOk(res, vehicletype);
  } catch (err) {
    await recordAuditTrail("DELETE", "Vehicle_types", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { vehicleTypes, err } = await vehicleTypeService.findAll();

    if (err) {
      await recordAuditTrail("READ", "Vehicle_types", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }
    await recordAuditTrail("READ", "Vehicle_types", vehicleTypes, req, 'SUCCESS', 'Get all Vehicle Types success');
    return buildResponse.findOk(res, vehicleTypes, vehicleTypes.length);
  } catch (err) {
    await recordAuditTrail("READ", "Vehicle_types", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['typeName', 'search']);
    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await vehicleTypeService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "Vehicle_types", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }
    await recordAuditTrail("READ", "Vehicle_types", result.vehicleTypes, req, 'SUCCESS', 'Get Vehicle Types with filters success');
    return buildResponse.sendPagination(res, result.vehicleTypes, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    await recordAuditTrail("READ", "Vehicle_types", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const { vehicleType, err } = await vehicleTypeService.findById(req.params.oid, { include: [] });

    if (err) {
      await recordAuditTrail("READ", "Vehicle_types", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!vehicleType) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "Vehicle_types", vehicleType, req, 'SUCCESS', 'Get Vehicle Type by ID success');
    return buildResponse.findOk(res, vehicleType);
  } catch (err) {
    await recordAuditTrail("READ", "Vehicle_types", err, req, 'ERROR', err.message);
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
