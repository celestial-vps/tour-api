const departmentRepository = require('../repositories/department.repository');
const mappings = require('../mappings/department.vm');
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
      departmentCode: dto.departmentCode,
      departmentName: dto.departmentName,
      description: dto.description ?? null,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const saveFunction = async (conn, data) => departmentRepository.save(data, { transaction: conn });
    const funcs = [async (conn) => saveFunction(conn, data)];
    const { result, err } = await withTransaction(funcs, connection, data);

    if (err) return { department: null, err };
    const msgData = { value: data.oid, name: data.departmentName };
    const department = await messageMaps.toMessageResponse(msgData);
    return { department, err: null };

  } catch (err) {
    return { department: null, err: { httpStatus: 500 } };
  }
};

const update = async (oid, dto, userOid) => {
  let connection;
  const now = moment().format('YYYY-MM-DD HH:mm:ss');

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: deptData, err: errDept } = await departmentRepository.findById(oid, connection);
    if (errDept) return { department: {}, err: errDept };
    if (!deptData) return { department: {}, err: { httpStatus: 404 } };

    deptData.departmentCode = dto.departmentCode ?? deptData.departmentCode;
    deptData.departmentName = dto.departmentName ?? deptData.departmentName;
    deptData.description = dto.description ?? deptData.description;
    deptData.lastModifiedBy = userOid ?? deptData.lastModifiedBy;
    deptData.updatedAt = now;

    const updateFunction = async (conn, data) => departmentRepository.update(oid, data, { transaction: conn });
    const funcs = [async (conn) => updateFunction(conn, deptData)];
    const { result, err } = await withTransaction(funcs, connection, deptData);

    if (err) return { department: result, err };
    const msgData = { value: deptData.oid, name: deptData.departmentName };
    const department = await messageMaps.toMessageResponse(msgData);
    return { department, err: null };

  } catch (err) {
    return { department: null, err: { httpStatus: 500 } };
  }
};

const deleted = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: deptData, err: errDept } = await departmentRepository.findById(oid, connection);
    if (errDept) return { department: {}, err: errDept };
    if (!deptData) return { department: {}, err: { httpStatus: 404 } };

    const deleteFunction = async (conn) => departmentRepository.deleted(oid, { transaction: conn });
    const funcs = [async (conn) => deleteFunction(conn)];
    const { result, err } = await withTransaction(funcs, connection, deptData);

    if (err) return { department: null, err };
    const msgData = { value: deptData.oid, name: deptData.departmentName };
    const department = await messageMaps.toMessageResponse(msgData);
    return { department, err: null };

  } catch (err) {
    return { department: null, err: { httpStatus: 500 } };
  }
};

const findAll = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await departmentRepository.findAll(connection);
    const departments = await mappings.toDepartmentResponses(result);
    return { departments, err: null };
  } catch (err) {
    return { departments: [], err: { httpStatus: 500 } };
  }
};

const findById = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await departmentRepository.findById(oid, connection);
    if (err) return { department: {}, err };
    if (!result) return { department: null, err: { httpStatus: 404 } };

    const department = await mappings.toDepartmentResponse(result);
    return { department, err: null };
  } catch (err) {
    return { department: [], err: { httpStatus: 500 } };
  }
};

const findPage = async (condition, page, pageSize) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { count, errCount } = await departmentRepository.findCountByCriteria(condition, connection);
    if (errCount) return { departments: [], count: 0, errCount };

    const { departments, err } = await departmentRepository.findByCriteria(condition, page, pageSize, connection);
    if (err) return { departments: [], count: 0, errCount };

    const departmentResponses = await mappings.toDepartmentResponses(departments);
    return { departments: departmentResponses, count, err: err };
  } catch (err) {
    return { departments: [], count: 0, err: { httpStatus: 500 } };
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
