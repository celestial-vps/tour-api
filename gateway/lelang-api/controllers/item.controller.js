const itemService = require('../services/item.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');


const jwtMaker = new JwtMaker();

const create = async (req, res) => { 
  try {
    const userJwt = req.authorization_payload;
    const { item, error } = await itemService.create(req.body, userJwt.userOid);

    if (error) {
      await recordAuditTrail("CREATE", "items", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message, "insert");
    }
    await recordAuditTrail("CREATE", "items", item, req, 'SUCCESS', 'Create Items success');
    return buildResponse.createOk(res, item, 1);

  } catch (error) {
    await recordAuditTrail("CREATE", "items", error, req, 'ERROR', error.message);
    console.error('Controller Create Error:', error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { item, error } = await itemService.update(req.params.oid, req.body, userJwt.userOid);

    if (error) {
      await recordAuditTrail("UPDATE", "items", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message, "update");
    }
    await recordAuditTrail("UPDATE", "items", item, req, 'SUCCESS', 'Update Items success');
    return buildResponse.updateOk(res, item, 1);
  } catch (error) {
    console.error('Controller Update Error:', error);
    await recordAuditTrail("UPDATE", "items", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const remove = async (req, res) => {
  try {
    const { item, error } = await itemService.deleted(req.params.oid);

    if (error) {
      await recordAuditTrail("DELETE", "items", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message || error, "delete");
    }
    await recordAuditTrail("DELETE", "items", item, req, 'SUCCESS', 'Delete Items success');
    return buildResponse.sendDeleteOk(res, item);
  } catch (error) {
    await recordAuditTrail("DELETE", "items", error, req, 'ERROR', error.message);
    console.error('Controller Delete Error:', error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { items, error } = await itemService.findAll();

    if (error) {
      await recordAuditTrail("READ", "items", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message, "get all");
    }
    await recordAuditTrail("READ", "items", items, req, 'SUCCESS', 'Get all Itemss success');
    return buildResponse.findOk(res, items, items.length);
  } catch (error) {
    await recordAuditTrail("READ", "items", error, req, 'ERROR', error.message);
    console.error('Controller Find All Error:', error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['itemName',   'search']);

    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await itemService.findPage(filters, options);

    if (result.error) {
      await recordAuditTrail("READ", "items", result.error, req, 'FAILED', result.error.message);
      return buildResponse.sendInternalServerError(res, result.error.message);
    }
    await recordAuditTrail("READ", "items", result.items, req, 'SUCCESS', 'Get Itemss with filters success');
    return buildResponse.sendPagination(res, result.items, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    console.error('Controller error:', error);
    await recordAuditTrail("READ", "items", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const options = {
      include: [], // bisa ditambahkan jika ada relasi
    };

    const { item, error } = await itemService.findById(req.params.oid, options);

    if (error) {
      await recordAuditTrail("READ", "items", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message, "get by id");
    }

    if (!item) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "items", item, req, 'SUCCESS', 'Get Items by ID success');
    return buildResponse.findOk(res, item);
  } catch (error) {
    await recordAuditTrail("READ", "items", error, req, 'ERROR', error.message);
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
