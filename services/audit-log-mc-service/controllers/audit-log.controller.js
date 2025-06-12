const auditLogService = require('../services/audit-log.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');

const jwtMaker = new JwtMaker();

const create = async (req, res) => {
  try {
    // const userJwt = req.authorization_payload;
     console.log('📥 Received audit log request:', req.body);

    const { auditLog, err } = await auditLogService.create(req.body );

    if (err) {
      return buildResponse.sendQueryError(res, err.message, "insert");
    }

    return buildResponse.createOk(res, auditLog, 1);
  } catch (err) {
    console.error('Controller Create Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { auditLog, err } = await auditLogService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      return buildResponse.sendQueryError(res, err.message, "update");
    }

    return buildResponse.updateOk(res, auditLog, 1);
  } catch (err) {
    console.error('Controller Update Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { auditLog, err } = await auditLogService.deleted(req.params.oid);

    if (err) {
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }

    return buildResponse.sendDeleteOk(res, auditLog);
  } catch (err) {
    console.error('Controller Delete Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { auditLogs, err } = await auditLogService.findAll();

    if (err) {
      return buildResponse.sendQueryError(res, err.message, "get all");
    }

    return buildResponse.findOk(res, auditLogs, auditLogs.length);
  } catch (err) {
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['tableName']);

    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await auditLogService.findPage(filters, options);

    if (result.err) {
      return buildResponse.sendInternalServerError(res, result.err.message);
    }

    return buildResponse.sendPagination(res, result.auditLogs, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    console.error('Controller error:', error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {

    const { auditLog, err } = await auditLogService.findById(req.params.oid, options);

    if (err) {
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!auditLog) return buildResponse.sendDataNotFound(res);

    return buildResponse.findOk(res, auditLog);
  } catch (err) {
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
