const roomService = require('../services/room.service');
const buildResponse = require('../common/build.response');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

/**
 * Create Room
 */
const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { room, err } = await roomService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "rooms", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }

    await recordAuditTrail("CREATE", "rooms", room, req, 'SUCCESS', 'Create Room success');
    return buildResponse.createOk(res, room, 1);

  } catch (err) {
    await recordAuditTrail("CREATE", "rooms", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Update Room
 */
const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { room, err } = await roomService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "rooms", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }

    await recordAuditTrail("UPDATE", "rooms", room, req, 'SUCCESS', 'Update Room success');
    return buildResponse.updateOk(res, room, 1);

  } catch (err) {
    await recordAuditTrail("UPDATE", "rooms", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Delete Room
 */
const remove = async (req, res) => {
  try {
    const { room, err } = await roomService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "rooms", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "delete");
    }

    await recordAuditTrail("DELETE", "rooms", room, req, 'SUCCESS', 'Delete Room success');
    return buildResponse.sendDeleteOk(res, room);

  } catch (err) {
    await recordAuditTrail("DELETE", "rooms", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Get All Rooms
 */
const findAll = async (req, res) => {
  try {
    const { rooms, err } = await roomService.findAll();

    if (err) {
      await recordAuditTrail("READ", "rooms", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }

    await recordAuditTrail("READ", "rooms", rooms, req, 'SUCCESS', 'Get All Rooms success');
    return buildResponse.findOk(res, rooms, rooms.length);

  } catch (err) {
    await recordAuditTrail("READ", "rooms", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Pagination / Search Rooms
 */
const find = async (req, res) => {
  try {
    const filters = pick(req.body, ["roomNumber", "roomType", "capacity", "status", "search"]);

    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: Number(req.query.pageIndex),
      pageSize: Number(req.query.pageSize)
    };

    const result = await roomService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "rooms", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }

    await recordAuditTrail("READ", "rooms", result.rooms, req, 'SUCCESS', 'Get Rooms with filters success');

    return buildResponse.sendPagination(
      res,
      result.rooms,
      result.count,
      options.pageIndex,
      options.pageSize
    );

  } catch (error) {
    await recordAuditTrail("READ", "rooms", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

/**
 * Find Room by ID
 */
const findById = async (req, res) => {
  try {
    const { room, err } = await roomService.findById(req.params.oid);

    if (err) {
      await recordAuditTrail("READ", "rooms", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!room) return buildResponse.sendDataNotFound(res);

    await recordAuditTrail("READ", "rooms", room, req, 'SUCCESS', 'Get Room by ID success');
    return buildResponse.findOk(res, room);

  } catch (err) {
    await recordAuditTrail("READ", "rooms", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

module.exports = {
  create,
  update,
  remove,
  findAll,
  find,
  findById
};
