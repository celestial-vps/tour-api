const bidService = require('../services/bid.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');


const jwtMaker = new JwtMaker();

const create = async (req, res) => { 
  try {
    const userJwt = req.authorization_payload;
    const { bid, error } = await bidService.create(req.body, userJwt.userOid);

    if (error) {
      await recordAuditTrail("CREATE", "bids", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message, "insert");
    }
    await recordAuditTrail("CREATE", "bids", bid, req, 'SUCCESS', 'Create Bid success');
    return buildResponse.createOk(res, bid, 1);

  } catch (error) {
    await recordAuditTrail("CREATE", "bids", error, req, 'ERROR', error.message);
    console.error('Controller Create Error:', error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { bid, error } = await bidService.update(req.params.oid, req.body, userJwt.userOid);

    if (error) {
      await recordAuditTrail("UPDATE", "bids", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message, "update");
    }
    await recordAuditTrail("UPDATE", "bids", bid, req, 'SUCCESS', 'Update Bid success');
    return buildResponse.updateOk(res, bid, 1);
  } catch (error) {
    console.error('Controller Update Error:', error);
    await recordAuditTrail("UPDATE", "bids", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const remove = async (req, res) => {
  try {
    const { bid, error } = await bidService.deleted(req.params.oid);

    if (error) {
      await recordAuditTrail("DELETE", "bids", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message || error, "delete");
    }
    await recordAuditTrail("DELETE", "bids", bid, req, 'SUCCESS', 'Delete Bid success');
    return buildResponse.sendDeleteOk(res, bid);
  } catch (error) {
    await recordAuditTrail("DELETE", "bids", error, req, 'ERROR', error.message);
    console.error('Controller Delete Error:', error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { bids, error } = await bidService.findAll();

    if (error) {
      await recordAuditTrail("READ", "bids", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message, "get all");
    }
    await recordAuditTrail("READ", "bids", bids, req, 'SUCCESS', 'Get all Bids success');
    return buildResponse.findOk(res, bids, bids.length);
  } catch (error) {
    await recordAuditTrail("READ", "bids", error, req, 'ERROR', error.message);
    console.error('Controller Find All Error:', error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['bidCode', 'bidName', 'search']);

    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await bidService.findPage(filters, options);

    if (result.error) {
      await recordAuditTrail("READ", "bids", result.error, req, 'FAILED', result.error.message);
      return buildResponse.sendInternalServerError(res, result.error.message);
    }
    await recordAuditTrail("READ", "bids", result.bids, req, 'SUCCESS', 'Get Bids with filters success');
    return buildResponse.sendPagination(res, result.bids, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    console.error('Controller error:', error);
    await recordAuditTrail("READ", "bids", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const options = {
      include: [], // bisa ditambahkan jika ada relasi
    };

    const { bid, error } = await bidService.findById(req.params.oid, options);

    if (error) {
      await recordAuditTrail("READ", "bids", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message, "get by id");
    }

    if (!bid) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "bids", bid, req, 'SUCCESS', 'Get Bid by ID success');
    return buildResponse.findOk(res, bid);
  } catch (error) {
    await recordAuditTrail("READ", "bids", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
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
