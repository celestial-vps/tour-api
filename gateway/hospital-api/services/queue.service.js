const queueRepository = require('../repositories/queue.repository');
const mappings = require('../mappings/queue.vm');
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
      patientOid: dto.patientOid,
      roomOid: dto.roomOid,
      scheduledAt: dto.scheduledAt,
      status: dto.status ?? 'pending',
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const saveFunction = async (conn, data) => queueRepository.save(data, { transaction: conn });
    const funcs = [async (conn) => saveFunction(conn, data)];
    const { result, err } = await withTransaction(funcs, connection, data);

    if (err) return { queue: null, err };
    const msgData = { value: data.oid, name: `Queue for Patient ${data.patientOid}` };
    const queue = await messageMaps.toMessageResponse(msgData);
    return { queue, err: null };

  } catch (err) {
    return { queue: null, err: { httpStatus: 500 } };
  }
};

const update = async (oid, dto, userOid) => {
  let connection;
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: findResult, err } = await queueRepository.findById(oid, connection);
    if (err) return { queue: null, err };
    if (!findResult) return { queue: null, err: { httpStatus: 404 } };

    findResult.patientOid = dto.patientOid ?? findResult.patientOid;
    findResult.roomOid = dto.roomOid ?? findResult.roomOid;
    findResult.scheduledAt = dto.scheduledAt ?? findResult.scheduledAt;
    findResult.status = dto.status ?? findResult.status;
    findResult.lastModifiedBy = userOid;
    findResult.updatedAt = now;

    const updateFunction = async (conn, data) => queueRepository.update(oid, data, { transaction: conn });
    const funcs = [async (conn) => updateFunction(conn, findResult)];
    const { result, err: errUpdate } = await withTransaction(funcs, connection, findResult);

    if (errUpdate) return { queue: null, err: errUpdate };
    const msgData = { value: result.oid, name: `Queue for Patient ${result.patientOid}` };
    const queue = await messageMaps.toMessageResponse(msgData);
    return { queue, err: null };

  } catch (err) {
    return { queue: null, err: { httpStatus: 500 } };
  }
};

const deleted = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: findResult, err } = await queueRepository.findById(oid, connection);
    if (err) return { queue: null, err };
    if (!findResult) return { queue: null, err: { httpStatus: 404 } };

    const deleteFunction = async (conn) => queueRepository.deleted(oid, { transaction: conn });
    const funcs = [async (conn) => deleteFunction(conn)];
    const { result, err: errDelete } = await withTransaction(funcs, connection, findResult);

    if (errDelete) return { queue: null, err: errDelete };
    const msgData = { value: findResult.oid, name: `Queue for Patient ${findResult.patientOid}` };
    const queue = await messageMaps.toMessageResponse(msgData);
    return { queue, err: null };

  } catch (err) {
    return { queue: null, err: { httpStatus: 500 } };
  }
};

const findAll = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await queueRepository.findAll(connection);
    if (err) return { queues: [], err };
    const queues = await mappings.toQueueResponses(result);
    return { queues, err: null };
  } catch (err) {
    return { queues: [], err: { httpStatus: 500 } };
  }
};

const findById = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await queueRepository.findById(oid, connection);
    if (err) return { queue: null, err };
    if (!result) return { queue: null, err: { httpStatus: 404 } };
    const queue = await mappings.toQueueResponse(result);
    return { queue, err: null };
  } catch (err) {
    return { queue: null, err: { httpStatus: 500 } };
  }
};

const findPage = async (condition, page, pageSize) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { count, errCount } = await queueRepository.findCountByCriteria(condition, connection);
    if (errCount) return { queues: [], count: 0, err: errCount };
    const { result, err } = await queueRepository.findByCriteria(condition, page, pageSize, connection);
    if (err) return { queues: [], count: 0, err };
    const queues = await mappings.toQueueResponses(result);
    return { queues, count, err: null };
  } catch (err) {
    return { queues: [], count: 0, err: { httpStatus: 500 } };
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
