const diseaseService = require('../services/diseases.service');
const buildResponse = require('../common/build.response');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

/**
 * Create Disease
 */
const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { disease, err } = await diseaseService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "diseases", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, 'insert');
    }

    await recordAuditTrail("CREATE", "diseases", disease, req, 'SUCCESS', 'Create Disease success');
    return buildResponse.createOk(res, disease, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "diseases", err, req, 'ERROR', err.message);
    console.error('Disease Controller Create Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Update Disease
 */
const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { disease, err } = await diseaseService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "diseases", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, 'update');
    }

    await recordAuditTrail("UPDATE", "diseases", disease, req, 'SUCCESS', 'Update Disease success');
    return buildResponse.updateOk(res, disease, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "diseases", err, req, 'ERROR', err.message);
    console.error('Disease Controller Update Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Delete Disease
 */
const remove = async (req, res) => {
  try {
    const { disease, err } = await diseaseService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "diseases", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, 'delete');
    }

    await recordAuditTrail("DELETE", "diseases", disease, req, 'SUCCESS', 'Delete Disease success');
    return buildResponse.sendDeleteOk(res, disease);
  } catch (err) {
    await recordAuditTrail("DELETE", "diseases", err, req, 'ERROR', err.message);
    console.error('Disease Controller Delete Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Get All Diseases
 */
const findAll = async (req, res) => {
  try {
    const { diseases, err } = await diseaseService.findAll();

    if (err) {
      await recordAuditTrail("READ", "diseases", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, 'get all');
    }

    await recordAuditTrail("READ", "diseases", diseases, req, 'SUCCESS', 'Get All Diseases success');
    return buildResponse.findOk(res, diseases, diseases.length);
  } catch (err) {
    await recordAuditTrail("READ", "diseases", err, req, 'ERROR', err.message);
    console.error('Disease Controller FindAll Error:', err);
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
      sortBy: req.query.sortBy || 'name',
      sortOrder: req.query.sortOrder || 'asc',
      pageIndex: parseInt(req.query.pageIndex, 10),
      pageSize: parseInt(req.query.pageSize, 10),
    };

    const result = await diseaseService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "diseases", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }

    await recordAuditTrail("READ", "diseases", result.diseases, req, 'SUCCESS', 'Search Diseases success');

    return buildResponse.sendPagination(
      res,
      result.diseases,
      result.count,
      options.pageIndex,
      options.pageSize
    );

  } catch (error) {
    await recordAuditTrail("READ", "diseases", error, req, 'ERROR', error.message);
    console.error('Disease Controller Find Error:', error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

/**
 * Get by ID
 */
const findById = async (req, res) => {
  try {
    const { disease, err } = await diseaseService.findById(req.params.oid);

    if (err) {
      await recordAuditTrail("READ", "diseases", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, 'get by id');
    }

    if (!disease) return buildResponse.sendDataNotFound(res);

    await recordAuditTrail("READ", "diseases", disease, req, 'SUCCESS', 'Get Disease by ID success');
    return buildResponse.findOk(res, disease);

  } catch (err) {
    await recordAuditTrail("READ", "diseases", err, req, 'ERROR', err.message);
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
