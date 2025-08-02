const itemService = require('../services/item.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');


const jwtMaker = new JwtMaker();

const create = async (req, res) => { 
  try {
    const userJwt = req.authorization_payload;
    const { item, err } = await itemService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "items", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }
    await recordAuditTrail("CREATE", "items", item, req, 'SUCCESS', 'Create Items success');
    return buildResponse.createOk(res, item, 1);

  } catch (err) {
    await recordAuditTrail("CREATE", "items", err, req, 'ERROR', err.message);
    console.error('Controller Create Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { item, err } = await itemService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "items", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }
    await recordAuditTrail("UPDATE", "items", item, req, 'SUCCESS', 'Update Items success');
    return buildResponse.updateOk(res, item, 1);
  } catch (err) {
    console.error('Controller Update Error:', err);
    await recordAuditTrail("UPDATE", "items", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { item, err } = await itemService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "items", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }
    await recordAuditTrail("DELETE", "items", item, req, 'SUCCESS', 'Delete Items success');
    return buildResponse.sendDeleteOk(res, item);
  } catch (err) {
    await recordAuditTrail("DELETE", "items", err, req, 'ERROR', err.message);
    console.error('Controller Delete Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { items, err } = await itemService.findAll();

    if (err) {
      await recordAuditTrail("READ", "items", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }
    await recordAuditTrail("READ", "items", items, req, 'SUCCESS', 'Get all Itemss success');
    return buildResponse.findOk(res, items, items.length);
  } catch (err) {
    await recordAuditTrail("READ", "items", err, req, 'ERROR', err.message);
    console.error('Controller Find All Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['title', 'description', 'search']);

    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await itemService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "items", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
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

    const { item, err } = await itemService.findById(req.params.oid, options);

    if (err) {
      await recordAuditTrail("READ", "items", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!item) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "items", item, req, 'SUCCESS', 'Get Items by ID success');
    return buildResponse.findOk(res, item);
  } catch (err) {
    await recordAuditTrail("READ", "items", err, req, 'ERROR', err.message);
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
