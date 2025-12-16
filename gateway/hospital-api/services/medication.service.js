const medicationRepository = require('../repositories/medication.repository');
const mappings = require('../mappings/medication.vm');
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
      categoryOid: dto.categoryOid,
      name: dto.name, 
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const saveFunction = async (conn, data) => medicationRepository.save(data, { transaction: conn });
    const funcs = [async (conn) => saveFunction(conn, data)];
    const { result, err } = await withTransaction(funcs, connection, data);

    if (err) return { medication: null, err };
    const msgData = { value: data.oid, name: data.name };
    const medication = await messageMaps.toMessageResponse(msgData);
    return { medication, err: null };

  } catch (err) {
    return { medication: null, err: { httpStatus: 500 } };
  }
};

const update = async (oid, dto, userOid) => {
  let connection;
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: findResult, err } = await medicationRepository.findById(oid, connection);
    if (err) return { medication: null, err };
    if (!findResult) return { medication: null, err: { httpStatus: 404 } };

    findResult.categoryOid = dto.categoryOid ?? findResult.categoryOid;
    findResult.name = dto.name ?? findResult.name; 
    findResult.lastModifiedBy = userOid;
    findResult.updatedAt = now;

    const updateFunction = async (conn, data) => medicationRepository.update(oid, data, { transaction: conn });
    const funcs = [async (conn) => updateFunction(conn, findResult)];
    const { result, err: errUpdate } = await withTransaction(funcs, connection, findResult);

    if (errUpdate) return { medication: null, err: errUpdate };
    const msgData = { value: result.oid, name: result.name };
    const medication = await messageMaps.toMessageResponse(msgData);
    return { medication, err: null };

  } catch (err) {
    return { medication: null, err: { httpStatus: 500 } };
  }
};

const deleted = async (oid) => {
  let connection;
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: findResult, err } = await medicationRepository.findById(oid, connection);
    if (err) return { medication: null, err };
    if (!findResult) return { medication: null, err: { httpStatus: 404 } };

    const deleteFunction = async (conn) => medicationRepository.deleted(oid, { transaction: conn });
    const funcs = [async (conn) => deleteFunction(conn)];
    const { result, err: errDelete } = await withTransaction(funcs, connection, findResult);

    if (errDelete) return { medication: null, err: errDelete };
    const msgData = { value: findResult.oid, name: findResult.name };
    const medication = await messageMaps.toMessageResponse(msgData);
    return { medication, err: null };

  } catch (err) {
    return { medication: null, err: { httpStatus: 500 } };
  }
};

const findAll = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await medicationRepository.findAll(connection);
    if (err) return { medications: [], err };
    const medications = await mappings.toMedicationResponses(result);
    return { medications, err: null };
  } catch (err) {
    return { medications: [], err: { httpStatus: 500 } };
  }
};

const findById = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await medicationRepository.findById(oid, connection);
    if (err) return { medication: null, err };
    if (!result) return { medication: null, err: { httpStatus: 404 } };
    const medication = await mappings.toMedicationResponse(result);
    return { medication, err: null };
  } catch (err) {
    return { medication: null, err: { httpStatus: 500 } };
  }
};

const findPage = async (condition, options) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { count, errCount } = await medicationRepository.findCountByCriteria(condition, connection);
    if (errCount) return { medications: [], count: 0, err: errCount };
    const { medications:result, err } = await medicationRepository.findByCriteria(condition, options.pageIndex, options.pageSize, connection);
    if (err) return { medications: [], count: 0, err };

    const medications = await mappings.toMedicationResponses(result);
    return { medications, count, err: null };
  } catch (err) {
    return { medications: [], count: 0, err: { httpStatus: 500 } };
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
