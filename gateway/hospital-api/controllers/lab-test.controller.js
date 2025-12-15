const labTestService = require('../services/lab-test.service');
const buildResponse = require('../common/build.response');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

/**
 * Create Lab Test
 */
const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { labTest, err } = await labTestService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "lab_tests", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }

    await recordAuditTrail("CREATE", "lab_tests", labTest, req, 'SUCCESS', 'Create Lab Test success');
    return buildResponse.createOk(res, labTest, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "lab_tests", err, req, 'ERROR', err.message);
    console.error('Lab Test Controller Create Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Update Lab Test
 */
const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { labTest, err } = await labTestService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "lab_tests", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }

    await recordAuditTrail("UPDATE", "lab_tests", labTest, req, 'SUCCESS', 'Update Lab Test success');
    return buildResponse.updateOk(res, labTest, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "lab_tests", err, req, 'ERROR', err.message);
    console.error('Lab Test Controller Update Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Delete Lab Test
 */
const remove = async (req, res) => {
  try {
    const { labTest, err } = await labTestService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "lab_tests", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "delete");
    }

    await recordAuditTrail("DELETE", "lab_tests", labTest, req, 'SUCCESS', 'Delete Lab Test success');
    return buildResponse.sendDeleteOk(res, labTest);
  } catch (err) {
    await recordAuditTrail("DELETE", "lab_tests", err, req, 'ERROR', err.message);
    console.error('Lab Test Controller Delete Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Get All Lab Tests
 */
const findAll = async (req, res) => {
  try {
    const { labTests, err } = await labTestService.findAll();

    if (err) {
      await recordAuditTrail("READ", "lab_tests", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, 'get all');
    }

    await recordAuditTrail("READ", "lab_tests", labTests, req, 'SUCCESS', 'Get All Lab Tests success');
    return buildResponse.findOk(res, labTests, labTests.length);
  } catch (err) {
    await recordAuditTrail("READ", "lab_tests", err, req, 'ERROR', err.message);
    console.error('Lab Test Controller FindAll Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Paginated Lab Test Search
 */
const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['name', 'description', 'search']);

    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: Number(req.query.pageIndex),
      pageSize: Number(req.query.pageSize),
    };

    const result = await labTestService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "lab_tests", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }

    await recordAuditTrail("READ", "lab_tests", result.labTests, req, 'SUCCESS', 'Search Lab Tests success');

    return buildResponse.sendPagination(
      res,
      result.labTests,
      result.count,
      options.pageIndex,
      options.pageSize
    );

  } catch (error) {
    await recordAuditTrail("READ", "lab_tests", error, req, 'ERROR', error.message);
    console.error('Lab Test Pagination Error:', error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

/**
 * Get Lab Test By ID
 */
const findById = async (req, res) => {
  try {
    const { labTest, err } = await labTestService.findById(req.params.oid);

    if (err) {
      await recordAuditTrail("READ", "lab_tests", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, 'get by id');
    }

    if (!labTest) return buildResponse.sendDataNotFound(res);

    await recordAuditTrail("READ", "lab_tests", labTest, req, 'SUCCESS', 'Get Lab Test by ID success');
    return buildResponse.findOk(res, labTest);
  } catch (err) {
    await recordAuditTrail("READ", "lab_tests", err, req, 'ERROR', err.message);
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
