const bidderService = require('../services/bidder.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');


const jwtMaker = new JwtMaker();

const create = async (req, res) => { 
  try {
    const userJwt = req.authorization_payload;
    const { bidder, err } = await bidderService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "bidders", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }
    await recordAuditTrail("CREATE", "bidders", bidder, req, 'SUCCESS', 'Create Bidder success');
    return buildResponse.createOk(res, bidder, 1);

  } catch (err) {
    await recordAuditTrail("CREATE", "bidders", err, req, 'ERROR', err.message);
    console.error('Controller Create Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { bidder, err } = await bidderService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "bidders", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }
    await recordAuditTrail("UPDATE", "bidders", bidder, req, 'SUCCESS', 'Update Bidder success');
    return buildResponse.updateOk(res, bidder, 1);
  } catch (err) {
    console.error('Controller Update Error:', err);
    await recordAuditTrail("UPDATE", "bidders", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { bidder, err } = await bidderService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "bidders", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }
    await recordAuditTrail("DELETE", "bidders", bidder, req, 'SUCCESS', 'Delete Bidder success');
    return buildResponse.sendDeleteOk(res, bidder);
  } catch (err) {
    await recordAuditTrail("DELETE", "bidders", err, req, 'ERROR', err.message);
    console.error('Controller Delete Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { bidders, err } = await bidderService.findAll();

    if (err) {
      await recordAuditTrail("READ", "bidders", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }
    await recordAuditTrail("READ", "bidders", bidders, req, 'SUCCESS', 'Get all Bidders success');
    return buildResponse.findOk(res, bidders, bidders.length);
  } catch (err) {
    await recordAuditTrail("READ", "bidders", err, req, 'ERROR', err.message);
    console.error('Controller Find All Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['bidderCode', 'bidderName', 'search']);

    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await bidderService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "bidders", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }
    await recordAuditTrail("READ", "bidders", result.bidders, req, 'SUCCESS', 'Get Bidders with filters success');
    return buildResponse.sendPagination(res, result.bidders, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    console.error('Controller error:', error);
    await recordAuditTrail("READ", "bidders", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const options = {
      include: [], // bisa ditambahkan jika ada relasi
    };

    const { bidder, err } = await bidderService.findById(req.params.oid, options);

    if (err) {
      await recordAuditTrail("READ", "bidders", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!bidder) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "bidders", bidder, req, 'SUCCESS', 'Get Bidder by ID success');
    return buildResponse.findOk(res, bidder);
  } catch (err) {
    await recordAuditTrail("READ", "bidders", err, req, 'ERROR', err.message);
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
