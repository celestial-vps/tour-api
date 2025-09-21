const bankService = require('../services/bank.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');


const jwtMaker = new JwtMaker();
 

const top5 = async (req, res) => {
  try {
    const { banks, err } = await bankService.findAll();

    if (err) {
      await recordAuditTrail("READ", "banks", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }
    await recordAuditTrail("READ", "banks", banks, req, 'SUCCESS', 'Get all Banks success');
    return buildResponse.findOk(res, banks, banks.length);
  } catch (err) {
    await recordAuditTrail("READ", "banks", err, req, 'ERROR', err.message);
    console.error('Controller Find All Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
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

    if (result.err) {
      await recordAuditTrail("READ", "banks", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
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

    const { bank, err } = await bankService.findById(req.params.oid, options);

    if (err) {
      await recordAuditTrail("READ", "banks", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!bank) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "banks", bank, req, 'SUCCESS', 'Get Bank by ID success');
    return buildResponse.findOk(res, bank);
  } catch (err) {
    await recordAuditTrail("READ", "banks", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

module.exports = {
  remove,
  findAll,
  find,
  findById,
};
