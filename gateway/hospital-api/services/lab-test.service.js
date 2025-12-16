const labTestRepository = require('../repositories/lab-test.repository');
const mappings = require('../mappings/lab-test.vm');
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
      testCode: dto.testCode,
      testName: dto.testName,
      description: dto.description ?? null,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const saveFunction = async (conn, data) => labTestRepository.save(data, { transaction: conn });
    const funcs = [async (conn) => saveFunction(conn, data)];
    const { result, err } = await withTransaction(funcs, connection, data);

    if (err) return { labTest: null, err };
    const msgData = { value: data.oid, name: data.testName };
    const labTest = await messageMaps.toMessageResponse(msgData);
    return { labTest, err: null };

  } catch (err) {
    return { labTest: null, err: { httpStatus: 500 } };
  }
};

const update = async (oid, dto, userOid) => {
  let connection;
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: findResult, err: errLab } = await labTestRepository.findById(oid, connection);
    if (errLab) return { labTest: null, err: errLab };
    if (!findResult) return { labTest: null, err: { httpStatus: 404 } };

    findResult.testCode = dto.testCode ?? findResult.testCode;
    findResult.testName = dto.testName ?? findResult.testName;
    findResult.description = dto.description ?? findResult.description;
    findResult.lastModifiedBy = userOid;
    findResult.updatedAt = now;

    const updateFunction = async (conn, data) => labTestRepository.update(oid, data, { transaction: conn });
    const funcs = [async (conn) => updateFunction(conn, findResult)];
    const { result, err } = await withTransaction(funcs, connection, findResult);

    if (err) return { labTest: null, err };
    const msgData = { value: result.oid, name: result.testName };
    const labTest = await messageMaps.toMessageResponse(msgData);
    return { labTest, err: null };

  } catch (err) {
    return { labTest: null, err: { httpStatus: 500 } };
  }
};

const deleted = async (oid) => {
  let connection;
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: findResult, err } = await labTestRepository.findById(oid, connection);
    if (err) return { labTest: null, err };
    if (!findResult) return { labTest: null, err: { httpStatus: 404 } };

    const deleteFunction = async (conn) => labTestRepository.deleted(oid, { transaction: conn });
    const funcs = [async (conn) => deleteFunction(conn)];
    const { result, err: errDelete } = await withTransaction(funcs, connection, findResult);

    if (errDelete) return { labTest: null, err: errDelete };
    const msgData = { value: findResult.oid, name: findResult.testName };
    const labTest = await messageMaps.toMessageResponse(msgData);
    return { labTest, err: null };

  } catch (err) {
    return { labTest: null, err: { httpStatus: 500 } };
  }
};

const findAll = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await labTestRepository.findAll(connection);
    if (err) return { labTests: [], err };
    const labTests = await mappings.toLabTestResponses(result);
    return { labTests, err: null };
  } catch (err) {
    return { labTests: [], err: { httpStatus: 500 } };
  }
};

const findById = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await labTestRepository.findById(oid, connection);
    if (err) return { labTest: null, err };
    if (!result) return { labTest: null, err: { httpStatus: 404 } };
    const labTest = await mappings.toLabTestResponse(result);
    return { labTest, err: null };
  } catch (err) {
    return { labTest: null, err: { httpStatus: 500 } };
  }
};

const findPage = async (condition, options) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { count, errCount } = await labTestRepository.findCountByCriteria(condition, connection);
    if (errCount) return { labTests: [], count: 0, err: errCount };
    const { result, err } = await labTestRepository.findByCriteria(condition, options.pageIndex, options.pageSize, connection);
    if (err) return { labTests: [], count: 0, err };

    const labTests = await mappings.toLabTestResponses(result);
    return { labTests, count, err: null };
  } catch (err) {
    return { labTests: [], count: 0, err: { httpStatus: 500 } };
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
