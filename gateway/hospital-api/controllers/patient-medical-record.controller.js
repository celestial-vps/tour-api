const pmrService = require('../services/patient-medical-record.service');
const buildResponse = require('../common/build.response');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

/**
 * Create Patient Medical Record
 */
const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { record, err } = await pmrService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "patient_medical_records", err, req, "FAILED", err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }

    await recordAuditTrail(
      "CREATE",
      "patient_medical_records",
      record,
      req,
      "SUCCESS",
      "Create Medical Record success"
    );

    return buildResponse.createOk(res, record, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "patient_medical_records", err, req, "ERROR", err.message);
    console.error("PMR Create Error:", err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Update Medical Record
 */
const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { record, err } = await pmrService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "patient_medical_records", err, req, "FAILED", err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }

    await recordAuditTrail(
      "UPDATE",
      "patient_medical_records",
      record,
      req,
      "SUCCESS",
      "Update Medical Record success"
    );

    return buildResponse.updateOk(res, record, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "patient_medical_records", err, req, "ERROR", err.message);
    console.error("PMR Update Error:", err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Delete Medical Record
 */
const remove = async (req, res) => {
  try {
    const { record, err } = await pmrService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "patient_medical_records", err, req, "FAILED", err.message);
      return buildResponse.sendQueryError(res, err.message, "delete");
    }

    await recordAuditTrail(
      "DELETE",
      "patient_medical_records",
      record,
      req,
      "SUCCESS",
      "Delete Medical Record success"
    );

    return buildResponse.sendDeleteOk(res, record);
  } catch (err) {
    await recordAuditTrail("DELETE", "patient_medical_records", err, req, "ERROR", err.message);
    console.error("PMR Delete Error:", err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Get All Records
 */
const findAll = async (req, res) => {
  try {
    const { records, err } = await pmrService.findAll();

    if (err) {
      await recordAuditTrail("READ", "patient_medical_records", err, req, "FAILED", err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }

    await recordAuditTrail(
      "READ",
      "patient_medical_records",
      records,
      req,
      "SUCCESS",
      "Get All Medical Records success"
    );

    return buildResponse.findOk(res, records, records.length);
  } catch (err) {
    await recordAuditTrail("READ", "patient_medical_records", err, req, "ERROR", err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Pagination / Search Medical Records
 */
const find = async (req, res) => {
  try {
    const filters = pick(req.body, ["patientOid", "doctorOid", "diseaseOid", "search"]);

    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: Number(req.query.pageIndex),
      pageSize: Number(req.query.pageSize),
    };

    const result = await pmrService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "patient_medical_records", result.err, req, "FAILED", result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }

    await recordAuditTrail(
      "READ",
      "patient_medical_records",
      result.records,
      req,
      "SUCCESS",
      "Search Medical Records success"
    );

    return buildResponse.sendPagination(
      res,
      result.records,
      result.count,
      options.pageIndex,
      options.pageSize
    );
  } catch (error) {
    await recordAuditTrail("READ", "patient_medical_records", error, req, "ERROR", error.message);
    console.error("PMR Pagination Error:", error);
    return buildResponse.sendInternalServerServerError(res, error.message);
  }
};

/**
 * Get Medical Record by ID
 */
const findById = async (req, res) => {
  try {
    const { record, err } = await pmrService.findById(req.params.oid);

    if (err) {
      await recordAuditTrail("READ", "patient_medical_records", err, req, "FAILED", err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!record) return buildResponse.sendDataNotFound(res);

    await recordAuditTrail(
      "READ",
      "patient_medical_records",
      record,
      req,
      "SUCCESS",
      "Get Medical Record by ID success"
    );

    return buildResponse.findOk(res, record);
  } catch (err) {
    await recordAuditTrail("READ", "patient_medical_records", err, req, "ERROR", err.message);
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
