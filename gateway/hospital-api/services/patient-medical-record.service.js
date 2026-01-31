const medicineRepository = require('../repositories/medicine.repository');
const mappings = require('../mappings/medicine.vm');
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
      medicineCode: dto.medicineCode,
      medicineName: dto.medicineName,
      description: dto.description ?? null,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const saveFunction = async (conn, data) => medicineRepository.save(data, { transaction: conn });
    const funcs = [async (conn) => saveFunction(conn, data)];
    const { result, err } = await withTransaction(funcs, connection, data);

    if (err) return { medicine: null, err };
    const msgData = { value: data.oid, name: data.medicineName };
    const medicine = await messageMaps.toMessageResponse(msgData);
    return { medicine, err: null };

  } catch (err) {
    return { medicine: null, err: { httpStatus: 500 } };
  }
};

const update = async (oid, dto, userOid) => {
  let connection;
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: findResult, err } = await medicineRepository.findById(oid, connection);
    if (err) return { medicine: null, err };
    if (!findResult) return { medicine: null, err: { httpStatus: 404 } };

    findResult.medicineCode = dto.medicineCode ?? findResult.medicineCode;
    findResult.medicineName = dto.medicineName ?? findResult.medicineName;
    findResult.description = dto.description ?? findResult.description;
    findResult.lastModifiedBy = userOid;
    findResult.updatedAt = now;

    const updateFunction = async (conn, data) => medicineRepository.update(oid, data, { transaction: conn });
    const funcs = [async (conn) => updateFunction(conn, findResult)];
    const { result, err: errUpdate } = await withTransaction(funcs, connection, findResult);

    if (errUpdate) return { medicine: null, err: errUpdate };
    const msgData = { value: result.oid, name: result.medicineName };
    const medicine = await messageMaps.toMessageResponse(msgData);
    return { medicine, err: null };

  } catch (err) {
    return { medicine: null, err: { httpStatus: 500 } };
  }
};

const deleted = async (oid) => {
  let connection;
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: findResult, err } = await medicineRepository.findById(oid, connection);
    if (err) return { medicine: null, err };
    if (!findResult) return { medicine: null, err: { httpStatus: 404 } };

    const deleteFunction = async (conn) => medicineRepository.deleted(oid, { transaction: conn });
    const funcs = [async (conn) => deleteFunction(conn)];
    const { result, err: errDelete } = await withTransaction(funcs, connection, findResult);

    if (errDelete) return { medicine: null, err: errDelete };
    const msgData = { value: findResult.oid, name: findResult.medicineName };
    const medicine = await messageMaps.toMessageResponse(msgData);
    return { medicine, err: null };

  } catch (err) {
    return { medicine: null, err: { httpStatus: 500 } };
  }
};

const findAll = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await medicineRepository.findAll(connection);
    if (err) return { medicines: [], err };
    const medicines = await mappings.toMedicineResponses(result);
    return { medicines, err: null };
  } catch (err) {
    return { medicines: [], err: { httpStatus: 500 } };
  }
};

const findById = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await medicineRepository.findById(oid, connection);
    if (err) return { medicine: null, err };
    if (!result) return { medicine: null, err: { httpStatus: 404 } };
    const medicine = await mappings.toMedicineResponse(result);
    return { medicine, err: null };
  } catch (err) {
    return { medicine: null, err: { httpStatus: 500 } };
  }
};

const findPage = async (condition, options) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { count, errCount } = await medicineRepository.findCountByCriteria(condition, connection);
    if (errCount) return { medicines: [], count: 0, err: errCount };
    const { result, err } = await medicineRepository.findByCriteria(condition, options.pageIndex, options.pageSize, connection);
    if (err) return { medicines: [], count: 0, err };

    const medicines = await mappings.toMedicineResponses(result);
    return { medicines, count, err: null };
  } catch (err) {
    return { medicines: [], count: 0, err: { httpStatus: 500 } };
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
