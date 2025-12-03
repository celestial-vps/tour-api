const pltService = require('../services/patient-lab-test.service');
const buildResponse = require('../common/build.response');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

/**
 * Create Patient Lab Test
 */
const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { labTest, err } = await pltService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "patient_lab_tests", err, req, "FAILED", err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }

    await recordAuditTrail(
      "CREATE",
      "patient_lab_tests",
      labTest,
      req,
      "SUCCESS",
      "Create Patient Lab Test success"
    );

    return buildResponse.createOk(res, labTest, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "patient_lab_tests", err, req, "ERROR", err.message);
    console.error("Patient Lab Test Create Error:", err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Update Patient Lab Test
 */
const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { labTest, err } = await pltService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "patient_lab_tests", err, req, "FAILED", err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }

    await recordAuditTrail(
      "UPDATE",
      "patient_lab_tests",
      labTest,
      req,
      "SUCCESS",
      "Update Patient Lab Test success"
    );

    return buildResponse.updateOk(res, labTest, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "patient_lab_tests", err, req, "ERROR", err.message);
    console.error("Patient Lab Test Update Error:", err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Delete Patient Lab Test
 */
const remove = async (req, res) => {
  try {
    const { labTest, err } = await pltService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "patient_lab_tests", err, req, "FAILED", err.message);
      return buildResponse.sendQueryError(res, err.message, "delete");
    }

    await recordAuditTrail(
      "DELETE",
      "patient_lab_tests",
      labTest,
      req,
      "SUCCESS",
      "Delete Patient Lab Test success"
    );

    return buildResponse.sendDeleteOk(res, labTest);
  } catch (err) {
    await recordAuditTrail("DELETE", "patient_lab_tests", err, req, "ERROR", err.message);
    console.error("Patient Lab Test Delete Error:", err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Get All Lab Tests
 */
const findAll = async (req, res) => {
  try {
    const { labTests, err } = await pltService.findAll();

    if (err) {
      await recordAuditTrail("READ", "patient_lab_tests", err, req, "FAILED", err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }

    await recordAuditTrail(
      "READ",
      "patient_lab_tests",
      labTests,
      req,
      "SUCCESS",
      "Get All Patient Lab Tests success"
    );

    return buildResponse.findOk(res, labTests, labTests.length);
  } catch (err) {
    await recordAuditTrail("READ", "patient_lab_tests", err, req, "ERROR", err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Pagination / Search Patient Lab Tests
 */
const find = async (req, res) => {
  try {
    const filters = pick(req.body, ["patientOid", "labTestOid", "result", "search"]);

    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: Number(req.query.pageIndex),
      pageSize: Number(req.query.pageSize),
    };

    const result = await pltService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "patient_lab_tests", result.err, req, "FAILED", result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }

    await recordAuditTrail(
      "READ",
      "patient_lab_tests",
      result.records,
      req,
      "SUCCESS",
      "Search Patient Lab Tests success"
    );

    return buildResponse.sendPagination(
      res,
      result.records,
      result.count,
      options.pageIndex,
      options.pageSize
    );
  } catch (error) {
    await recordAuditTrail("READ", "patient_lab_tests", error, req, "ERROR", error.message);
    console.error("Patient Lab Test Pagination Error:", error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

/**
 * Get Patient Lab Test by ID
 */
const findById = async (req, res) => {
  try {
    const { labTest, err } = await pltService.findById(req.params.oid);

    if (err) {
      await recordAuditTrail("READ", "patient_lab_tests", err, req, "FAILED", err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!labTest) return buildResponse.sendDataNotFound(res);

    await recordAuditTrail(
      "READ",
      "patient_lab_tests",
      labTest,
      req,
      "SUCCESS",
      "Get Patient Lab Test by ID success"
    );

    return buildResponse.findOk(res, labTest);
  } catch (err) {
    await recordAuditTrail("READ", "patient_lab_tests", err, req, "ERROR", err.message);
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
