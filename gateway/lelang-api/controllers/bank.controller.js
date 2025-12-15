const bankService = require('../services/bank.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');


const jwtMaker = new JwtMaker();

const create = async (req, res) => { 
  try {
    const userJwt = req.authorization_payload;
    const { bank, error } = await bankService.create(req.body, userJwt.userOid);

    if (error) {
      await recordAuditTrail("CREATE", "banks", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message, "insert");
    }
    await recordAuditTrail("CREATE", "banks", bank, req, 'SUCCESS', 'Create Bank success');
    return buildResponse.createOk(res, bank, 1);

  } catch (error) {
    await recordAuditTrail("CREATE", "banks", error, req, 'ERROR', error.message);
    console.error('Controller Create Error:', error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { bank, error } = await bankService.update(req.params.oid, req.body, userJwt.userOid);

    if (error) {
      await recordAuditTrail("UPDATE", "banks", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message, "update");
    }
    await recordAuditTrail("UPDATE", "banks", bank, req, 'SUCCESS', 'Update Bank success');
    return buildResponse.updateOk(res, bank, 1);
  } catch (error) {
    console.error('Controller Update Error:', error);
    await recordAuditTrail("UPDATE", "banks", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const remove = async (req, res) => {
  try {
    const { bank, error } = await bankService.deleted(req.params.oid);

    if (error) {
      await recordAuditTrail("DELETE", "banks", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message || error, "delete");
    }
    await recordAuditTrail("DELETE", "banks", bank, req, 'SUCCESS', 'Delete Bank success');
    return buildResponse.sendDeleteOk(res, bank);
  } catch (error) {
    await recordAuditTrail("DELETE", "banks", error, req, 'ERROR', error.message);
    console.error('Controller Delete Error:', error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { banks, error } = await bankService.findAll();

    if (error) {
      await recordAuditTrail("READ", "banks", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message, "get all");
    }
    await recordAuditTrail("READ", "banks", banks, req, 'SUCCESS', 'Get all Banks success');
    return buildResponse.findOk(res, banks, banks.length);
  } catch (error) {
    await recordAuditTrail("READ", "banks", error, req, 'ERROR', error.message);
    console.error('Controller Find All Error:', error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['bankCode', 'bankName', 'search']);

    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await bankService.findPage(filters, options);

    if (result.error) {
      await recordAuditTrail("READ", "banks", result.error, req, 'FAILED', result.error.message);
      return buildResponse.sendInternalServerError(res, result.error.message);
    }
    await recordAuditTrail("READ", "banks", result.banks, req, 'SUCCESS', 'Get Banks with filters success');
    return buildResponse.sendPagination(res, result.banks, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    console.error('Controller error:', error);
    await recordAuditTrail("READ", "banks", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const options = {
      include: [], // bisa ditambahkan jika ada relasi
    };

    const { bank, error } = await bankService.findById(req.params.oid, options);

    if (error) {
      await recordAuditTrail("READ", "banks", error, req, 'FAILED', error.message);
      return buildResponse.sendQueryError(res, error.message, "get by id");
    }

    if (!bank) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "banks", bank, req, 'SUCCESS', 'Get Bank by ID success');
    return buildResponse.findOk(res, bank);
  } catch (error) {
    await recordAuditTrail("READ", "banks", error, req, 'ERROR', error.message);
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
