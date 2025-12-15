const medicationCategoryService = require('../services/medication-category.service');
const buildResponse = require('../common/build.response');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

/**
 * Create Medical Category
 */
const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { category, err } = await medicationCategoryService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "medication_categories", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }

    await recordAuditTrail("CREATE", "medication_categories", category, req, 'SUCCESS', 'Create Medical Category success');
    return buildResponse.createOk(res, category, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "medication_categories", err, req, 'ERROR', err.message);
    console.error('Medical Category Controller Create Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Update Medical Category
 */
const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { category, err } = await medicationCategoryService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "medication_categories", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }

    await recordAuditTrail("UPDATE", "medication_categories", category, req, 'SUCCESS', 'Update Medical Category success');
    return buildResponse.updateOk(res, category, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "medication_categories", err, req, 'ERROR', err.message);
    console.error('Medical Category Controller Update Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Delete Medical Category
 */
const remove = async (req, res) => {
  try {
    const { category, err } = await medicationCategoryService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "medication_categories", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "delete");
    }

    await recordAuditTrail("DELETE", "medication_categories", category, req, 'SUCCESS', 'Delete Medical Category success');
    return buildResponse.sendDeleteOk(res, category);
  } catch (err) {
    await recordAuditTrail("DELETE", "medication_categories", err, req, 'ERROR', err.message);
    console.error('Medical Category Controller Delete Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Get All Categories
 */
const findAll = async (req, res) => {
  try {
    const { categories, err } = await medicationCategoryService.findAll();

    if (err) {
      await recordAuditTrail("READ", "medication_categories", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, 'get all');
    }

    await recordAuditTrail("READ", "medication_categories", categories, req, 'SUCCESS', 'Get all Medical Categories success');
    return buildResponse.findOk(res, categories, categories.length);
  } catch (err) {
    await recordAuditTrail("READ", "medication_categories", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Paginated Search
 */
const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['name', 'search']);

    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: Number(req.query.pageIndex),
      pageSize: Number(req.query.pageSize),
    };

    const result = await medicationCategoryService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "medication_categories", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }

    await recordAuditTrail("READ", "medication_categories", result.categories, req, 'SUCCESS', 'Search Medical Categories success');

    return buildResponse.sendPagination(
      res,
      result.categories,
      result.count,
      options.pageIndex,
      options.pageSize
    );

  } catch (error) {
    await recordAuditTrail("READ", "medication_categories", error, req, 'ERROR', error.message);
    console.error('Medical Category Pagination Error:', error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

/**
 * Get Medical Category By ID
 */
const findById = async (req, res) => {
  try {
    const { category, err } = await medicationCategoryService.findById(req.params.oid);

    if (err) {
      await recordAuditTrail("READ", "medication_categories", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, 'get by id');
    }

    if (!category) return buildResponse.sendDataNotFound(res);

    await recordAuditTrail("READ", "medication_categories", category, req, 'SUCCESS', 'Get Medical Category by ID success');
    return buildResponse.findOk(res, category);
  } catch (err) {
    await recordAuditTrail("READ", "medication_categories", err, req, 'ERROR', err.message);
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
