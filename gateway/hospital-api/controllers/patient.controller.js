const patientService = require('../services/patient.service');
const buildResponse = require('../common/build.response');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

/**
 * Create Patient
 */
const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { patient, err } = await patientService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "patients", err, req, "FAILED", err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }

    await recordAuditTrail("CREATE", "patients", patient, req, "SUCCESS", "Create Patient success");
    return buildResponse.createOk(res, patient, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "patients", err, req, "ERROR", err.message);
    console.error("Patient Controller Create Error:", err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Update Patient
 */
const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { patient, err } = await patientService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "patients", err, req, "FAILED", err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }

    await recordAuditTrail("UPDATE", "patients", patient, req, "SUCCESS", "Update Patient success");
    return buildResponse.updateOk(res, patient, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "patients", err, req, "ERROR", err.message);
    console.error("Patient Controller Update Error:", err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Delete Patient
 */
const remove = async (req, res) => {
  try {
    const { patient, err } = await patientService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "patients", err, req, "FAILED", err.message);
      return buildResponse.sendQueryError(res, err.message, "delete");
    }

    await recordAuditTrail("DELETE", "patients", patient, req, "SUCCESS", "Delete Patient success");
    return buildResponse.sendDeleteOk(res, patient);
  } catch (err) {
    await recordAuditTrail("DELETE", "patients", err, req, "ERROR", err.message);
    console.error("Patient Controller Delete Error:", err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Get All Patients
 */
const findAll = async (req, res) => {
  try {
    const { patients, err } = await patientService.findAll();

    if (err) {
      await recordAuditTrail("READ", "patients", err, req, "FAILED", err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }

    await recordAuditTrail("READ", "patients", patients, req, "SUCCESS", "Get all Patients success");
    return buildResponse.findOk(res, patients, patients.length);
  } catch (err) {
    await recordAuditTrail("READ", "patients", err, req, "ERROR", err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Paginate / Search Patients
 */
const find = async (req, res) => {
  try {
    const filters = pick(req.body, ["fullName", "gender", "phone", "search"]);

    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: Number(req.query.pageIndex),
      pageSize: Number(req.query.pageSize),
    };

    const result = await patientService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "patients", result.err, req, "FAILED", result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }

    await recordAuditTrail("READ", "patients", result.patients, req, "SUCCESS", "Search Patients success");

    return buildResponse.sendPagination(
      res,
      result.patients,
      result.count,
      options.pageIndex,
      options.pageSize
    );
  } catch (error) {
    await recordAuditTrail("READ", "patients", error, req, "ERROR", error.message);
    console.error("Patient Pagination Error:", error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

/**
 * Get Patient by ID
 */
const findById = async (req, res) => {
  try {
    const { patient, err } = await patientService.findById(req.params.oid);

    if (err) {
      await recordAuditTrail("READ", "patients", err, req, "FAILED", err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!patient) return buildResponse.sendDataNotFound(res);

    await recordAuditTrail("READ", "patients", patient, req, "SUCCESS", "Get Patient by ID success");
    return buildResponse.findOk(res, patient);
  } catch (err) {
    await recordAuditTrail("READ", "patients", err, req, "ERROR", err.message);
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
