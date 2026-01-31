const bidderService = require('../services/bidder.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');


const jwtMaker = new JwtMaker();

const create = async (req, res) => { 
  try {
    const userJwt = req.authorization_payload;
    const { bidder, error } = await bidderService.create(req.body, userJwt.userOid);

    if (error) {
      await recordAuditTrail("CREATE", "bidders", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message, "insert");
    }
    await recordAuditTrail("CREATE", "bidders", bidder, req, 'SUCCESS', 'Create Bidder success');
    return buildResponse.createOk(res, bidder, 1);

  } catch (error) {
    await recordAuditTrail("CREATE", "bidders", error, req, 'ERROR', error.message);
    console.error('Controller Create Error:', error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { bidder, error } = await bidderService.update(req.params.oid, req.body, userJwt.userOid);

    if (error) {
      await recordAuditTrail("UPDATE", "bidders", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message, "update");
    }
    await recordAuditTrail("UPDATE", "bidders", bidder, req, 'SUCCESS', 'Update Bidder success');
    return buildResponse.updateOk(res, bidder, 1);
  } catch (error) {
    console.error('Controller Update Error:', error);
    await recordAuditTrail("UPDATE", "bidders", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const remove = async (req, res) => {
  try {
    const { bidder, error } = await bidderService.deleted(req.params.oid);

    if (error) {
      await recordAuditTrail("DELETE", "bidders", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message || error, "delete");
    }
    await recordAuditTrail("DELETE", "bidders", bidder, req, 'SUCCESS', 'Delete Bidder success');
    return buildResponse.sendDeleteOk(res, bidder);
  } catch (error) {
    await recordAuditTrail("DELETE", "bidders", error, req, 'ERROR', error.message);
    console.error('Controller Delete Error:', error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { bidders, error } = await bidderService.findAll();

    if (error) {
      await recordAuditTrail("READ", "bidders", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message, "get all");
    }
    await recordAuditTrail("READ", "bidders", bidders, req, 'SUCCESS', 'Get all Bidders success');
    return buildResponse.findOk(res, bidders, bidders.length);
  } catch (error) {
    await recordAuditTrail("READ", "bidders", error, req, 'ERROR', error.message);
    console.error('Controller Find All Error:', error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['fullName', 'ktpNumber', 'search']);

    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await bidderService.findPage(filters, options);

    if (result.error) {
      await recordAuditTrail("READ", "bidders", result.error, req, 'FAILED', result.error.message);
      return buildResponse.sendInternalServerError(res, result.error.message);
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

    const { bidder, error } = await bidderService.findById(req.params.oid, options);

    if (error) {
      await recordAuditTrail("READ", "bidders", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message, "get by id");
    }

    if (!bidder) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "bidders", bidder, req, 'SUCCESS', 'Get Bidder by ID success');
    return buildResponse.findOk(res, bidder);
  } catch (error) {
    await recordAuditTrail("READ", "bidders", error, req, 'ERROR', error.message);
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
