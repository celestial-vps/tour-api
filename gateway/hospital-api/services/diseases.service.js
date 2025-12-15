const diseasesRepository = require('../repositories/diseases.repository');
const mappings = require('../mappings/diseases.vm');
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
      diseaseCode: dto.diseaseCode,
      diseaseName: dto.diseaseName,
      description: dto.description ?? null,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const saveFunction = async (conn, data) => diseasesRepository.save(data, { transaction: conn });
    const funcs = [async (conn) => saveFunction(conn, data)];
    const { result, err } = await withTransaction(funcs, connection, data);

    if (err) return { disease: null, err };
    const msgData = { value: data.oid, name: data.diseaseName };
    const disease = await messageMaps.toMessageResponse(msgData);
    return { disease, err: null };

  } catch (err) {
    return { disease: null, err: { httpStatus: 500 } };
  }
};

const update = async (oid, dto, userOid) => {
  let connection;
  const now = moment().format('YYYY-MM-DD HH:mm:ss');

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: diseaseData, err: errDisease } = await diseasesRepository.findById(oid, connection);
    if (errDisease) return { disease: {}, err: errDisease };
    if (!diseaseData) return { disease: {}, err: { httpStatus: 404 } };

    diseaseData.diseaseCode = dto.diseaseCode ?? diseaseData.diseaseCode;
    diseaseData.diseaseName = dto.diseaseName ?? diseaseData.diseaseName;
    diseaseData.description = dto.description ?? diseaseData.description;
    diseaseData.lastModifiedBy = userOid ?? diseaseData.lastModifiedBy;
    diseaseData.updatedAt = now;

    const updateFunction = async (conn, data) => diseasesRepository.update(oid, data, { transaction: conn });
    const funcs = [async (conn) => updateFunction(conn, diseaseData)];
    const { result, err } = await withTransaction(funcs, connection, diseaseData);

    if (err) return { disease: result, err };
    const msgData = { value: diseaseData.oid, name: diseaseData.diseaseName };
    const disease = await messageMaps.toMessageResponse(msgData);
    return { disease, err: null };

  } catch (err) {
    return { disease: null, err: { httpStatus: 500 } };
  }
};

const deleted = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: diseaseData, err: errDisease } = await diseasesRepository.findById(oid, connection);
    if (errDisease) return { disease: {}, err: errDisease };
    if (!diseaseData) return { disease: {}, err: { httpStatus: 404 } };

    const deleteFunction = async (conn) => diseasesRepository.deleted(oid, { transaction: conn });
    const funcs = [async (conn) => deleteFunction(conn)];
    const { result, err } = await withTransaction(funcs, connection, diseaseData);

    if (err) return { disease: null, err };
    const msgData = { value: diseaseData.oid, name: diseaseData.diseaseName };
    const disease = await messageMaps.toMessageResponse(msgData);
    return { disease, err: null };

  } catch (err) {
    return { disease: null, err: { httpStatus: 500 } };
  }
};

const findAll = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await diseasesRepository.findAll(connection);
    const diseases = await mappings.toDiseasesResponses(result);
    return { diseases, err: null };
  } catch (err) {
    return { diseases: [], err: { httpStatus: 500 } };
  }
};

const findById = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await diseasesRepository.findById(oid, connection);
    if (err) return { disease: {}, err };
    if (!result) return { disease: null, err: { httpStatus: 404 } };

    const disease = await mappings.toDiseasesResponse(result);
    return { disease, err: null };
  } catch (err) {
    return { disease: [], err: { httpStatus: 500 } };
  }
};

const findPage = async (condition, page, pageSize) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { count, errCount } = await diseasesRepository.findCountByCriteria(condition, connection);
    if (errCount) return { diseases: [], count: 0, errCount };

    const { diseases, err } = await diseasesRepository.findByCriteria(condition, page, pageSize, connection);
    if (err) return { diseases: [], count: 0, errCount };

    const diseaseResponses = await mappings.toDiseasesResponses(diseases);
    return { diseases: diseaseResponses, count, err: err };
  } catch (err) {
    return { diseases: [], count: 0, err: { httpStatus: 500 } };
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
