const prescriptionRepository = require('../repositories/prescription.repository');
const mappings = require('../mappings/prescription.vm');
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
      doctorOid: dto.doctorOid,
      medicationOid: dto.medicationOid,
      dosage: dto.dosage,
      notes: dto.notes ?? null,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const saveFunction = async (conn, data) => prescriptionRepository.save(data, { transaction: conn });
    const funcs = [async (conn) => saveFunction(conn, data)];
    const { result, err } = await withTransaction(funcs, connection, data);

    if (err) return { prescription: null, err };
    const msgData = { value: data.oid, name: `Prescription for Patient ${data.patientOid}` };
    const prescription = await messageMaps.toMessageResponse(msgData);
    return { prescription, err: null };

  } catch (err) {
    return { prescription: null, err: { httpStatus: 500 } };
  }
};

const update = async (oid, dto, userOid) => {
  let connection;
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: findResult, err } = await prescriptionRepository.findById(oid, connection);
    if (err) return { prescription: null, err };
    if (!findResult) return { prescription: null, err: { httpStatus: 404 } };

    findResult.patientOid = dto.patientOid ?? findResult.patientOid;
    findResult.doctorOid = dto.doctorOid ?? findResult.doctorOid;
    findResult.medicationOid = dto.medicationOid ?? findResult.medicationOid;
    findResult.dosage = dto.dosage ?? findResult.dosage;
    findResult.notes = dto.notes ?? findResult.notes;
    findResult.lastModifiedBy = userOid;
    findResult.updatedAt = now;

    const updateFunction = async (conn, data) => prescriptionRepository.update(oid, data, { transaction: conn });
    const funcs = [async (conn) => updateFunction(conn, findResult)];
    const { result, err: errUpdate } = await withTransaction(funcs, connection, findResult);

    if (errUpdate) return { prescription: null, err: errUpdate };
    const msgData = { value: result.oid, name: `Prescription for Patient ${result.patientOid}` };
    const prescription = await messageMaps.toMessageResponse(msgData);
    return { prescription, err: null };

  } catch (err) {
    return { prescription: null, err: { httpStatus: 500 } };
  }
};

const deleted = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: findResult, err } = await prescriptionRepository.findById(oid, connection);
    if (err) return { prescription: null, err };
    if (!findResult) return { prescription: null, err: { httpStatus: 404 } };

    const deleteFunction = async (conn) => prescriptionRepository.deleted(oid, { transaction: conn });
    const funcs = [async (conn) => deleteFunction(conn)];
    const { result, err: errDelete } = await withTransaction(funcs, connection, findResult);

    if (errDelete) return { prescription: null, err: errDelete };
    const msgData = { value: findResult.oid, name: `Prescription for Patient ${findResult.patientOid}` };
    const prescription = await messageMaps.toMessageResponse(msgData);
    return { prescription, err: null };

  } catch (err) {
    return { prescription: null, err: { httpStatus: 500 } };
  }
};

const findAll = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await prescriptionRepository.findAll(connection);
    if (err) return { prescriptions: [], err };
    const prescriptions = await mappings.toPrescriptionResponses(result);
    return { prescriptions, err: null };
  } catch (err) {
    return { prescriptions: [], err: { httpStatus: 500 } };
  }
};

const findById = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await prescriptionRepository.findById(oid, connection);
    if (err) return { prescription: null, err };
    if (!result) return { prescription: null, err: { httpStatus: 404 } };
    const prescription = await mappings.toPrescriptionResponse(result);
    return { prescription, err: null };
  } catch (err) {
    return { prescription: null, err: { httpStatus: 500 } };
  }
};

const findPage = async (condition, page, pageSize) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { count, errCount } = await prescriptionRepository.findCountByCriteria(condition, connection);
    if (errCount) return { prescriptions: [], count: 0, err: errCount };
    const { result, err } = await prescriptionRepository.findByCriteria(condition, page, pageSize, connection);
    if (err) return { prescriptions: [], count: 0, err };
    const prescriptions = await mappings.toPrescriptionResponses(result);
    return { prescriptions, count, err: null };
  } catch (err) {
    return { prescriptions: [], count: 0, err: { httpStatus: 500 } };
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
