const userRoleService = require('../services/user-role.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');


const jwtMaker = new JwtMaker();

const create = async (req, res) => { 
  try {
    const userJwt = req.authorization_payload;
    const { userRole, error } = await userRoleService.create(req.body, userJwt.userOid);

    if (error) {
      await recordAuditTrail("CREATE", "userRoles", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message, "insert");
    }
    await recordAuditTrail("CREATE", "userRoles", userRole, req, 'SUCCESS', 'Create UserRole success');
    return buildResponse.createOk(res, userRole, 1);

  } catch (error) {
    await recordAuditTrail("CREATE", "userRoles", error, req, 'ERROR', error.message);
    console.error('Controller Create Error:', error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { userRole, error } = await userRoleService.update(req.params.oid, req.body, userJwt.userOid);

    if (error) {
      await recordAuditTrail("UPDATE", "userRoles", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message, "update");
    }
    await recordAuditTrail("UPDATE", "userRoles", userRole, req, 'SUCCESS', 'Update UserRole success');
    return buildResponse.updateOk(res, userRole, 1);
  } catch (error) {
    console.error('Controller Update Error:', error);
    await recordAuditTrail("UPDATE", "userRoles", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const remove = async (req, res) => {
  try {
    const { userRole, error } = await userRoleService.deleted(req.params.oid);

    if (error) {
      await recordAuditTrail("DELETE", "userRoles", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message || error, "delete");
    }
    await recordAuditTrail("DELETE", "userRoles", userRole, req, 'SUCCESS', 'Delete UserRole success');
    return buildResponse.sendDeleteOk(res, userRole);
  } catch (error) {
    await recordAuditTrail("DELETE", "userRoles", error, req, 'ERROR', error.message);
    console.error('Controller Delete Error:', error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { userRoles, error } = await userRoleService.findAll();

    if (error) {
      await recordAuditTrail("READ", "userRoles", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message, "get all");
    }
    await recordAuditTrail("READ", "userRoles", userRoles, req, 'SUCCESS', 'Get all UserRoles success');
    return buildResponse.findOk(res, userRoles, userRoles.length);
  } catch (error) {
    await recordAuditTrail("READ", "userRoles", error, req, 'ERROR', error.message);
    console.error('Controller Find All Error:', error);
    return buildResponse.sendInternalServerError(res, error.message);
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

    if (result.error) {
      await recordAuditTrail("READ", "userRoles", result.error, req, 'FAILED', result.error.message);
      return buildResponse.sendInternalServerError(res, result.error.message);
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

    const { userRole, error } = await userRoleService.findById(req.params.oid, options);

    if (error) {
      await recordAuditTrail("READ", "userRoles", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message, "get by id");
    }

    if (!userRole) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "userRoles", userRole, req, 'SUCCESS', 'Get UserRole by ID success');
    return buildResponse.findOk(res, userRole);
  } catch (error) {
    await recordAuditTrail("READ", "userRoles", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
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
