const billingService = require('../services/billing.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

const jwtMaker = new JwtMaker();

const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { billing, err } = await billingService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "billings", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }

    await recordAuditTrail("CREATE", "billings", billing, req, 'SUCCESS', 'Create Billing success');
    return buildResponse.createOk(res, billing, 1);

  } catch (err) {
    await recordAuditTrail("CREATE", "billings", err, req, 'ERROR', err.message);
    console.error("Controller Create Billing Error:", err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { billing, err } = await billingService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "billings", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }

    await recordAuditTrail("UPDATE", "billings", billing, req, 'SUCCESS', 'Update Billing success');
    return buildResponse.updateOk(res, billing, 1);

  } catch (err) {
    await recordAuditTrail("UPDATE", "billings", err, req, 'ERROR', err.message);
    console.error("Controller Update Billing Error:", err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { billing, err } = await billingService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "billings", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "delete");
    }

    await recordAuditTrail("DELETE", "billings", billing, req, 'SUCCESS', 'Delete Billing success');
    return buildResponse.sendDeleteOk(res, billing);

  } catch (err) {
    await recordAuditTrail("DELETE", "billings", err, req, 'ERROR', err.message);
    console.error("Controller Delete Billing Error:", err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { billings, err } = await billingService.findAll();

    if (err) {
      await recordAuditTrail("READ", "billings", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }

    await recordAuditTrail("READ", "billings", billings, req, 'SUCCESS', 'Get all Billings success');
    return buildResponse.findOk(res, billings, billings.length);

  } catch (err) {
    await recordAuditTrail("READ", "billings", err, req, 'ERROR', err.message);
    console.error("Controller Get All Billing Error:", err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['patientOid', 'status', 'search']);

    const options = {
      sortBy: req.query.sortBy || 'createdAt',
      sortOrder: req.query.sortOrder || 'desc',
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await billingService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "billings", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }

    await recordAuditTrail("READ", "billings", result.billings, req, 'SUCCESS', 'Get Billings with filters success');

    return buildResponse.sendPagination(
      res,
      result.billings,
      result.count,
      options.pageIndex,
      options.pageSize
    );

  } catch (error) {
    await recordAuditTrail("READ", "billings", error, req, 'ERROR', error.message);
    console.error("Controller Find Billing Error:", error);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const { billing, err } = await billingService.findById(req.params.oid);

    if (err) {
      await recordAuditTrail("READ", "billings", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!billing) return buildResponse.sendDataNotFound(res);

    await recordAuditTrail("READ", "billings", billing, req, 'SUCCESS', 'Get Billing by ID success');
    return buildResponse.findOk(res, billing);

  } catch (err) {
    await recordAuditTrail("READ", "billings", err, req, 'ERROR', err.message);
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
