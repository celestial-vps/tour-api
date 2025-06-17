'use strict';

const customerService = require('../services/customer.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');

const jwtMaker = new JwtMaker();

const create = async (req, res) => {
  console.log('🟢 [CREATE] Customer controller called');
  try {
    const userJwt = req.authorization_payload;
    const { customer, err } = await customerService.create(req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("CREATE", "Customer", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "insert");
    }
    await recordAuditTrail("CREATE", "Customer", customer, req, 'SUCCESS', 'Create customer success');
    return buildResponse.createOk(res, customer, 1);
  } catch (err) {
    await recordAuditTrail("CREATE", "Customer", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const userJwt = req.authorization_payload;
    const { customer, err } = await customerService.update(req.params.oid, req.body, userJwt.userOid);

    if (err) {
      await recordAuditTrail("UPDATE", "Customer", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "update");
    }
    await recordAuditTrail("UPDATE", "Customer", customer, req, 'SUCCESS', 'Update customer success');
    return buildResponse.updateOk(res, customer, 1);
  } catch (err) {
    await recordAuditTrail("UPDATE", "Customer", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { customer, err } = await customerService.deleted(req.params.oid);

    if (err) {
      await recordAuditTrail("DELETE", "Customer", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message || err, "delete");
    }
    await recordAuditTrail("DELETE", "Customer", customer, req, 'SUCCESS', 'Delete customer success');
    return buildResponse.sendDeleteOk(res, customer);
  } catch (err) {
    await recordAuditTrail("DELETE", "Customer", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const findAll = async (req, res) => {
  try {
    const { customers, err } = await customerService.findAll();

    if (err) {
      await recordAuditTrail("READ", "Customer", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get all");
    }
    await recordAuditTrail("READ", "Customer", customers, req, 'SUCCESS', 'Get all customers success');
    return buildResponse.findOk(res, customers, customers.length);
  } catch (err) {
    await recordAuditTrail("READ", "Customer", err, req, 'ERROR', err.message);
    return buildResponse.sendInternalServerError(res, err.message);
  }
};

const find = async (req, res) => {
  try {
    const filters = pick(req.body, ['customerName', 'customerPhone', 'search']);
    const options = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      pageIndex: parseInt(req.query.pageIndex, 10) || 1,
      pageSize: parseInt(req.query.pageSize, 10) || 10,
    };

    const result = await customerService.findPage(filters, options);

    if (result.err) {
      await recordAuditTrail("READ", "Customer", result.err, req, 'FAILED', result.err.message);
      return buildResponse.sendInternalServerError(res, result.err.message);
    }
    await recordAuditTrail("READ", "Customer", result.customers, req, 'SUCCESS', 'Get customers with filters success');
    return buildResponse.sendPagination(res, result.customers, result.count, options.pageIndex, options.pageSize);
  } catch (error) {
    await recordAuditTrail("READ", "Customer", error, req, 'ERROR', error.message);
    return buildResponse.sendInternalServerError(res, error.message);
  }
};

const findById = async (req, res) => {
  try {
    const { customer, err } = await customerService.findById(req.params.oid, { include: [] });

    if (err) {
      await recordAuditTrail("READ", "Customer", err, req, 'FAILED', err.message);
      return buildResponse.sendQueryError(res, err.message, "get by id");
    }

    if (!customer) return buildResponse.sendDataNotFound(res);
    await recordAuditTrail("READ", "Customer", customer, req, 'SUCCESS', 'Get customer by ID success');
    return buildResponse.findOk(res, customer);
  } catch (err) {
    await recordAuditTrail("READ", "Customer", err, req, 'ERROR', err.message);
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
