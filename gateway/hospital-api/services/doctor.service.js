const doctorRepository = require('../repositories/doctor.repository');
const mappings = require('../mappings/doctor.vm');
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
      userOid: userOid, 
      specializationOid: dto.specializationOid,
      phone: dto.phone ?? null,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const saveFunction = async (conn, data) => doctorRepository.save(data, { transaction: conn });
    const funcs = [async (conn) => saveFunction(conn, data)];
    const { result, err } = await withTransaction(funcs, connection, data);

    if (err) return { doctor: null, err };
    const msgData = { value: data.oid, name: data.phone  };
    const doctor = await messageMaps.toMessageResponse(msgData);
    return { doctor, err: null };

  } catch (err) {
    return { doctor: null, err: { httpStatus: 500 } };
  }
};

const update = async (oid, dto, userOid) => {
  let connection;
  const now = moment().format('YYYY-MM-DD HH:mm:ss');

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: doctorData, err: errDoctor } = await doctorRepository.findById(oid, connection);
    if (errDoctor) return { doctor: {}, err: errDoctor };
    if (!doctorData) return { doctor: {}, err: { httpStatus: 404 } };
 
    doctorData.userOid = dto.userOid ?? doctorData.userOid;
    doctorData.specializationOid = dto.specializationOid ?? doctorData.specializationOid;
    doctorData.phone = dto.phone ?? doctorData.phone;
    doctorData.lastModifiedBy = userOid ?? doctorData.lastModifiedBy;
    doctorData.updatedAt = now;

    const updateFunction = async (conn, data) => doctorRepository.update(oid, data, { transaction: conn });
    const funcs = [async (conn) => updateFunction(conn, doctorData)];
    const { result, err } = await withTransaction(funcs, connection, doctorData);

    if (err) return { doctor: result, err };
    const msgData = { value: doctorData.oid, name: doctorData.userOid };
    const doctor = await messageMaps.toMessageResponse(msgData);
    return { doctor, err: null };

  } catch (err) {
    return { doctor: null, err: { httpStatus: 500 } };
  }
};

const deleted = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: doctorData, err: errDoctor } = await doctorRepository.findById(oid, connection);
    if (errDoctor) return { doctor: {}, err: errDoctor };
    if (!doctorData) return { doctor: {}, err: { httpStatus: 404 } };

    const deleteFunction = async (conn) => doctorRepository.deleted(oid, { transaction: conn });
    const funcs = [async (conn) => deleteFunction(conn)];
    const { result, err } = await withTransaction(funcs, connection, doctorData);

    if (err) return { doctor: null, err };
    const msgData = { value: doctorData.oid, name: doctorData.userOid };
    const doctor = await messageMaps.toMessageResponse(msgData);
    return { doctor, err: null };

  } catch (err) {
    return { doctor: null, err: { httpStatus: 500 } };
  }
};

const findAll = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await doctorRepository.findAll(connection);
    const doctors = await mappings.toDoctorResponses(result);
    return { doctors, err: null };
  } catch (err) {
    return { doctors: [], err: { httpStatus: 500 } };
  }
};

const findById = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await doctorRepository.findById(oid, connection);
    if (err) return { doctor: {}, err };
    if (!result) return { doctor: null, err: { httpStatus: 404 } };

    const doctor = await mappings.toDoctorResponse(result);
    return { doctor, err: null };
  } catch (err) {
    return { doctor: [], err: { httpStatus: 500 } };
  }
};

const findPage = async (condition, options) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { count, errCount } = await doctorRepository.findCountByCriteria(condition, connection);
    if (errCount) return { doctors: [], count: 0, errCount };

    const { doctors, err } = await doctorRepository.findByCriteria(condition, options.pageIndex, options.pageSize, connection);
    if (err) return { doctors: [], count: 0, errCount };

    const doctorResponses = await mappings.toDoctorResponses(doctors);
    return { doctors: doctorResponses, count, err: err };
  } catch (err) {
    return { doctors: [], count: 0, err: { httpStatus: 500 } };
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
