const userRoleService = require('../services/user-role.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');


const jwtMaker = new JwtMaker();

const create = async (req, res) => { 
  try {
    const userJwt = req.authorization_payload;
    const { userRole, err } = await userRoleService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "userRoles", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }
    await recordAuditTrail("CREATE", "userRoles", userRole, req, 'SUCCESS', 'Create UserRole success');
    return buildResponse.createOk(res, userRole, 1);

  } catch (err) {
    await recordAuditTrail("CREATE", "userRoles", err, req, 'ERROR', err.message);
    console.error('Controller Create Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { userRole, err } = await userRoleService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "userRoles", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }
    await recordAuditTrail("UPDATE", "userRoles", userRole, req, 'SUCCESS', 'Update UserRole success');
    return buildResponse.updateOk(res, userRole, 1);
  } catch (err) {
    console.error('Controller Update Error:', err);
    await recordAuditTrail("UPDATE", "userRoles", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { userRole, err } = await userRoleService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "userRoles", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }
    await recordAuditTrail("DELETE", "userRoles", userRole, req, 'SUCCESS', 'Delete UserRole success');
    return buildResponse.sendDeleteOk(res, userRole);
  } catch (err) {
    await recordAuditTrail("DELETE", "userRoles", err, req, 'ERROR', err.message);
    console.error('Controller Delete Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { userRoles, err } = await userRoleService.findAll();

    if (err) {
      await recordAuditTrail("READ", "userRoles", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }
    await recordAuditTrail("READ", "userRoles", userRoles, req, 'SUCCESS', 'Get all UserRoles success');
    return buildResponse.findOk(res, userRoles, userRoles.length);
  } catch (err) {
    await recordAuditTrail("READ", "userRoles", err, req, 'ERROR', err.message);
    console.error('Controller Find All Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['userRoleCode', 'userRoleName', 'search']);

    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await userRoleService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "userRoles", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }
    await recordAuditTrail("READ", "userRoles", result.userRoles, req, 'SUCCESS', 'Get UserRoles with filters success');
    return buildResponse.sendPagination(res, result.userRoles, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    console.error('Controller error:', error);
    await recordAuditTrail("READ", "userRoles", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const options = {
      include: [], // bisa ditambahkan jika ada relasi
    };

    const { userRole, err } = await userRoleService.findById(req.params.oid, options);

    if (err) {
      await recordAuditTrail("READ", "userRoles", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!userRole) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "userRoles", userRole, req, 'SUCCESS', 'Get UserRole by ID success');
    return buildResponse.findOk(res, userRole);
  } catch (err) {
    await recordAuditTrail("READ", "userRoles", err, req, 'ERROR', err.message);
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
