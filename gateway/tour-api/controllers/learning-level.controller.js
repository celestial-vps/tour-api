'use strict';

const learningLevelService = require('../services/learning-level.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

const jwtMaker = new JwtMaker();

const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { learningLevel, err } = await learningLevelService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "learning_level", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }
    await recordAuditTrail("CREATE", "learning_level", learningLevel, req, 'SUCCESS', 'Create Learning Level success');
    return buildResponse.createOk(res, learningLevel, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "learning_level", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { learningLevel, err } = await learningLevelService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "learning_level", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }
    await recordAuditTrail("UPDATE", "learning_level", learningLevel, req, 'SUCCESS', 'Update Learning Level success');
    return buildResponse.updateOk(res, learningLevel, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "learning_level", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { learningLevel, err } = await learningLevelService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "learning_level", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }
    await recordAuditTrail("DELETE", "learning_level", learningLevel, req, 'SUCCESS', 'Delete Learning Level success');
    return buildResponse.sendDeleteOk(res, learningLevel);
  } catch (err) {
    await recordAuditTrail("DELETE", "learning_level", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { learningLevels, err } = await learningLevelService.findAll();

    if (err) {
      await recordAuditTrail("READ", "learning_level", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }
    await recordAuditTrail("READ", "learning_level", learningLevels, req, 'SUCCESS', 'Get all Learning Levels success');
    return buildResponse.findOk(res, learningLevels, learningLevels.length);
  } catch (err) {
    await recordAuditTrail("READ", "learning_level", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['levelName', 'type', 'search']);
    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await learningLevelService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "learning_level", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }
    await recordAuditTrail("READ", "learning_level", result.learningLevels, req, 'SUCCESS', 'Get Learning Levels with filters success');
    return buildResponse.sendPagination(res, result.learningLevels, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    await recordAuditTrail("READ", "learning_level", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const { learningLevel, err } = await learningLevelService.findById(req.params.oid, { include: [] });

    if (err) {
      await recordAuditTrail("READ", "learning_level", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!learningLevel) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "learning_level", learningLevel, req, 'SUCCESS', 'Get Learning Level by ID success');
    return buildResponse.findOk(res, learningLevel);
  } catch (err) {
    await recordAuditTrail("READ", "learning_level", err, req, 'ERROR', err.message);
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
