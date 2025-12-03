const patientLabTestRepository = require('../repositories/patient-lab-test.repository');
const mappings = require('../mappings/patient-lab-test.vm');
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
      labTestOid: dto.labTestOid,
      result: dto.result ?? null,
      notes: dto.notes ?? null,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const saveFunction = async (conn, data) => patientLabTestRepository.save(data, { transaction: conn });
    const funcs = [async (conn) => saveFunction(conn, data)];
    const { result, err } = await withTransaction(funcs, connection, data);

    if (err) return { patientLabTest: null, err };
    const msgData = { value: data.oid, name: `Lab Test for Patient ${data.patientOid}` };
    const patientLabTest = await messageMaps.toMessageResponse(msgData);
    return { patientLabTest, err: null };

  } catch (err) {
    return { patientLabTest: null, err: { httpStatus: 500 } };
  }
};

const update = async (oid, dto, userOid) => {
  let connection;
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: findResult, err } = await patientLabTestRepository.findById(oid, connection);
    if (err) return { patientLabTest: null, err };
    if (!findResult) return { patientLabTest: null, err: { httpStatus: 404 } };

    findResult.result = dto.result ?? findResult.result;
    findResult.notes = dto.notes ?? findResult.notes;
    findResult.lastModifiedBy = userOid;
    findResult.updatedAt = now;

    const updateFunction = async (conn, data) => patientLabTestRepository.update(oid, data, { transaction: conn });
    const funcs = [async (conn) => updateFunction(conn, findResult)];
    const { result, err: errUpdate } = await withTransaction(funcs, connection, findResult);

    if (errUpdate) return { patientLabTest: null, err: errUpdate };
    const msgData = { value: result.oid, name: `Lab Test for Patient ${result.patientOid}` };
    const patientLabTest = await messageMaps.toMessageResponse(msgData);
    return { patientLabTest, err: null };

  } catch (err) {
    return { patientLabTest: null, err: { httpStatus: 500 } };
  }
};

const deleted = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: findResult, err } = await patientLabTestRepository.findById(oid, connection);
    if (err) return { patientLabTest: null, err };
    if (!findResult) return { patientLabTest: null, err: { httpStatus: 404 } };

    const deleteFunction = async (conn) => patientLabTestRepository.deleted(oid, { transaction: conn });
    const funcs = [async (conn) => deleteFunction(conn)];
    const { result, err: errDelete } = await withTransaction(funcs, connection, findResult);

    if (errDelete) return { patientLabTest: null, err: errDelete };
    const msgData = { value: findResult.oid, name: `Lab Test for Patient ${findResult.patientOid}` };
    const patientLabTest = await messageMaps.toMessageResponse(msgData);
    return { patientLabTest, err: null };

  } catch (err) {
    return { patientLabTest: null, err: { httpStatus: 500 } };
  }
};

const findAll = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await patientLabTestRepository.findAll(connection);
    if (err) return { labTests: [], err };
    const labTests = await mappings.toPatientLabTestResponses(result);
    return { labTests, err: null };
  } catch (err) {
    return { labTests: [], err: { httpStatus: 500 } };
  }
};

const findById = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await patientLabTestRepository.findById(oid, connection);
    if (err) return { patientLabTest: null, err };
    if (!result) return { patientLabTest: null, err: { httpStatus: 404 } };
    const labTest = await mappings.toPatientLabTestResponse(result);
    return { patientLabTest: labTest, err: null };
  } catch (err) {
    return { patientLabTest: null, err: { httpStatus: 500 } };
  }
};

const findPage = async (condition, page, pageSize) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { count, errCount } = await patientLabTestRepository.findCountByCriteria(condition, connection);
    if (errCount) return { labTests: [], count: 0, err: errCount };
    const { result, err } = await patientLabTestRepository.findByCriteria(condition, page, pageSize, connection);
    if (err) return { labTests: [], count: 0, err };

    const labTests = await mappings.toPatientLabTestResponses(result);
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
