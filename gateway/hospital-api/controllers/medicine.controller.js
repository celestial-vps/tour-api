const medicineService = require('../services/medicine.service');
const buildResponse = require('../common/build.response');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

/**
 * Create Medicine
 */
const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { medicine, err } = await medicineService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "medicines", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }

    await recordAuditTrail("CREATE", "medicines", medicine, req, 'SUCCESS', 'Create Medicine success');
    return buildResponse.createOk(res, medicine, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "medicines", err, req, 'ERROR', err.message);
    console.error('Medicine Controller Create Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Update Medicine
 */
const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { medicine, err } = await medicineService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "medicines", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }

    await recordAuditTrail("UPDATE", "medicines", medicine, req, 'SUCCESS', 'Update Medicine success');
    return buildResponse.updateOk(res, medicine, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "medicines", err, req, 'ERROR', err.message);
    console.error('Medicine Controller Update Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Delete Medicine
 */
const remove = async (req, res) => {
  try {
    const { medicine, err } = await medicineService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "medicines", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "delete");
    }

    await recordAuditTrail("DELETE", "medicines", medicine, req, 'SUCCESS', 'Delete Medicine success');
    return buildResponse.sendDeleteOk(res, medicine);
  } catch (err) {
    await recordAuditTrail("DELETE", "medicines", err, req, 'ERROR', err.message);
    console.error('Medicine Controller Delete Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Get All Medicines
 */
const findAll = async (req, res) => {
  try {
    const { medicines, err } = await medicineService.findAll();

    if (err) {
      await recordAuditTrail("READ", "medicines", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }

    await recordAuditTrail("READ", "medicines", medicines, req, 'SUCCESS', 'Get all Medicines success');
    return buildResponse.findOk(res, medicines, medicines.length);
  } catch (err) {
    await recordAuditTrail("READ", "medicines", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Paginated Medicine Search
 */
const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['medicineCode', 'medicineName', 'categoryOid', 'search']);

    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: Number(req.query.pageIndex),
      pageSize: Number(req.query.pageSize),
    };

    const result = await medicineService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "medicines", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }

    await recordAuditTrail("READ", "medicines", result.medicines, req, 'SUCCESS', 'Search Medicines success');

    return buildResponse.sendPagination(
      res,
      result.medicines,
      result.count,
      options.pageIndex,
      options.pageSize
    );
  } catch (error) {
    await recordAuditTrail("READ", "medicines", error, req, 'ERROR', error.message);
    console.error('Medicine Pagination Error:', error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

/**
 * Get Medicine By ID
 */
const findById = async (req, res) => {
  try {
    const { medicine, err } = await medicineService.findById(req.params.oid);

    if (err) {
      await recordAuditTrail("READ", "medicines", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!medicine) return buildResponse.sendDataNotFound(res);

    await recordAuditTrail("READ", "medicines", medicine, req, 'SUCCESS', 'Get Medicine by ID success');
    return buildResponse.findOk(res, medicine);
  } catch (err) {
    await recordAuditTrail("READ", "medicines", err, req, 'ERROR', err.message);
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
