const specializationRepository = require('../repositories/specialization.repository');
const mappings = require('../mappings/specialization.vm');
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
      description: dto.description ?? null,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const saveFunction = async (conn, data) => specializationRepository.save(data, { transaction: conn });
    const funcs = [async (conn) => saveFunction(conn, data)];
    const { result, err } = await withTransaction(funcs, connection, data);

    if (err) return { specialization: null, err };
    const msgData = { value: data.oid, name: data.name };
    const specialization = await messageMaps.toMessageResponse(msgData);
    return { specialization, err: null };

  } catch (err) {
    return { specialization: null, err: { httpStatus: 500 } };
  }
};

const update = async (oid, dto, userOid) => {
  let connection;
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: findResult, err } = await specializationRepository.findById(oid, connection);
    if (err) return { specialization: null, err };
    if (!findResult) return { specialization: null, err: { httpStatus: 404 } };

    findResult.name = dto.name ?? findResult.name;
    findResult.description = dto.description ?? findResult.description;
    findResult.lastModifiedBy = userOid;
    findResult.updatedAt = now;

    const updateFunction = async (conn, data) => specializationRepository.update(oid, data, { transaction: conn });
    const funcs = [async (conn) => updateFunction(conn, findResult)];
    const { result, err: errUpdate } = await withTransaction(funcs, connection, findResult);

    if (errUpdate) return { specialization: null, err: errUpdate };
    const msgData = { value: result.oid, name: result.name };
    const specialization = await messageMaps.toMessageResponse(msgData);
    return { specialization, err: null };

  } catch (err) {
    return { specialization: null, err: { httpStatus: 500 } };
  }
};

const deleted = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: findResult, err } = await specializationRepository.findById(oid, connection);
    if (err) return { specialization: null, err };
    if (!findResult) return { specialization: null, err: { httpStatus: 404 } };

    const deleteFunction = async (conn) => specializationRepository.deleted(oid, { transaction: conn });
    const funcs = [async (conn) => deleteFunction(conn)];
    const { result, err: errDelete } = await withTransaction(funcs, connection, findResult);

    if (errDelete) return { specialization: null, err: errDelete };
    const msgData = { value: findResult.oid, name: findResult.name };
    const specialization = await messageMaps.toMessageResponse(msgData);
    return { specialization, err: null };

  } catch (err) {
    return { specialization: null, err: { httpStatus: 500 } };
  }
};

const findAll = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await specializationRepository.findAll(connection);
    if (err) return { specializations: [], err };
    const specializations = await mappings.toSpecializationResponses(result);
    return { specializations, err: null };
  } catch (err) {
    return { specializations: [], err: { httpStatus: 500 } };
  }
};

const findById = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await specializationRepository.findById(oid, connection);
    if (err) return { specialization: null, err };
    if (!result) return { specialization: null, err: { httpStatus: 404 } };
    const specialization = await mappings.toSpecializationResponse(result);
    return { specialization, err: null };
  } catch (err) {
    return { specialization: null, err: { httpStatus: 500 } };
  }
};

const findPage = async (condition, page, pageSize) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { count, errCount } = await specializationRepository.findCountByCriteria(condition, connection);
    if (errCount) return { specializations: [], count: 0, err: errCount };
    const { result, err } = await specializationRepository.findByCriteria(condition, page, pageSize, connection);
    if (err) return { specializations: [], count: 0, err };
    const specializations = await mappings.toSpecializationResponses(result);
    return { specializations, count, err: null };
  } catch (err) {
    return { specializations: [], count: 0, err: { httpStatus: 500 } };
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
