const sellerService = require('../services/seller.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');


const jwtMaker = new JwtMaker();

const create = async (req, res) => { 
  try {
    const userJwt = req.authorization_payload;
    const { seller, error } = await sellerService.create(req.body, userJwt.userOid);

    if (error) {
      await recordAuditTrail("CREATE", "sellers", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message, "insert");
    }
    await recordAuditTrail("CREATE", "sellers", seller, req, 'SUCCESS', 'Create Seller success');
    return buildResponse.createOk(res, seller, 1);

  } catch (error) {
    await recordAuditTrail("CREATE", "sellers", error, req, 'ERROR', error.message);
    console.error('Controller Create Error:', error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { seller, error } = await sellerService.update(req.params.oid, req.body, userJwt.userOid);

    if (error) {
      await recordAuditTrail("UPDATE", "sellers", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message, "update");
    }
    await recordAuditTrail("UPDATE", "sellers", seller, req, 'SUCCESS', 'Update Seller success');
    return buildResponse.updateOk(res, seller, 1);
  } catch (error) {
    console.error('Controller Update Error:', error);
    await recordAuditTrail("UPDATE", "sellers", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const remove = async (req, res) => {
  try {
    const { seller, error } = await sellerService.deleted(req.params.oid);

    if (error) {
      await recordAuditTrail("DELETE", "sellers", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message || error, "delete");
    }
    await recordAuditTrail("DELETE", "sellers", seller, req, 'SUCCESS', 'Delete Seller success');
    return buildResponse.sendDeleteOk(res, seller);
  } catch (error) {
    await recordAuditTrail("DELETE", "sellers", error, req, 'ERROR', error.message);
    console.error('Controller Delete Error:', error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { sellers, error } = await sellerService.findAll();

    if (error) {
      await recordAuditTrail("READ", "sellers", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message, "get all");
    }
    await recordAuditTrail("READ", "sellers", sellers, req, 'SUCCESS', 'Get all Sellers success');
    return buildResponse.findOk(res, sellers, sellers.length);
  } catch (error) {
    await recordAuditTrail("READ", "sellers", error, req, 'ERROR', error.message);
    console.error('Controller Find All Error:', error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['sellerCode', 'sellerName', 'search']);

    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await sellerService.findPage(filters, options);

    if (result.error) {
      await recordAuditTrail("READ", "sellers", result.error, req, 'FAILED', result.error.message);
      return buildResponse.sendInternalServerError(res, result.error.message);
    }
    await recordAuditTrail("READ", "sellers", result.sellers, req, 'SUCCESS', 'Get Sellers with filters success');
    return buildResponse.sendPagination(res, result.sellers, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    console.error('Controller error:', error);
    await recordAuditTrail("READ", "sellers", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const options = {
      include: [], // bisa ditambahkan jika ada relasi
    };

    const { seller, error } = await sellerService.findById(req.params.oid, options);

    if (error) {
      await recordAuditTrail("READ", "sellers", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message, "get by id");
    }

    if (!seller) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "sellers", seller, req, 'SUCCESS', 'Get Seller by ID success');
    return buildResponse.findOk(res, seller);
  } catch (error) {
    await recordAuditTrail("READ", "sellers", error, req, 'ERROR', error.message);
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
