'use strict';

const vehicleService = require('../services/vehicle.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

const jwtMaker = new JwtMaker();

const create = async (req, res) => { 
  try {
    const userJwt = req.authorization_payload;
    const { vehicle, err } = await vehicleService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "vehicles", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }
    await recordAuditTrail("CREATE", "vehicles", vehicle, req, 'SUCCESS', 'Create Vehicle success');
    return buildResponse.createOk(res, vehicle, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "vehicles", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { vehicle, err } = await vehicleService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "vehicles", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }
    await recordAuditTrail("UPDATE", "vehicles", vehicle, req, 'SUCCESS', 'Update Vehicle success');
    return buildResponse.updateOk(res, vehicle, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "vehicles", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { vehicle, err } = await vehicleService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "vehicles", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }
    await recordAuditTrail("DELETE", "vehicles", vehicle, req, 'SUCCESS', 'Delete Vehicle success');
    return buildResponse.sendDeleteOk(res, vehicle);
  } catch (err) {
    await recordAuditTrail("DELETE", "vehicles", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { vehicles, err } = await vehicleService.findAll();

    if (err) {
      await recordAuditTrail("READ", "vehicles", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }
    await recordAuditTrail("READ", "vehicles", vehicles, req, 'SUCCESS', 'Get all Vehicles success');
    return buildResponse.findOk(res, vehicles, vehicles.length);
  } catch (err) {
    await recordAuditTrail("READ", "vehicles", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['vehicleTypeOid', 'year', 'search']);
    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await vehicleService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "vehicles", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }
    await recordAuditTrail("READ", "vehicles", result.vehicles, req, 'SUCCESS', 'Get Vehicles with filters success');
    return buildResponse.sendPagination(res, result.vehicles, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    await recordAuditTrail("READ", "vehicles", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const { vehicle, err } = await vehicleService.findById(req.params.oid, { include: [] });

    if (err) {
      await recordAuditTrail("READ", "vehicles", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!vehicle) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "vehicles", vehicle, req, 'SUCCESS', 'Get Vehicle by ID success');
    return buildResponse.findOk(res, vehicle);
  } catch (err) {
    await recordAuditTrail("READ", "vehicles", err, req, 'ERROR', err.message);
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
