const queueService = require('../services/queue.service');
const buildResponse = require('../common/build.response');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

/**
 * Create Queue
 */
const create = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { queue, err } = await queueService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "queues", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }

    await recordAuditTrail("CREATE", "queues", queue, req, 'SUCCESS', 'Create Queue success');
    return buildResponse.createOk(res, queue, 1);

  } catch (err) {
    await recordAuditTrail("CREATE", "queues", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Update Queue
 */
const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;

    const { queue, err } = await queueService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "queues", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }

    await recordAuditTrail("UPDATE", "queues", queue, req, 'SUCCESS', 'Update Queue success');
    return buildResponse.updateOk(res, queue, 1);

  } catch (err) {
    await recordAuditTrail("UPDATE", "queues", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Delete Queue
 */
const remove = async (req, res) => {
  try {
    const { queue, err } = await queueService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "queues", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "delete");
    }

    await recordAuditTrail("DELETE", "queues", queue, req, 'SUCCESS', 'Delete Queue success');
    return buildResponse.sendDeleteOk(res, queue);

  } catch (err) {
    await recordAuditTrail("DELETE", "queues", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Get All Queues
 */
const findAll = async (req, res) => {
  try {
    const { queues, err } = await queueService.findAll();

    if (err) {
      await recordAuditTrail("READ", "queues", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }

    await recordAuditTrail("READ", "queues", queues, req, 'SUCCESS', 'Get All Queues success');
    return buildResponse.findOk(res, queues, queues.length);

  } catch (err) {
    await recordAuditTrail("READ", "queues", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

/**
 * Pagination / Search Queue
 */
const find = async (req, res) => {
  try {
    const filters = pick(req.body, ["patientOid", "queueNumber", "status", "roomOid", "search"]);

    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: Number(req.query.pageIndex),
      pageSize: Number(req.query.pageSize)
    };

    const result = await queueService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "queues", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }

    await recordAuditTrail("READ", "queues", result.queues, req, 'SUCCESS', 'Get queues with filters success');

    return buildResponse.sendPagination(
      res,
      result.queues,
      result.count,
      options.pageIndex,
      options.pageSize
    );

  } catch (error) {
    await recordAuditTrail("READ", "queues", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

/**
 * Find Queue by ID
 */
const findById = async (req, res) => {
  try {
    const { queue, err } = await queueService.findById(req.params.oid);

    if (err) {
      await recordAuditTrail("READ", "queues", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!queue) return buildResponse.sendDataNotFound(res);

    await recordAuditTrail("READ", "queues", queue, req, 'SUCCESS', 'Get Queue by ID success');
    return buildResponse.findOk(res, queue);

  } catch (err) {
    await recordAuditTrail("READ", "queues", err, req, 'ERROR', err.message);
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
