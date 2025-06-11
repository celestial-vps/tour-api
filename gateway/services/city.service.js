const cityRepository = require('../repositories/city.repository');
const mappings = require('../mappings/city.vm');
const messageMaps = require('../mappings/message.vm');
const sequelize = require('../config/sequelize');
const moment = require('moment');
const { buildFilterConditions, buildFindOptions } = require('../misc/sequelizeFilterBuilder');
const buildResponse = require('../common/build.response');
const { CITY_BASIC_FIELDS } = require('../constants/city.fields');

const create = async (dto, userOid) => {
  const now = moment.utc().format('YYYY-MM-DD HH:mm:ss');
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const data = {
      cityName: dto.cityName,
      provinceOid: dto.provinceOid,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, err } = await cityRepository.save(data, { transaction });
    if (err || !result) {
      await transaction.rollback();
      return { city: null, err: buildResponse.responseInternalServerError(err).data.error };
    }

    await transaction.commit();
    const msgData = { value: result.oid, name: result.cityName };
    const city = await messageMaps.toMessageResponse(msgData);

    return { city, err: null };
  } catch (err) {
    if (transaction) await transaction.rollback();
    return { city: null, err: buildResponse.responseInternalServerError(err).data.error };
  }
};

const update = async (oid, dto, userOid, options = {}) => {
  const { transaction = null, useTransaction = false } = options;
  const now = moment.utc().format('YYYY-MM-DD HH:mm:ss');
  let localTransaction = null;

  try {
    if (useTransaction && !transaction) {
      localTransaction = await sequelize.transaction();
    }

    const currentTransaction = transaction || localTransaction;
    const { result: existingCity, err: findError } = await cityRepository.findById(oid, { transaction: currentTransaction });

    if (findError || !existingCity) {
      if (localTransaction) await localTransaction.rollback();
      return { city: null, err: findError || { message: 'City not found', status: 404 } };
    }

    const updateData = {
      cityName: dto.cityName ?? existingCity.cityName,
      provinceOid: dto.provinceOid ?? existingCity.provinceOid,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result: updateResult, err: updateError } = await cityRepository.update(oid, updateData, { transaction: currentTransaction });

    if (updateError) {
      if (localTransaction) await localTransaction.rollback();
      return { city: null, err: updateError };
    }

    if (localTransaction) await localTransaction.commit();

    const msgData = { value: existingCity.oid, name: existingCity.cityName };
    const city = await messageMaps.toMessageResponse(msgData);

    return { city, err: null };
  } catch (err) {
    if (localTransaction) await localTransaction.rollback();
    return { city: null, err: buildResponse.responseInternalServerError(err).data.error };
  }
};

const deleted = async (oid) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { result: city, err: findErr } = await cityRepository.findById(oid, { transaction });

    if (findErr || !city) {
      await transaction.rollback();
      return { city: null, err: findErr || { message: 'City not found', status: 404 } };
    }

    const { result, err } = await cityRepository.remove(oid, { transaction });
    if (err) {
      await transaction.rollback();
      return { city: null, err };
    }

    await transaction.commit();

    const msgData = { value: city.oid, name: city.cityName };
    const cityResponse = await messageMaps.toMessageResponse(msgData);
    return { city: cityResponse, err: null };
  } catch (err) {
    if (transaction) await transaction.rollback();
    return { city: null, err: buildResponse.responseInternalServerError(err).data.error };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await cityRepository.findAll({
      include: [],
      order: [['createdAt', 'DESC']],
      attributes: CITY_BASIC_FIELDS,
    });

    if (err) return { cities: [], err };
    const cities = await mappings.toCityResponses(result);
    return { cities, err: null };
  } catch (err) {
    return { cities: [], err: buildResponse.responseInternalServerError(err).data.error };
  }
};

const findById = async (oid, options = {}) => {
  try {
    const { result, err } = await cityRepository.findById(oid, options);
    if (err) return { city: null, err: buildResponse.responseInternalServerError(err).data.error };
    if (!result) return { city: null, err: null };

    const city = await mappings.toCityResponse(result);
    return { city, err: null };
  } catch (err) {
    return { city: null, err: buildResponse.responseInternalServerError(err).data.error };
  }
};

const findPage = async (filters, options) => {
  try {
    const where = buildFilterConditions(sequelize, filters, false);
    const findOptions = buildFindOptions(where, options);

    const result = await cityRepository.findAndCountByCriteria(findOptions);
    if (result.err) throw result.err;

    return {
      cities: result.data,
      count: result.count,
      err: null,
    };
  } catch (err) {
    return {
      cities: [],
      count: 0,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
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
