const patientRepository = require('../repositories/patient.repository');
const mappings = require('../mappings/patient.vm');
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
      fullName: dto.fullName,
      dateOfBirth: dto.dateOfBirth,
      gender: dto.gender,
      address: dto.address ?? null,
      phone: dto.phone ?? null,
      email: dto.email ?? null,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const saveFunction = async (conn, data) => patientRepository.save(data, { transaction: conn });
    const funcs = [async (conn) => saveFunction(conn, data)];
    const { result, err } = await withTransaction(funcs, connection, data);

    if (err) return { patient: null, err };
    const msgData = { value: data.oid, name: data.fullName };
    const patient = await messageMaps.toMessageResponse(msgData);
    return { patient, err: null };

  } catch (err) {
    return { patient: null, err: { httpStatus: 500 } };
  }
};

const update = async (oid, dto, userOid) => {
  let connection;
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: findResult, err } = await patientRepository.findById(oid, connection);
    if (err) return { patient: null, err };
    if (!findResult) return { patient: null, err: { httpStatus: 404 } };

    findResult.fullName = dto.fullName ?? findResult.fullName;
    findResult.dateOfBirth = dto.dateOfBirth ?? findResult.dateOfBirth;
    findResult.gender = dto.gender ?? findResult.gender;
    findResult.address = dto.address ?? findResult.address;
    findResult.phone = dto.phone ?? findResult.phone;
    findResult.email = dto.email ?? findResult.email;
    findResult.lastModifiedBy = userOid;
    findResult.updatedAt = now;

    const updateFunction = async (conn, data) => patientRepository.update(oid, data, { transaction: conn });
    const funcs = [async (conn) => updateFunction(conn, findResult)];
    const { result, err: errUpdate } = await withTransaction(funcs, connection, findResult);

    if (errUpdate) return { patient: null, err: errUpdate };
    const msgData = { value: result.oid, name: result.fullName };
    const patient = await messageMaps.toMessageResponse(msgData);
    return { patient, err: null };

  } catch (err) {
    return { patient: null, err: { httpStatus: 500 } };
  }
};

const deleted = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: findResult, err } = await patientRepository.findById(oid, connection);
    if (err) return { patient: null, err };
    if (!findResult) return { patient: null, err: { httpStatus: 404 } };

    const deleteFunction = async (conn) => patientRepository.deleted(oid, { transaction: conn });
    const funcs = [async (conn) => deleteFunction(conn)];
    const { result, err: errDelete } = await withTransaction(funcs, connection, findResult);

    if (errDelete) return { patient: null, err: errDelete };
    const msgData = { value: findResult.oid, name: findResult.fullName };
    const patient = await messageMaps.toMessageResponse(msgData);
    return { patient, err: null };

  } catch (err) {
    return { patient: null, err: { httpStatus: 500 } };
  }
};

const findAll = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await patientRepository.findAll(connection);
    if (err) return { patients: [], err };
    const patients = await mappings.toPatientResponses(result);
    return { patients, err: null };
  } catch (err) {
    return { patients: [], err: { httpStatus: 500 } };
  }
};

const findById = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await patientRepository.findById(oid, connection);
    if (err) return { patient: null, err };
    if (!result) return { patient: null, err: { httpStatus: 404 } };
    const patient = await mappings.toPatientResponse(result);
    return { patient, err: null };
  } catch (err) {
    return { patient: null, err: { httpStatus: 500 } };
  }
};

const findPage = async (condition, options) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { count, errCount } = await patientRepository.findCountByCriteria(condition, connection);
    if (errCount) return { patients: [], count: 0, err: errCount };
    const { result, err } = await patientRepository.findByCriteria(condition, options.pageIndex, options.pageSize, connection);
    if (err) return { patients: [], count: 0, err };
    const patients = await mappings.toPatientResponses(result);
    return { patients, count, err: null };
  } catch (err) {
    return { patients: [], count: 0, err: { httpStatus: 500 } };
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
