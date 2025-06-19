'use strict';

const hotelroomService = require('../services/hotel-room.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

const jwtMaker = new JwtMaker();

const create = async (req, res) => {
  console.log('🟢 [CREATE] Hotelroom controller called');
  try {
    const userJwt = req.authorization_payload;
    const { hotelroom, err } = await hotelroomService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "Hotelroom", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }
    await recordAuditTrail("CREATE", "Hotelroom", hotelroom, req, 'SUCCESS', 'Create hotelroom success');
    return buildResponse.createOk(res, hotelroom, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "Hotelroom", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { hotelroom, err } = await hotelroomService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "Hotelroom", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }
    await recordAuditTrail("UPDATE", "Hotelroom", hotelroom, req, 'SUCCESS', 'Update hotelroom success');
    return buildResponse.updateOk(res, hotelroom, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "Hotelroom", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { hotelroom, err } = await hotelroomService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "Hotelroom", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }
    await recordAuditTrail("DELETE", "Hotelroom", hotelroom, req, 'SUCCESS', 'Delete hotelroom success');
    return buildResponse.sendDeleteOk(res, hotelroom);
  } catch (err) {
    await recordAuditTrail("DELETE", "Hotelroom", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { hotelRooms, err } = await hotelRoomService.findAll();

    if (err) {
      await recordAuditTrail("READ", "Hotelroom", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }
    await recordAuditTrail("READ", "Hotelroom", hotelRooms, req, 'SUCCESS', 'Get all hotelRooms success');
    return buildResponse.findOk(res, hotelRooms, hotelRooms.length);
  } catch (err) {
    await recordAuditTrail("READ", "Hotelroom", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['hotelOid', 'room_type', 'search']);
    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await hotelroomService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "Hotelroom", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }
    await recordAuditTrail("READ", "Hotelroom", result.hotelRooms, req, 'SUCCESS', 'Get hotelRooms with filters success');
    return buildResponse.sendPagination(res, result.hotelRooms, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    await recordAuditTrail("READ", "Hotelroom", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const { hotelroom, err } = await hotelroomService.findById(req.params.oid, { include: [] });

    if (err) {
      await recordAuditTrail("READ", "Hotelroom", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!hotelroom) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "Hotelroom", hotelroom, req, 'SUCCESS', 'Get hotelroom by ID success');
    return buildResponse.findOk(res, hotelroom);
  } catch (err) {
    await recordAuditTrail("READ", "Hotelroom", err, req, 'ERROR', err.message);
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
