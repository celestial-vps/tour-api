'use strict';

const hotelService = require('../services/hotel.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

const jwtMaker = new JwtMaker();

const create = async (req, res) => {
  console.log('🟢 [CREATE] Hotel controller called');
  try {
    const userJwt = req.authorization_payload;
    const { hotel, err } = await hotelService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "Hotel", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }
    await recordAuditTrail("CREATE", "Hotel", hotel, req, 'SUCCESS', 'Create hotel success');
    return buildResponse.createOk(res, hotel, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "Hotel", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { hotel, err } = await hotelService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "Hotel", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }
    await recordAuditTrail("UPDATE", "Hotel", hotel, req, 'SUCCESS', 'Update hotel success');
    return buildResponse.updateOk(res, hotel, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "Hotel", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { hotel, err } = await hotelService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "Hotel", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }
    await recordAuditTrail("DELETE", "Hotel", hotel, req, 'SUCCESS', 'Delete hotel success');
    return buildResponse.sendDeleteOk(res, hotel);
  } catch (err) {
    await recordAuditTrail("DELETE", "Hotel", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { hotels, err } = await hotelService.findAll();

    if (err) {
      await recordAuditTrail("READ", "Hotel", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }
    await recordAuditTrail("READ", "Hotel", hotels, req, 'SUCCESS', 'Get all hotels success');
    return buildResponse.findOk(res, hotels, hotels.length);
  } catch (err) {
    await recordAuditTrail("READ", "Hotel", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['hotelName', 'address', 'search']);
    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await hotelService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "Hotel", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }
    await recordAuditTrail("READ", "Hotel", result.hotels, req, 'SUCCESS', 'Get hotels with filters success');
    return buildResponse.sendPagination(res, result.hotels, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    await recordAuditTrail("READ", "Hotel", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const { hotel, err } = await hotelService.findById(req.params.oid, { include: [] });

    if (err) {
      await recordAuditTrail("READ", "Hotel", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!hotel) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "Hotel", hotel, req, 'SUCCESS', 'Get hotel by ID success');
    return buildResponse.findOk(res, hotel);
  } catch (err) {
    await recordAuditTrail("READ", "Hotel", err, req, 'ERROR', err.message);
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
