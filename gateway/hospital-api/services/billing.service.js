const billingRepository = require('../repositories/billing.repository');
const mappings = require('../mappings/billing.vm');
const messageMaps = require('../mappings/message.vm');
const pool = require('../database/database');
const { uuidv7 } = require("uuidv7");
const { withTransaction } = require("../helper/transaction");
const moment = require('moment');

const create = async (dto, userOid) => {
  let connection;
  const now = moment().format('YYYY-MM-DD HH:mm:ss');

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const data = {
      oid: uuidv7(),
      billingCode: dto.billingCode,
      billingName: dto.billingName,
      description: dto.description ?? null,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const saveFunction = async (conn, data) => billingRepository.save(data, { transaction: conn });
    const funcs = [async (conn) => saveFunction(conn, data)];
    const { result, err } = await withTransaction(funcs, connection, data);

    if (err) return { billing: null, err };
    const msgData = { value: data.oid, name: data.billingName };
    const billing = await messageMaps.toMessageResponse(msgData);
    return { billing, err: null };

  } catch (err) {
    return { billing: null, err: { httpStatus: 500 } };
  }
};

const update = async (oid, dto, userOid) => {
  let connection;
  const now = moment().format('YYYY-MM-DD HH:mm:ss');

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: billingData, err: errBilling } = await billingRepository.findById(oid, connection);
    if (errBilling) return { billing: {}, err: errBilling };
    if (!billingData) return { billing: {}, err: { httpStatus: 404 } };

    billingData.billingCode = dto.billingCode ?? billingData.billingCode;
    billingData.billingName = dto.billingName ?? billingData.billingName;
    billingData.description = dto.description ?? billingData.description;
    billingData.lastModifiedBy = userOid ?? billingData.lastModifiedBy;
    billingData.updatedAt = now;

    const updateFunction = async (conn, data) => billingRepository.update(oid, data, { transaction: conn });
    const funcs = [async (conn) => updateFunction(conn, billingData)];
    const { result, err } = await withTransaction(funcs, connection, billingData);

    if (err) return { billing: result, err };
    const msgData = { value: billingData.oid, name: billingData.billingName };
    const billing = await messageMaps.toMessageResponse(msgData);
    return { billing, err: null };

  } catch (err) {
    return { billing: null, err: { httpStatus: 500 } };
  }
};

const deleted = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: billingData, err: errBilling } = await billingRepository.findById(oid, connection);
    if (errBilling) return { billing: {}, err: errBilling };
    if (!billingData) return { billing: {}, err: { httpStatus: 404 } };

    const deleteFunction = async (conn) => billingRepository.deleted(oid, { transaction: conn });
    const funcs = [async (conn) => deleteFunction(conn)];
    const { result, err } = await withTransaction(funcs, connection, billingData);

    if (err) return { billing: null, err };
    const msgData = { value: billingData.oid, name: billingData.billingName };
    const billing = await messageMaps.toMessageResponse(msgData);
    return { billing, err: null };

  } catch (err) {
    return { billing: null, err: { httpStatus: 500 } };
  }
};

const findAll = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await billingRepository.findAll(connection);
    const billings = await mappings.toBillingResponses(result);
    return { billings, err: null };
  } catch (err) {
    return { billings: [], err: { httpStatus: 500 } };
  }
};

const findById = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await billingRepository.findById(oid, connection);
    if (err) return { billing: {}, err };
    if (!result) return { billing: null, err: { httpStatus: 404 } };

    const billing = await mappings.toBillingResponse(result);
    return { billing, err: null };
  } catch (err) {
    return { billing: [], err: { httpStatus: 500 } };
  }
};

const findPage = async (condition, options) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { count, errCount } = await billingRepository.findCountByCriteria(condition, connection);
    if (errCount) return { billings: [], count: 0, errCount };

    const { billings, err } = await billingRepository.findByCriteria(condition, options.pageIndex, options.pageSize, connection);
    if (err) return { billings: [], count: 0, errCount };

    const billingResponses = await mappings.toBillingResponses(billings);
    return { billings: billingResponses, count, err: err };
  } catch (err) {
    return { billings: [], count: 0, err: { httpStatus: 500 } };
  }
};

module.exports = {
  create,
  update,
  deleted,
  findAll,
  findById,
  findPage,
};
