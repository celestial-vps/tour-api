const treatmentService = require('../services/treatment.service');
const buildResponse = require('../common/build.response');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

/**
 * Create Treatment
 */
const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { treatment, err } = await treatmentService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "treatments", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }

    await recordAuditTrail("CREATE", "treatments", treatment, req, 'SUCCESS', 'Create Treatment success');
    return buildResponse.createOk(res, treatment, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "treatments", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Update Treatment
 */
const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { treatment, err } = await treatmentService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "treatments", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }

    await recordAuditTrail("UPDATE", "treatments", treatment, req, 'SUCCESS', 'Update Treatment success');
    return buildResponse.updateOk(res, treatment, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "treatments", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Delete Treatment
 */
const remove = async (req, res) => {
  try {
    const { treatment, err } = await treatmentService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "treatments", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "delete");
    }

    await recordAuditTrail("DELETE", "treatments", treatment, req, 'SUCCESS', 'Delete Treatment success');
    return buildResponse.sendDeleteOk(res, treatment);
  } catch (err) {
    await recordAuditTrail("DELETE", "treatments", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Get All Treatments
 */
const findAll = async (req, res) => {
  try {
    const { treatments, err } = await treatmentService.findAll();

    if (err) {
      await recordAuditTrail("READ", "treatments", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }

    await recordAuditTrail("READ", "treatments", treatments, req, 'SUCCESS', 'Get All Treatments success');
    return buildResponse.findOk(res, treatments, treatments.length);
  } catch (err) {
    await recordAuditTrail("READ", "treatments", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Pagination / Search Treatments
 */
const find = async (req, res) => {
  try {
    const filters = pick(req.body, ["patientOid", "doctorOid", "treatmentType", "description", "search"]);

    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: Number(req.query.pageIndex),
      pageSize: Number(req.query.pageSize)
    };

    const result = await treatmentService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "treatments", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }

    await recordAuditTrail("READ", "treatments", result.treatments, req, 'SUCCESS', 'Get Treatments with filters success');

    return buildResponse.sendPagination(
      res,
      result.treatments,
      result.count,
      options.pageIndex,
      options.pageSize
    );
  } catch (error) {
    await recordAuditTrail("READ", "treatments", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

/**
 * Find Treatment by ID
 */
const findById = async (req, res) => {
  try {
    const { treatment, err } = await treatmentService.findById(req.params.oid);

    if (err) {
      await recordAuditTrail("READ", "treatments", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!treatment) return buildResponse.sendDataNotFound(res);

    await recordAuditTrail("READ", "treatments", treatment, req, 'SUCCESS', 'Get Treatment by ID success');
    return buildResponse.findOk(res, treatment);
  } catch (err) {
    await recordAuditTrail("READ", "treatments", err, req, 'ERROR', err.message);
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
