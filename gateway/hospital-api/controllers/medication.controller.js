const medicationService = require('../services/medication.service');
const buildResponse = require('../common/build.response');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

/**
 * Create Medication
 */
const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { medication, err } = await medicationService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "medications", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }

    await recordAuditTrail("CREATE", "medications", medication, req, 'SUCCESS', 'Create Medication success');
    return buildResponse.createOk(res, medication, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "medications", err, req, 'ERROR', err.message);
    console.error('Medication Controller Create Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Update Medication
 */
const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { medication, err } = await medicationService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "medications", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }

    await recordAuditTrail("UPDATE", "medications", medication, req, 'SUCCESS', 'Update Medication success');
    return buildResponse.updateOk(res, medication, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "medications", err, req, 'ERROR', err.message);
    console.error('Medication Controller Update Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Delete Medication
 */
const remove = async (req, res) => {
  try {
    const { medication, err } = await medicationService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "medications", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "delete");
    }

    await recordAuditTrail("DELETE", "medications", medication, req, 'SUCCESS', 'Delete Medication success');
    return buildResponse.sendDeleteOk(res, medication);
  } catch (err) {
    await recordAuditTrail("DELETE", "medications", err, req, 'ERROR', err.message);
    console.error('Medication Controller Delete Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Get All Medications
 */
const findAll = async (req, res) => {
  try {
    const { medications, err } = await medicationService.findAll();

    if (err) {
      await recordAuditTrail("READ", "medications", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }

    await recordAuditTrail("READ", "medications", medications, req, 'SUCCESS', 'Get all Medications success');
    return buildResponse.findOk(res, medications, medications.length);
  } catch (err) {
    await recordAuditTrail("READ", "medications", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Paginated Medication Search
 */
const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['name', 'categoryOid', 'search']);

    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: Number(req.query.pageIndex),
      pageSize: Number(req.query.pageSize),
    };

    const result = await medicationService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "medications", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }

    await recordAuditTrail("READ", "medications", result.medications, req, 'SUCCESS', 'Search Medications success');

    return buildResponse.sendPagination(
      res,
      result.medications,
      result.count,
      options.pageIndex,
      options.pageSize
    );
  } catch (error) {
    await recordAuditTrail("READ", "medications", error, req, 'ERROR', error.message);
    console.error('Medication Pagination Error:', error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

/**
 * Get Medication By ID
 */
const findById = async (req, res) => {
  try {
    const { medication, err } = await medicationService.findById(req.params.oid);

    if (err) {
      await recordAuditTrail("READ", "medications", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!medication) return buildResponse.sendDataNotFound(res);

    await recordAuditTrail("READ", "medications", medication, req, 'SUCCESS', 'Get Medication by ID success');
    return buildResponse.findOk(res, medication);
  } catch (err) {
    await recordAuditTrail("READ", "medications", err, req, 'ERROR', err.message);
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
