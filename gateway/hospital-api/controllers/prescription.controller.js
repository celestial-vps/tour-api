const prescriptionService = require('../services/prescription.service');
const buildResponse = require('../common/build.response');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

/**
 * Create Prescription
 */
const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { prescription, err } = await prescriptionService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "prescriptions", err, req, "FAILED", err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }

    await recordAuditTrail(
      "CREATE",
      "prescriptions",
      prescription,
      req,
      "SUCCESS",
      "Create Prescription success"
    );

    return buildResponse.createOk(res, prescription, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "prescriptions", err, req, "ERROR", err.message);
    console.error("Prescription Create Error:", err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Update Prescription
 */
const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { prescription, err } = await prescriptionService.update(
      req.params.oid,
      req.body,
      userJwt.userOid
    );

    if (err) {
      await recordAuditTrail("UPDATE", "prescriptions", err, req, "FAILED", err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }

    await recordAuditTrail(
      "UPDATE",
      "prescriptions",
      prescription,
      req,
      "SUCCESS",
      "Update Prescription success"
    );

    return buildResponse.updateOk(res, prescription, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "prescriptions", err, req, "ERROR", err.message);
    console.error("Prescription Update Error:", err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Delete Prescription
 */
const remove = async (req, res) => {
  try {
    const { prescription, err } = await prescriptionService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "prescriptions", err, req, "FAILED", err.message);
      return buildResponse.sendQueryError(res, err.message, "delete");
    }

    await recordAuditTrail(
      "DELETE",
      "prescriptions",
      prescription,
      req,
      "SUCCESS",
      "Delete Prescription success"
    );

    return buildResponse.sendDeleteOk(res, prescription);
  } catch (err) {
    await recordAuditTrail("DELETE", "prescriptions", err, req, "ERROR", err.message);
    console.error("Prescription Delete Error:", err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Get All Prescriptions
 */
const findAll = async (req, res) => {
  try {
    const { prescriptions, err } = await prescriptionService.findAll();

    if (err) {
      await recordAuditTrail("READ", "prescriptions", err, req, "FAILED", err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }

    await recordAuditTrail(
      "READ",
      "prescriptions",
      prescriptions,
      req,
      "SUCCESS",
      "Get all Prescriptions success"
    );

    return buildResponse.findOk(res, prescriptions, prescriptions.length);
  } catch (err) {
    await recordAuditTrail("READ", "prescriptions", err, req, "ERROR", err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Paginate / Search Prescriptions
 */
const find = async (req, res) => {
  try {
    const filters = pick(req.body, ["patientOid", "doctorOid", "medicineOid", "search"]);

    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: Number(req.query.pageIndex),
      pageSize: Number(req.query.pageSize),
    };

    const result = await prescriptionService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "prescriptions", result.err, req, "FAILED", result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }

    await recordAuditTrail(
      "READ",
      "prescriptions",
      result.prescriptions,
      req,
      "SUCCESS",
      "Search Prescriptions success"
    );

    return buildResponse.sendPagination(
      res,
      result.prescriptions,
      result.count,
      options.pageIndex,
      options.pageSize
    );
  } catch (error) {
    await recordAuditTrail("READ", "prescriptions", error, req, "ERROR", error.message);
    console.error("Prescription Pagination Error:", error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

/**
 * Get Prescription by ID
 */
const findById = async (req, res) => {
  try {
    const { prescription, err } = await prescriptionService.findById(req.params.oid);

    if (err) {
      await recordAuditTrail("READ", "prescriptions", err, req, "FAILED", err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!prescription) return buildResponse.sendDataNotFound(res);

    await recordAuditTrail(
      "READ",
      "prescriptions",
      prescription,
      req,
      "SUCCESS",
      "Get Prescription by ID success"
    );

    return buildResponse.findOk(res, prescription);
  } catch (err) {
    await recordAuditTrail("READ", "prescriptions", err, req, "ERROR", err.message);
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
