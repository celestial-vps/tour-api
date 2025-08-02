const itemCategoryService = require('../services/item-category.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');


const jwtMaker = new JwtMaker();

const create = async (req, res) => { 
  try {
    const userJwt = req.authorization_payload;
    const { itemCategory, err } = await itemCategoryService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "item Categorys", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }
    await recordAuditTrail("CREATE", "item Categorys", itemCategory, req, 'SUCCESS', 'Create Item Categorys success');
    return buildResponse.createOk(res, itemCategory, 1);

  } catch (err) {
    await recordAuditTrail("CREATE", "item Categorys", err, req, 'ERROR', err.message);
    console.error('Controller Create Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { itemCategory, err } = await itemCategoryService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "item Categorys", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }
    await recordAuditTrail("UPDATE", "item Categorys", itemCategory, req, 'SUCCESS', 'Update Item Categorys success');
    return buildResponse.updateOk(res, itemCategory, 1);
  } catch (err) {
    console.error('Controller Update Error:', err);
    await recordAuditTrail("UPDATE", "item Categorys", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { itemCategory, err } = await itemCategoryService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "item Categorys", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }
    await recordAuditTrail("DELETE", "item Categorys", itemCategory, req, 'SUCCESS', 'Delete Item Categorys success');
    return buildResponse.sendDeleteOk(res, itemCategory);
  } catch (err) {
    await recordAuditTrail("DELETE", "item Categorys", err, req, 'ERROR', err.message);
    console.error('Controller Delete Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { itemCategorys, err } = await itemCategoryService.findAll();

    if (err) {
      await recordAuditTrail("READ", "item Categorys", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }
    await recordAuditTrail("READ", "item Categorys", itemCategorys, req, 'SUCCESS', 'Get all Item Categoryss success');
    return buildResponse.findOk(res, itemCategorys, itemCategorys.length);
  } catch (err) {
    await recordAuditTrail("READ", "item Categorys", err, req, 'ERROR', err.message);
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

    const result = await itemCategoryService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "item Categorys", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }
    await recordAuditTrail("READ", "item Categorys", result.itemCategorys, req, 'SUCCESS', 'Get Item Categoryss with filters success');
    return buildResponse.sendPagination(res, result.itemCategorys, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    console.error('Controller error:', error);
    await recordAuditTrail("READ", "item Categorys", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const options = {
      include: [], // bisa ditambahkan jika ada relasi
    };

    const { itemCategory, err } = await itemCategoryService.findById(req.params.oid, options);

    if (err) {
      await recordAuditTrail("READ", "item Categorys", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!itemCategory) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "item Categorys", itemCategory, req, 'SUCCESS', 'Get Item Categorys by ID success');
    return buildResponse.findOk(res, itemCategory);
  } catch (err) {
    await recordAuditTrail("READ", "item Categorys", err, req, 'ERROR', err.message);
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
