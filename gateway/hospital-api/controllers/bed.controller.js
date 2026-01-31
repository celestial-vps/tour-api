const bedService = require('../services/bed.service');
const buildResponse = require('../common/build.response'); 
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');
 

const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { bed, err } = await bedService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "beds", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }

    await recordAuditTrail("CREATE", "beds", bed, req, 'SUCCESS', 'Create Bed success');
    return buildResponse.createOk(res, bed, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "beds", err, req, 'ERROR', err.message);
    console.error('Controller Create Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { bed, err } = await bedService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "beds", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }

    await recordAuditTrail("UPDATE", "beds", bed, req, 'SUCCESS', 'Update Bed success');
    return buildResponse.updateOk(res, bed, 1);
  } catch (err) {
    console.error('Controller Update Error:', err);
    await recordAuditTrail("UPDATE", "beds", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { bed, err } = await bedService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "beds", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }

    await recordAuditTrail("DELETE", "beds", bed, req, 'SUCCESS', 'Delete Bed success');
    return buildResponse.sendDeleteOk(res, bed);
  } catch (err) {
    await recordAuditTrail("DELETE", "beds", err, req, 'ERROR', err.message);
    console.error('Controller Delete Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { beds, err } = await bedService.findAll();

    if (err) {
      await recordAuditTrail("READ", "beds", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }

    await recordAuditTrail("READ", "beds", beds, req, 'SUCCESS', 'Get all Beds success');
    return buildResponse.findOk(res, beds, beds.length);
  } catch (err) {
    await recordAuditTrail("READ", "beds", err, req, 'ERROR', err.message);
    console.error('Controller Find All Error:', err);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['roomOid', 'status', 'bedNumber']);
    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await bedService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "beds", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }

    await recordAuditTrail("READ", "beds", result.beds, req, 'SUCCESS', 'Get Beds with filters success');
    return buildResponse.sendPagination(res, result.beds, result.count, options.pageIndex, options.pageSize);
  } catch (err) {
    console.error('Controller error:', err);
    await recordAuditTrail("READ", "beds", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findById = async (req, res) => {
  try {
    const options = { include: [] };
    const { bed, err } = await bedService.findById(req.params.oid, options);

    if (err) {
      await recordAuditTrail("READ", "beds", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!bed) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "beds", bed, req, 'SUCCESS', 'Get Bed by ID success');
    return buildResponse.findOk(res, bed);
  } catch (err) {
    await recordAuditTrail("READ", "beds", err, req, 'ERROR', err.message);
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
