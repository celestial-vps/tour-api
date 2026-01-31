'use strict';

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
      await recordAuditTrail("CREATE", "user_role", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }
    await recordAuditTrail("CREATE", "user_role", userRole, req, 'SUCCESS', 'Create User Role success');
    return buildResponse.createOk(res, userRole, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "user_role", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { userRole, err } = await userRoleService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "user_role", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }
    await recordAuditTrail("UPDATE", "user_role", userRole, req, 'SUCCESS', 'Update User Role success');
    return buildResponse.updateOk(res, userRole, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "user_role", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { userRole, err } = await userRoleService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "user_role", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }
    await recordAuditTrail("DELETE", "user_role", userRole, req, 'SUCCESS', 'Delete User Role success');
    return buildResponse.sendDeleteOk(res, userRole);
  } catch (err) {
    await recordAuditTrail("DELETE", "user_role", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { userRoles, err } = await userRoleService.findAll();

    if (err) {
      await recordAuditTrail("READ", "user_role", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }
    await recordAuditTrail("READ", "user_role", userRoles, req, 'SUCCESS', 'Get all User Roles success');
    return buildResponse.findOk(res, userRoles, userRoles.length);
  } catch (err) {
    await recordAuditTrail("READ", "user_role", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['roleName', 'targetType', 'search']);
    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await userRoleService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "user_role", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }
    await recordAuditTrail("READ", "user_role", result.userRoles, req, 'SUCCESS', 'Get User Roles with filters success');
    return buildResponse.sendPagination(res, result.userRoles, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    await recordAuditTrail("READ", "user_role", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const { userRole, err } = await userRoleService.findById(req.params.oid, { include: [] });

    if (err) {
      await recordAuditTrail("READ", "user_role", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!userRole) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "user_role", userRole, req, 'SUCCESS', 'Get User Role by ID success');
    return buildResponse.findOk(res, userRole);
  } catch (err) {
    await recordAuditTrail("READ", "user_role", err, req, 'ERROR', err.message);
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
