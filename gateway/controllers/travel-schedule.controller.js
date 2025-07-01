'use strict';

const travelScheduleService = require('../services/travel-schedule.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

const jwtMaker = new JwtMaker();

const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { travelSchedule, err } = await travelScheduleService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "travel_schedule", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }
    await recordAuditTrail("CREATE", "travel_schedule", travelSchedule, req, 'SUCCESS', 'Create Travel Schedule success');
    return buildResponse.createOk(res, travelSchedule, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "travel_schedule", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { travelSchedule, err } = await travelScheduleService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "travel_schedule", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }
    await recordAuditTrail("UPDATE", "travel_schedule", travelSchedule, req, 'SUCCESS', 'Update Travel Schedule success');
    return buildResponse.updateOk(res, travelSchedule, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "travel_schedule", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { travelSchedule, err } = await travelScheduleService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "travel_schedule", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }
    await recordAuditTrail("DELETE", "travel_schedule", travelSchedule, req, 'SUCCESS', 'Delete Travel Schedule success');
    return buildResponse.sendDeleteOk(res, travelSchedule);
  } catch (err) {
    await recordAuditTrail("DELETE", "travel_schedule", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { travelSchedules, err } = await travelScheduleService.findAll();

    if (err) {
      await recordAuditTrail("READ", "travel_schedule", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }
    await recordAuditTrail("READ", "travel_schedule", travelSchedules, req, 'SUCCESS', 'Get all Travel Schedules success');
    return buildResponse.findOk(res, travelSchedules, travelSchedules.length);
  } catch (err) {
    await recordAuditTrail("READ", "travel_schedule", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['routeOid', 'vehicleOid', 'search']);
    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await travelScheduleService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "travel_schedule", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }
    await recordAuditTrail("READ", "travel_schedule", result.travelSchedules, req, 'SUCCESS', 'Get Travel Schedules with filters success');
    return buildResponse.sendPagination(res, result.travelSchedules, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    await recordAuditTrail("READ", "travel_schedule", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const { travelSchedule, err } = await travelScheduleService.findById(req.params.oid, { include: [] });

    if (err) {
      await recordAuditTrail("READ", "travel_schedule", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!travelSchedule) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "travel_schedule", travelSchedule, req, 'SUCCESS', 'Get Travel Schedule by ID success');
    return buildResponse.findOk(res, travelSchedule);
  } catch (err) {
    await recordAuditTrail("READ", "travel_schedule", err, req, 'ERROR', err.message);
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
