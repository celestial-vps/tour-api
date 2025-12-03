const specializationService = require('../services/specialization.service');
const buildResponse = require('../common/build.response');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

/**
 * Create Specialization
 */
const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { specialization, err } = await specializationService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "specializations", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }

    await recordAuditTrail("CREATE", "specializations", specialization, req, 'SUCCESS', 'Create Specialization success');
    return buildResponse.createOk(res, specialization, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "specializations", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Update Specialization
 */
const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { specialization, err } = await specializationService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "specializations", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }

    await recordAuditTrail("UPDATE", "specializations", specialization, req, 'SUCCESS', 'Update Specialization success');
    return buildResponse.updateOk(res, specialization, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "specializations", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Delete Specialization
 */
const remove = async (req, res) => {
  try {
    const { specialization, err } = await specializationService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "specializations", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "delete");
    }

    await recordAuditTrail("DELETE", "specializations", specialization, req, 'SUCCESS', 'Delete Specialization success');
    return buildResponse.sendDeleteOk(res, specialization);
  } catch (err) {
    await recordAuditTrail("DELETE", "specializations", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Get All Specializations
 */
const findAll = async (req, res) => {
  try {
    const { specializations, err } = await specializationService.findAll();

    if (err) {
      await recordAuditTrail("READ", "specializations", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }

    await recordAuditTrail("READ", "specializations", specializations, req, 'SUCCESS', 'Get All Specializations success');
    return buildResponse.findOk(res, specializations, specializations.length);
  } catch (err) {
    await recordAuditTrail("READ", "specializations", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Pagination / Search Specializations
 */
const find = async (req, res) => {
  try {
    const filters = pick(req.body, ["name", "description", "search"]);

    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: Number(req.query.pageIndex),
      pageSize: Number(req.query.pageSize)
    };

    const result = await specializationService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "specializations", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }

    await recordAuditTrail("READ", "specializations", result.specializations, req, 'SUCCESS', 'Get Specializations with filters success');

    return buildResponse.sendPagination(
      res,
      result.specializations,
      result.count,
      options.pageIndex,
      options.pageSize
    );
  } catch (error) {
    await recordAuditTrail("READ", "specializations", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

/**
 * Find Specialization by ID
 */
const findById = async (req, res) => {
  try {
    const { specialization, err } = await specializationService.findById(req.params.oid);

    if (err) {
      await recordAuditTrail("READ", "specializations", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!specialization) return buildResponse.sendDataNotFound(res);

    await recordAuditTrail("READ", "specializations", specialization, req, 'SUCCESS', 'Get Specialization by ID success');
    return buildResponse.findOk(res, specialization);
  } catch (err) {
    await recordAuditTrail("READ", "specializations", err, req, 'ERROR', err.message);
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
