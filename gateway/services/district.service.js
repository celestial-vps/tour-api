'use strict';
const districtRepository = require('../repositories/district.repository');
const mappings = require('../mappings/district.vm');
const messageMaps = require('../mappings/message.vm');
const sequelize = require('../config/sequelize');
const moment = require('moment');
const { buildFilterConditions, buildFindOptions } = require('../misc/sequelizeFilterBuilder');
const buildResponse = require('../common/build.response');
const { DISTRICT_BASIC_FIELDS } = require('../constants/district.fields');

const create = async (dto, userOid) => {
  const now = moment.utc().format('YYYY-MM-DD HH:mm:ss');
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const data = {
      cityOid: dto.cityOid,
      districtName: dto.districtName,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, err } = await districtRepository.save(data, { transaction });

    if (err || !result) {
      await transaction.rollback();
      return {
        district: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    await transaction.commit();

    const msgData = { value: result.oid, name: result.districtName };
    const district = await messageMaps.toMessageResponse(msgData);

    return { district, err: null };

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Create failed:', error);
    return {
      district: null,
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

    const { result: existing, err: findError } = await districtRepository.findById(oid, findOptions);

    if (findError) {
      if (localTransaction) await localTransaction.rollback();
      return { district: null, err: findError };
    }

    if (!existing) {
      if (localTransaction) await localTransaction.rollback();
      return { district: null, err: { message: "District not found", status: 404 } };
    }

    const updateData = {
      cityOid: dto.cityOid ?? existing.cityOid,
      districtName: dto.districtName ?? existing.districtName,
      lastModifiedBy: userOid ?? existing.lastModifiedBy,
      updatedAt: now,
    };

    const { result: updateResult, err: updateError } = await districtRepository.update(
      oid,
      updateData,
      currentTransaction ? { transaction: currentTransaction } : {}
    );

    if (updateError) {
      if (localTransaction) await localTransaction.rollback();
      return { district: null, err: updateError };
    }

    if (localTransaction) await localTransaction.commit();

    const msgData = { value: existing.oid, name: existing.districtName };
    const district = await messageMaps.toMessageResponse(msgData);

    return { district, err: null };

  } catch (err) {
    if (localTransaction) await localTransaction.rollback();
    console.error('Update failed:', err);
    return {
      district: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const deleted = async (oid) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { result: resultFind, err: errFind } = await districtRepository.findById(oid, { transaction });
    if (errFind) {
      await transaction.rollback();
      return { district: null, err: errFind };
    }

    if (!resultFind) {
      await transaction.rollback();
      return {
        district: null,
        err: { message: 'Data Not Found', status: 404 }
      };
    }

    const { result, err } = await districtRepository.remove(oid, { transaction });
    if (err) {
      await transaction.rollback();
      return { district: null, err };
    }

    await transaction.commit();

    const msgData = { value: resultFind.oid, name: resultFind.districtName };
    const district = await messageMaps.toMessageResponse(msgData);

    return { district, err: null };

  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Delete failed:', err);
    return {
      district: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await districtRepository.findAll({
      include: [],
      order: [['createdAt', 'DESC']],
      attributes: DISTRICT_BASIC_FIELDS
    });

    if (err) return { districts: [], err };

    const districts = await mappings.toDistrictResponses(result);
    return { districts, err: null };
  } catch (err) {
    return {
      districts: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findById = async (oid, options = {}) => {
  try {
    const { result, err } = await districtRepository.findById(oid, options);

    if (err) {
      return {
        district: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    if (!result) {
      return { district: null, err: null };
    }

    const district = await mappings.toDistrictResponse(result);

    return { district, err: null };
  } catch (err) {
    console.error('Error finding district:', err);
    return {
      district: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findPage = async (filters, options) => {
  try {
    const { search, ...restFilters } = filters;
    const normalizedFilters = search ? { ...restFilters, districtName: search } : filters;

    const where = buildFilterConditions(sequelize, normalizedFilters, false);
    const findOptions = buildFindOptions(where, options);

    const result = await districtRepository.findAndCountByCriteria(findOptions);

    if (result.err) throw result.err;

    return {
      districts: result.data,
      count: result.count,
      err: null,
    };
  } catch (error) {
    console.error('DistrictService findPage error:', error);
    return {
      districts: [],
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
