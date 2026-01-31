const treatmentRepository = require('../repositories/treatment.repository');
const mappings = require('../mappings/treatment.vm');
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
      name: dto.name,
      price: dto.price ?? 0,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const saveFunction = async (conn, data) => treatmentRepository.save(data, { transaction: conn });
    const funcs = [async (conn) => saveFunction(conn, data)];
    const { result, err } = await withTransaction(funcs, connection, data);

    if (err) return { treatment: null, err };
    const msgData = { value: data.oid, name: data.name };
    const treatment = await messageMaps.toMessageResponse(msgData);
    return { treatment, err: null };

  } catch (err) {
    return { treatment: null, err: { httpStatus: 500 } };
  }
};

const update = async (oid, dto, userOid) => {
  let connection;
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: findResult, err } = await treatmentRepository.findById(oid, connection);
    if (err) return { treatment: null, err };
    if (!findResult) return { treatment: null, err: { httpStatus: 404 } };

    findResult.name = dto.name ?? findResult.name;
    findResult.price = dto.price ?? findResult.price;
    findResult.lastModifiedBy = userOid;
    findResult.updatedAt = now;

    const updateFunction = async (conn, data) => treatmentRepository.update(oid, data, { transaction: conn });
    const funcs = [async (conn) => updateFunction(conn, findResult)];
    const { result, err: errUpdate } = await withTransaction(funcs, connection, findResult);

    if (errUpdate) return { treatment: null, err: errUpdate };
    const msgData = { value: result.oid, name: result.name };
    const treatment = await messageMaps.toMessageResponse(msgData);
    return { treatment, err: null };

  } catch (err) {
    return { treatment: null, err: { httpStatus: 500 } };
  }
};

const deleted = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: findResult, err } = await treatmentRepository.findById(oid, connection);
    if (err) return { treatment: null, err };
    if (!findResult) return { treatment: null, err: { httpStatus: 404 } };

    const deleteFunction = async (conn) => treatmentRepository.deleted(oid, { transaction: conn });
    const funcs = [async (conn) => deleteFunction(conn)];
    const { result, err: errDelete } = await withTransaction(funcs, connection, findResult);

    if (errDelete) return { treatment: null, err: errDelete };
    const msgData = { value: findResult.oid, name: findResult.name };
    const treatment = await messageMaps.toMessageResponse(msgData);
    return { treatment, err: null };

  } catch (err) {
    return { treatment: null, err: { httpStatus: 500 } };
  }
};

const findAll = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await treatmentRepository.findAll(connection);
    if (err) return { treatments: [], err };
    const treatments = await mappings.toTreatmentResponses(result);
    return { treatments, err: null };
  } catch (err) {
    return { treatments: [], err: { httpStatus: 500 } };
  }
};

const findById = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await treatmentRepository.findById(oid, connection);
    if (err) return { treatment: null, err };
    if (!result) return { treatment: null, err: { httpStatus: 404 } };
    const treatment = await mappings.toTreatmentResponse(result);
    return { treatment, err: null };
  } catch (err) {
    return { treatment: null, err: { httpStatus: 500 } };
  }
};

const findPage = async (condition, options) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { count, errCount } = await treatmentRepository.findCountByCriteria(condition, connection);
    if (errCount) return { treatments: [], count: 0, err: errCount };
    const { treatments, err } = await treatmentRepository.findByCriteria(condition, options.pageIndex, options.pageSize, connection);
    if (err) return { treatments: [], count: 0, err };
    const treatmentResponse = await mappings.toTreatmentResponses(treatments);
    return { treatments: treatmentResponse, count, err: null };
  } catch (err) {
    return { treatments: [], count: 0, err: { httpStatus: 500 } };
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
