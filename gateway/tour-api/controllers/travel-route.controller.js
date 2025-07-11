'use strict';

const travelRouteService = require('../services/travel-route.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

const jwtMaker = new JwtMaker();

const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { travelRoute, err } = await travelRouteService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "travel_route", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }
    await recordAuditTrail("CREATE", "travel_route", travelRoute, req, 'SUCCESS', 'Create Travel Route success');
    return buildResponse.createOk(res, travelRoute, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "travel_route", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { travelRoute, err } = await travelRouteService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "travel_route", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }
    await recordAuditTrail("UPDATE", "travel_route", travelRoute, req, 'SUCCESS', 'Update Travel Route success');
    return buildResponse.updateOk(res, travelRoute, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "travel_route", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { travelRoute, err } = await travelRouteService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "travel_route", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }
    await recordAuditTrail("DELETE", "travel_route", travelRoute, req, 'SUCCESS', 'Delete Travel Route success');
    return buildResponse.sendDeleteOk(res, travelRoute);
  } catch (err) {
    await recordAuditTrail("DELETE", "travel_route", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { travelRoutes, err } = await travelRouteService.findAll();

    if (err) {
      await recordAuditTrail("READ", "travel_route", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }
    await recordAuditTrail("READ", "travel_route", travelRoutes, req, 'SUCCESS', 'Get all Travel Routes success');
    return buildResponse.findOk(res, travelRoutes, travelRoutes.length);
  } catch (err) {
    await recordAuditTrail("READ", "travel_route", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['originOid', 'destinationOid', 'search']);
    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await travelRouteService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "travel_route", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }
    await recordAuditTrail("READ", "travel_route", result.travelRoutes, req, 'SUCCESS', 'Get Travel Routes with filters success');
    return buildResponse.sendPagination(res, result.travelRoutes, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    await recordAuditTrail("READ", "travel_route", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const { travelRoute, err } = await travelRouteService.findById(req.params.oid, { include: [] });

    if (err) {
      await recordAuditTrail("READ", "travel_route", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!travelRoute) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "travel_route", travelRoute, req, 'SUCCESS', 'Get Travel Route by ID success');
    return buildResponse.findOk(res, travelRoute);
  } catch (err) {
    await recordAuditTrail("READ", "travel_route", err, req, 'ERROR', err.message);
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
