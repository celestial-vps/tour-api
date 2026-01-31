'use strict';

const travelPromoService = require('../services/travel-promo.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

const jwtMaker = new JwtMaker();

const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { travelPromo, err } = await travelPromoService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "travel_promo", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }
    await recordAuditTrail("CREATE", "travel_promo", travelPromo, req, 'SUCCESS', 'Create Travel Promo success');
    return buildResponse.createOk(res, travelPromo, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "travel_promo", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { travelPromo, err } = await travelPromoService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "travel_promo", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }
    await recordAuditTrail("UPDATE", "travel_promo", travelPromo, req, 'SUCCESS', 'Update Travel Promo success');
    return buildResponse.updateOk(res, travelPromo, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "travel_promo", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { travelPromo, err } = await travelPromoService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "travel_promo", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }
    await recordAuditTrail("DELETE", "travel_promo", travelPromo, req, 'SUCCESS', 'Delete Travel Promo success');
    return buildResponse.sendDeleteOk(res, travelPromo);
  } catch (err) {
    await recordAuditTrail("DELETE", "travel_promo", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { travelPromos, err } = await travelPromoService.findAll();

    if (err) {
      await recordAuditTrail("READ", "travel_promo", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }
    await recordAuditTrail("READ", "travel_promo", travelPromos, req, 'SUCCESS', 'Get all Travel Promos success');
    return buildResponse.findOk(res, travelPromos, travelPromos.length);
  } catch (err) {
    await recordAuditTrail("READ", "travel_promo", err, req, 'ERROR', err.message);
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

    const result = await travelPromoService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "travel_promo", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }
    await recordAuditTrail("READ", "travel_promo", result.travelPromos, req, 'SUCCESS', 'Get Travel Promos with filters success');
    return buildResponse.sendPagination(res, result.travelPromos, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    await recordAuditTrail("READ", "travel_promo", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const { travelPromo, err } = await travelPromoService.findById(req.params.oid, { include: [] });

    if (err) {
      await recordAuditTrail("READ", "travel_promo", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!travelPromo) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "travel_promo", travelPromo, req, 'SUCCESS', 'Get Travel Promo by ID success');
    return buildResponse.findOk(res, travelPromo);
  } catch (err) {
    await recordAuditTrail("READ", "travel_promo", err, req, 'ERROR', err.message);
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
