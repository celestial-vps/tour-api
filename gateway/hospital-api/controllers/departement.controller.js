const departmentService = require('../services/department.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

const jwtMaker = new JwtMaker();

/**
 * Create Department
 */
const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { department, err } = await departmentService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "departments", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }

    await recordAuditTrail("CREATE", "departments", department, req, 'SUCCESS', 'Create Department success');
    return buildResponse.createOk(res, department, 1);

  } catch (err) {
    await recordAuditTrail("CREATE", "departments", err, req, 'ERROR', err.message);
    console.error("Controller Create Department Error:", err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Update Department
 */
const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { department, err } = await departmentService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "departments", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }

    await recordAuditTrail("UPDATE", "departments", department, req, 'SUCCESS', 'Update Department success');
    return buildResponse.updateOk(res, department, 1);

  } catch (err) {
    await recordAuditTrail("UPDATE", "departments", err, req, 'ERROR', err.message);
    console.error("Controller Update Department Error:", err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Delete Department
 */
const remove = async (req, res) => {
  try {
    const { department, err } = await departmentService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "departments", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "delete");
    }

    await recordAuditTrail("DELETE", "departments", department, req, 'SUCCESS', 'Delete Department success');
    return buildResponse.sendDeleteOk(res, department);

  } catch (err) {
    await recordAuditTrail("DELETE", "departments", err, req, 'ERROR', err.message);
    console.error("Controller Delete Department Error:", err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Find All Departments
 */
const findAll = async (req, res) => {
  try {
    const { departments, err } = await departmentService.findAll();

    if (err) {
      await recordAuditTrail("READ", "departments", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }

    await recordAuditTrail("READ", "departments", departments, req, 'SUCCESS', 'Get all Departments success');
    return buildResponse.findOk(res, departments, departments.length);

  } catch (err) {
    await recordAuditTrail("READ", "departments", err, req, 'ERROR', err.message);
    console.error("Controller Find All Department Error:", err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Paginated Search
 */
const find = async (req, res) => {
    console.log('--- Incoming request ---');
    console.log('req.query =', req.query);
    console.log('req.body  =', req.body);
    
  try {
    const filters = pick(req.body, ['name', 'search']);

    const options = {
      sortBy: req.query.sortBy || 'name',
      sortOrder: req.query.sortOrder || 'asc',
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await departmentService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "departments", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }

    await recordAuditTrail("READ", "departments", result.departments, req, 'SUCCESS', 'Get Departments with filters success');

    return buildResponse.sendPagination(
      res,
      result.departments,
      result.count,
      options.pageIndex,
      options.pageSize
    );

  } catch (error) {
    await recordAuditTrail("READ", "departments", error, req, 'ERROR', error.message);
    console.error("Controller Search Department Error:", error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

/**
 * Find by ID
 */
const findById = async (req, res) => {
  try {
    const { department, err } = await departmentService.findById(req.params.oid);

    if (err) {
      await recordAuditTrail("READ", "departments", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!department) return buildResponse.sendDataNotFound(res);

    await recordAuditTrail("READ", "departments", department, req, 'SUCCESS', 'Get Department by ID success');
    return buildResponse.findOk(res, department);

  } catch (err) {
    await recordAuditTrail("READ", "departments", err, req, 'ERROR', err.message);
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
