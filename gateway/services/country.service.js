'use strict';
const countryRepository = require('../repositories/country.repository');
const mappings = require('../mappings/country.vm');
const messageMaps = require('../mappings/message.vm');
const sequelize = require('../config/sequelize');
const moment = require('moment');
const { buildFilterConditions, buildFindOptions } = require('../misc/sequelizeFilterBuilder');
const buildResponse = require('../common/build.response');
const { COUNTRY_BASIC_FIELDS } = require('../constants/country.fields');
const GeoCacheCountryService = require('../lib/redis/services/geo-cache-country.service');
const geoCacheCountryService = new GeoCacheCountryService();


const create = async (dto, userOid) => {
  const now = moment.utc().format('YYYY-MM-DD HH:mm:ss');
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const data = {
      countryCode: dto.countryCode,
      countryName: dto.countryName,
      countryCurrency: dto.countryCurrency,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, err } = await countryRepository.save(data, { transaction });

    if (err || !result) {
      await transaction.rollback();
      return {
        country: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    await transaction.commit();
    await geoCacheCountryService.upsertCountry({
      id: result.oid,           // atau result.id kalau ada
      name: result.countryName, // sesuaikan property
    });

    const msgData = { value: result.oid, name: result.countryName };
    const country = await messageMaps.toMessageResponse(msgData);

    return { country, err: null };

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Create failed:', error);
    return {
      country: null,
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

    const { result: existing, err: findError } = await countryRepository.findById(oid, findOptions);

    if (findError) {
      if (localTransaction) await localTransaction.rollback();
      return { country: null, err: findError };
    }

    if (!existing) {
      if (localTransaction) await localTransaction.rollback();
      return { country: null, err: { message: "Country not found", status: 404 } };
    }

    const updateData = {
      countryCode: dto.countryCode ?? existing.countryCode,
      countryName: dto.countryName ?? existing.countryName,
      countryCurrency: dto.countryCurrency ?? existing.countryCurrency,
      lastModifiedBy: userOid ?? existing.lastModifiedBy,
      updatedAt: now,
    };

    const { result: updateResult, err: updateError } = await countryRepository.update(
      oid,
      updateData,
      currentTransaction ? { transaction: currentTransaction } : {}
    );

    if (updateError) {
      if (localTransaction) await localTransaction.rollback();
      return { country: null, err: updateError };
    }

    if (localTransaction) await localTransaction.commit();

    await geoCacheCountryService.upsertCountry({
      id: updateResult.oid,           // pastikan properti ini ada di updateResult
      name: updateResult.countryName,
    });

    const msgData = { value: existing.oid, name: existing.countryName };
    const country = await messageMaps.toMessageResponse(msgData);

    return { country, err: null };

  } catch (err) {
    if (localTransaction) await localTransaction.rollback();
    console.error('Update failed:', err);
    return {
      country: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const deleted = async (oid) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { result: resultFind, err: errFind } = await countryRepository.findById(oid, { transaction });
    if (errFind) {
      await transaction.rollback();
      return { country: null, err: errFind };
    }

    if (!resultFind) {
      await transaction.rollback();
      return {
        country: null,
        err: { message: 'Data Not Found', status: 404 }
      };
    }

    const { result, err } = await countryRepository.remove(oid, { transaction });
    if (err) {
      await transaction.rollback();
      return { country: null, err };
    }

    await transaction.commit();


    // Kalau perlu, tambahkan hapus cache Redis disini, misal:
    await geoCacheCountryService.deleteCountry(oid);

    const msgData = { value: resultFind.oid, name: resultFind.countryName };
    const country = await messageMaps.toMessageResponse(msgData);

    return { country, err: null };

  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Delete failed:', err);
    return {
      country: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await countryRepository.findAll({
      include: [],
      order: [['createdAt', 'DESC']],
      attributes: COUNTRY_BASIC_FIELDS
    });

    if (err) return { countrys: [], err };

    const countrys = await mappings.toCountryResponses(result);
    return { countrys, err: null };
  } catch (err) {
    return {
      countrys: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findById = async (oid, options = {}) => {
  try {
    const { result, err } = await countryRepository.findById(oid, options);

    if (err) {
      return {
        country: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    if (!result) {
      return { country: null, err: null };
    }

    const country = await mappings.toCountryResponse(result);

    return { country, err: null };
  } catch (err) {
    console.error('Error finding country:', err);
    return {
      country: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findPage = async (filters, options) => {
  try {
    const { search, ...restFilters } = filters;
    const normalizedFilters = search ? { ...restFilters, countryName: search } : filters;

    const where = buildFilterConditions(sequelize, normalizedFilters, false);
    const findOptions = buildFindOptions(where, options);

    const result = await countryRepository.findAndCountByCriteria(findOptions);

    if (result.err) throw result.err;
     const countries = await mappings.toCountryResponses(result.data);

    return {
      countrys: countries,
      count: result.count,
      err: null,
    };
  } catch (error) {
    console.error('CountryService findPage error:', error);
    return {
      countrys: [],
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
