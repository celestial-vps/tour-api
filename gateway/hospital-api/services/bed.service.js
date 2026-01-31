const bedRepository = require('../repositories/bed.repository');
const mappings = require('../mappings/bed.vm');
const messageMaps = require('../mappings/message.vm');
const pool = require('../database/database');
const { uuidv7 } = require("uuidv7");
const { withTransaction } = require("../helper/transaction");
const moment = require('moment');

const create = async (dto, userOid) => {
  let connection;
  const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const data = {
      oid: uuidv7(),
      status: dto.status,
      bedNumber: dto.bedNumber,
      roomOid: dto.roomOid ?? null, 
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const saveFunction = async (connection, data) => {
      return bedRepository.save(data, { transaction: connection });
    };

    const funcs = [async (conn) => saveFunction(conn, data)];
    const { result, err } = await withTransaction(funcs, connection, data);

    if (err) return { bed: null, err };

    const msgData = { value: data.oid, name: data.bedNumber };
    const bed = await messageMaps.toMessageResponse(msgData);
    return { bed, err: null };

  } catch (err) {
    return { bed: null, err: { httpStatus: 500 } };
  }
};

const update = async (oid, dto, userOid) => {
  let connection;
  const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: bedData, err: errBed } = await bedRepository.findById(oid, connection);
    if (errBed) return { bed: {}, err: errBed };
    if (!bedData) return { bed: {}, err: { httpStatus: 404 } };

    bedData.status = dto.status ?? bedData.status;
    bedData.bedNumber = dto.bedNumber ?? bedData.bedNumber;
    bedData.roomOid = dto.roomOid ?? bedData.roomOid; 
    bedData.lastModifiedBy = userOid ?? bedData.lastModifiedBy;
    bedData.updatedAt = now;

    const updateFunction = async (connection, data) => {
      return bedRepository.update(oid, data, { transaction: connection });
    };

    const funcs = [async (conn) => updateFunction(conn, bedData)];
    const { result, err } = await withTransaction(funcs, connection, bedData);
    if (err) return { bed: result, err };

    const msgData = { value: bedData.oid, name: bedData.bedNumber };
    const bed = await messageMaps.toMessageResponse(msgData);
    return { bed, err: null };

  } catch (err) {
    return { bed: null, err: { httpStatus: 500 } };
  }
};

const deleted = async (oid) => {
  let connection;
  const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: bedData, err: errBed } = await bedRepository.findById(oid, connection);
    if (errBed) return { bed: {}, err: errBed };
    if (!bedData) return { bed: {}, err: { httpStatus: 404 } };

    const deleteFunction = async (connection) => {
      return bedRepository.deleted(oid, { transaction: connection });
    };

    const funcs = [async (conn) => deleteFunction(conn)];
    const { result, err } = await withTransaction(funcs, connection, bedData);
    if (err) return { bed: null, err };

    const msgData = { value: bedData.oid, name: bedData.bedNumber };
    const bed = await messageMaps.toMessageResponse(msgData);
    return { bed, err: null };

  } catch (err) {
    return { bed: null, err: { httpStatus: 500 } };
  }
};

const findAll = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await bedRepository.findAll(connection);
    const beds = await mappings.toBedResponses(result);
    return { beds, err: null };
  } catch (err) {
    return { beds: [], err: { httpStatus: 500 } };
  }
};

const findById = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await bedRepository.findById(oid, connection);
    if (err) return { bed: {}, err };
    if (!result) return { bed: null, err: { httpStatus: 404 } };

    const bed = await mappings.toBedResponse(result);
    return { bed, err: null };
  } catch (err) {
    return { bed: [], err: { httpStatus: 500 } };
  }
};

const findPage = async (condition, options) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { count, errCount } = await bedRepository.findCountByCriteria(condition, connection);
    if (errCount) return { beds: [], count: 0, errCount };

    const { beds, err } = await bedRepository.findByCriteria(condition, options.pageIndex, options.pageSize, connection);
    if (err) return { beds: [], count: 0, errCount };

    const bedResponses = await mappings.toBedResponses(beds);
    return { beds: bedResponses, count, err: err };
  } catch (err) {
    return { beds: [], count: 0, err: { httpStatus: 500 } };
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
