const medicationCategoryRepository = require('../repositories/medication-category.repository');
const mappings = require('../mappings/medication-category.vm');
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
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const saveFunction = async (conn, data) => medicationCategoryRepository.save(data, { transaction: conn });
    const funcs = [async (conn) => saveFunction(conn, data)];
    const { result, err } = await withTransaction(funcs, connection, data);

    if (err) return { category: null, err };
    const msgData = { value: data.oid, name: data.name };
    const category = await messageMaps.toMessageResponse(msgData);
    return { category, err: null };

  } catch (err) {
    return { category: null, err: { httpStatus: 500 } };
  }
};

const update = async (oid, dto, userOid) => {
  let connection;
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: findResult, err } = await medicationCategoryRepository.findById(oid, connection);
    if (err) return { category: null, err };
    if (!findResult) return { category: null, err: { httpStatus: 404 } };
 
    findResult.name = dto.name ?? findResult.name; 
    findResult.lastModifiedBy = userOid;
    findResult.updatedAt = now;

    const updateFunction = async (conn, data) => medicationCategoryRepository.update(oid, data, { transaction: conn });
    const funcs = [async (conn) => updateFunction(conn, findResult)];
    const { result, err: errUpdate } = await withTransaction(funcs, connection, findResult);

    if (errUpdate) return { category: null, err: errUpdate };
    const msgData = { value: result.oid, name: result.name };
    const category = await messageMaps.toMessageResponse(msgData);
    return { category, err: null };

  } catch (err) {
    return { category: null, err: { httpStatus: 500 } };
  }
};

const deleted = async (oid) => {
  let connection;
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: findResult, err } = await medicationCategoryRepository.findById(oid, connection);
    if (err) return { category: null, err };
    if (!findResult) return { category: null, err: { httpStatus: 404 } };

    const deleteFunction = async (conn) => medicationCategoryRepository.deleted(oid, { transaction: conn });
    const funcs = [async (conn) => deleteFunction(conn)];
    const { result, err: errDelete } = await withTransaction(funcs, connection, findResult);

    if (errDelete) return { category: null, err: errDelete };
    const msgData = { value: findResult.oid, name: findResult.name };
    const category = await messageMaps.toMessageResponse(msgData);
    return { category, err: null };

  } catch (err) {
    return { category: null, err: { httpStatus: 500 } };
  }
};

const findAll = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await medicationCategoryRepository.findAll(connection);
    if (err) return { categories: [], err };
    const categories = await mappings.toMedicationCategoryResponses(result);
    return { categories, err: null };
  } catch (err) {
    return { categories: [], err: { httpStatus: 500 } };
  }
};

const findById = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await medicationCategoryRepository.findById(oid, connection);
    if (err) return { category: null, err };
    if (!result) return { category: null, err: { httpStatus: 404 } };
    const category = await mappings.toMedicationCategoryResponse(result);
    return { category, err: null };
  } catch (err) {
    return { category: null, err: { httpStatus: 500 } };
  }
};

const findPage = async (condition, options) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { count, errCount } = await medicationCategoryRepository.findCountByCriteria(condition, connection);
    if (errCount) return { categories: [], count: 0, err: errCount };
    const { medicationCategories:result, err } = await medicationCategoryRepository.findByCriteria(condition,options.pageIndex, options.pageSize,connection);
    if (err) return { categories: [], count: 0, err };

    const categories = await mappings.toMedicationCategoryResponses(result);
    return { categories, count, err: null };
  } catch (err) {
    return { categories: [], count: 0, err: { httpStatus: 500 } };
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
