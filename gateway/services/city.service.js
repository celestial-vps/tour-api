'use strict';
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
      provinceOid: dto.provinceOid,
      cityName: dto.cityName,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, err } = await cityRepository.save(data, { transaction });

    if (err || !result) {
      await transaction.rollback();
      return {
        city: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    await transaction.commit();

    const msgData = { value: result.oid, name: result.cityName };
    const city = await messageMaps.toMessageResponse(msgData);

    return { city, err: null };

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Create failed:', error);
    return {
      city: null,
      err: buildResponse.responseInternalServerError(error).data.error,
    };
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

    const findOptions = {
      transaction: currentTransaction,
      include: [],
    };

    const { result: existing, err: findError } = await cityRepository.findById(oid, findOptions);

    if (findError) {
      if (localTransaction) await localTransaction.rollback();
      return { city: null, err: findError };
    }

    if (!existing) {
      if (localTransaction) await localTransaction.rollback();
      return { city: null, err: { message: "City not found", status: 404 } };
    }

    const updateData = {
      provinceOid: dto.provinceOid ?? existing.provinceOid,
      cityName: dto.cityName ?? existing.cityName,
      lastModifiedBy: userOid ?? existing.lastModifiedBy,
      updatedAt: now,
    };

    const { result: updateResult, err: updateError } = await cityRepository.update(
      oid,
      updateData,
      currentTransaction ? { transaction: currentTransaction } : {}
    );

    if (updateError) {
      if (localTransaction) await localTransaction.rollback();
      return { city: null, err: updateError };
    }

    if (localTransaction) await localTransaction.commit();

    const msgData = { value: existing.oid, name: existing.cityName };
    const city = await messageMaps.toMessageResponse(msgData);

    return { city, err: null };

  } catch (err) {
    if (localTransaction) await localTransaction.rollback();
    console.error('Update failed:', err);
    return {
      city: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const deleted = async (oid) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { result: resultFind, err: errFind } = await cityRepository.findById(oid, { transaction });
    if (errFind) {
      await transaction.rollback();
      return { city: null, err: errFind };
    }

    if (!resultFind) {
      await transaction.rollback();
      return {
        city: null,
        err: { message: 'Data Not Found', status: 404 }
      };
    }

    const { result, err } = await cityRepository.remove(oid, { transaction });
    if (err) {
      await transaction.rollback();
      return { city: null, err };
    }

    await transaction.commit();

    const msgData = { value: resultFind.oid, name: resultFind.cityName };
    const city = await messageMaps.toMessageResponse(msgData);

    return { city, err: null };

  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Delete failed:', err);
    return {
      city: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await cityRepository.findAll({
      include: [],
      order: [['createdAt', 'DESC']],
      attributes: CITY_BASIC_FIELDS
    });

    if (err) return { citys: [], err };

    const citys = await mappings.toCityResponses(result);
    return { citys, err: null };
  } catch (err) {
    return {
      citys: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findById = async (oid, options = {}) => {
  try {
    const { result, err } = await cityRepository.findById(oid, options);

    if (err) {
      return {
        city: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    if (!result) {
      return { city: null, err: null };
    }

    const city = await mappings.toCityResponse(result);

    return { city, err: null };
  } catch (err) {
    console.error('Error finding city:', err);
    return {
      city: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findPage = async (filters, options) => {
  try {
    const { search, ...restFilters } = filters;
    const normalizedFilters = search ? { ...restFilters, cityName: search } : filters;

    const where = buildFilterConditions(sequelize, normalizedFilters, false);
    const findOptions = buildFindOptions(where, options);

    const result = await cityRepository.findAndCountByCriteria(findOptions);

    if (result.err) throw result.err;

    return {
      citys: result.data,
      count: result.count,
      err: null,
    };
  } catch (error) {
    console.error('CityService findPage error:', error);
    return {
      citys: [],
      count: 0,
      err: buildResponse.responseInternalServerError(error).data.error,
    };
  }
};

module.exports = {
  create,
  update,
  deleted,
  findAll,
  findById,
  findPage
};
