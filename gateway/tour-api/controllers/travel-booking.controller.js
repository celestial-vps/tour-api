'use strict';

const travelBookingService = require('../services/travel-booking.service.js');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

const jwtMaker = new JwtMaker();

const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { travelBooking, err } = await travelBookingService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "booking", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }
    await recordAuditTrail("CREATE", "booking", travelBooking, req, 'SUCCESS', 'Create Travel Booking success');
    return buildResponse.createOk(res, travelBooking, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "booking", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const createNoAuth = async (req, res) => {
  try {    
    const { travelBooking, err } = await travelBookingService.createNoAuth(req.body);

    if (err) {
      await recordAuditTrail("CREATE", "booking", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }
    await recordAuditTrail("CREATE", "booking", travelBooking, req, 'SUCCESS', 'Create Travel Booking success');
    return buildResponse.createOk(res, travelBooking, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "booking", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { travelBooking, err } = await travelBookingService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "booking", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }
    await recordAuditTrail("UPDATE", "booking", travelBooking, req, 'SUCCESS', 'Update Travel Booking success');
    return buildResponse.updateOk(res, travelBooking, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "booking", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { travelBooking, err } = await travelBookingService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "booking", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }
    await recordAuditTrail("DELETE", "booking", travelBooking, req, 'SUCCESS', 'Delete Travel Booking success');
    return buildResponse.sendDeleteOk(res, travelBooking);
  } catch (err) {
    await recordAuditTrail("DELETE", "booking", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { travelBookings, err } = await travelBookingService.findAll();

    if (err) {
      await recordAuditTrail("READ", "booking", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }
    await recordAuditTrail("READ", "booking", travelBookings, req, 'SUCCESS', 'Get all Travel Bookings success');
    return buildResponse.findOk(res, travelBookings, travelBookings.length);
  } catch (err) {
    await recordAuditTrail("READ", "booking", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['code', 'discountType', 'search']);
    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await travelBookingService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "booking", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }
    await recordAuditTrail("READ", "booking", result.travelBookings, req, 'SUCCESS', 'Get Travel Bookings with filters success');
    return buildResponse.sendPagination(res, result.travelBookings, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    await recordAuditTrail("READ", "booking", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};


const findTopFive = async (req, res) => {
  try {
    const filters = pick(req.body, ['code', 'discountType', 'search']);
    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder, 
    };

    const result = await travelBookingService.findTopFive(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "booking", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }
    await recordAuditTrail("READ", "booking", result.travelBookings, req, 'SUCCESS', 'Get Travel Bookings with filters success');
    return buildResponse.sendPagination(res, result.travelBookings, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    await recordAuditTrail("READ", "booking", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};


const findById = async (req, res) => {
  try {
    const { travelBooking, err } = await travelBookingService.findById(req.params.oid, { include: [] });

    if (err) {
      await recordAuditTrail("READ", "booking", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!travelBooking) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "booking", travelBooking, req, 'SUCCESS', 'Get Travel Booking by ID success');
    return buildResponse.findOk(res, travelBooking);
  } catch (err) {
    await recordAuditTrail("READ", "booking", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

module.exports = {
  create,
  createNoAuth,
  update,
  remove,
  findAll,
  find,
  findById,
  findTopFive
};
