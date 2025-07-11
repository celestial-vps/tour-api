'use strict';
const subAreaRepository = require('../repositories/sub-area.repository');
const mappings = require('../mappings/sub-area.vm');
const messageMaps = require('../mappings/message.vm');
const sequelize = require('../config/sequelize');
const moment = require('moment');
const { buildFilterConditions, buildFindOptions } = require('../misc/sequelizeFilterBuilder');
const buildResponse = require('../common/build.response');
const { SUB_AREA_BASIC_FIELDS } = require('../constants/sub-area.fields');
const { City } = require('../models');
const { CITY_BASIC_FIELDS } = require('../constants/city.fields');

const create = async (dto, userOid) => {
  // @ts-ignore
  const now = new Date().formatUTC();
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const data = {
      cityOid: dto.cityOid,
      subAreaName: dto.subAreaName,
      latitude: dto.latitude,
      longitude: dto.longitude,
      address: dto.address,
      phoneNumber: dto.phoneNumber,
      email: dto.email,
      openingHour: dto.openingHour,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, err } = await subAreaRepository.save(data, { transaction });

    if (err || !result) {
      await transaction.rollback();
      return {
        subArea: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    await transaction.commit();

    const msgData = { value: result.oid, name: result.cityOid };
    const subArea = await messageMaps.toMessageResponse(msgData);

    return { subArea, err: null };

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Create failed:', error);
    return {
      subArea: null,
      err: buildResponse.responseInternalServerError(error).data.error,
    };
  }
};

const update = async (oid, dto, userOid, options = {}) => {
  const { transaction = null, useTransaction = false } = options;
  // @ts-ignore
  const now = new Date().formatUTC();
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

    const { result: existing, err: findError } = await subAreaRepository.findById(oid, findOptions);

    if (findError) {
      if (localTransaction) await localTransaction.rollback();
      return { subArea: null, err: findError };
    }

    if (!existing) {
      if (localTransaction) await localTransaction.rollback();
      return { subArea: null, err: { message: "SubArea not found", status: 404 } };
    }

    const updateData = {
      cityOid: dto.cityOid ?? existing.cityOid,
      subAreaName: dto.subAreaName ?? existing.subAreaName,
      latitude: dto.latitude ?? existing.latitude,
      longitude: dto.longitude ?? existing.longitude,
      address: dto.address ?? existing.address,
      phoneNumber: dto.phoneNumber ?? existing.phoneNumber,
      email: dto.email ?? existing.email,
      openingHour: dto.openingHour ?? existing.openingHour,
      lastModifiedBy: userOid ?? existing.lastModifiedBy,
      updatedAt: now,
    };

    const { result: updateResult, err: updateError } = await subAreaRepository.update(
      oid,
      updateData,
      currentTransaction ? { transaction: currentTransaction } : {}
    );

    if (updateError) {
      if (localTransaction) await localTransaction.rollback();
      return { subArea: null, err: updateError };
    }

    if (localTransaction) await localTransaction.commit();

    const msgData = { value: existing.oid, name: existing.cityOid };
    const subArea = await messageMaps.toMessageResponse(msgData);

    return { subArea, err: null };

  } catch (err) {
    if (localTransaction) await localTransaction.rollback();
    console.error('Update failed:', err);
    return {
      subArea: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const deleted = async (oid) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { result: resultFind, err: errFind } = await subAreaRepository.findById(oid, { transaction });
    if (errFind) {
      await transaction.rollback();
      return { subArea: null, err: errFind };
    }

    if (!resultFind) {
      await transaction.rollback();
      return {
        subArea: null,
        err: { message: 'Data Not Found', status: 404 }
      };
    }

    const { result, err } = await subAreaRepository.remove(oid, { transaction });
    if (err) {
      await transaction.rollback();
      return { subArea: null, err };
    }

    await transaction.commit();

    const msgData = { value: resultFind.oid, name: resultFind.cityOid };
    const subArea = await messageMaps.toMessageResponse(msgData);

    return { subArea, err: null };

  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Delete failed:', err);
    return {
      subArea: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await subAreaRepository.findAll({
      include: [

      ],
      order: [['createdAt', 'DESC']],
      attributes: SUB_AREA_BASIC_FIELDS
    });

    if (err) return { subAreas: [], err };

    const subAreas = await mappings.toSubAreaResponses(result);
    return { subAreas, err: null };
  } catch (err) {
    return {
      subAreas: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findById = async (oid, options = {}) => {
  try {
    const { result, err } = await subAreaRepository.findById(oid, options);

    if (err) {
      return {
        subArea: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    if (!result) {
      return { subArea: null, err: null };
    }

    const subArea = await mappings.toSubAreaResponse(result);

    return { subArea, err: null };
  } catch (err) {
    console.error('Error finding subArea:', err);
    return {
      subArea: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findPage = async (filters, options) => {
  try {
    const { search, ...restFilters } = filters;
    const normalizedFilters = search ? { ...restFilters, cityOid: search } : filters;

    const where = buildFilterConditions(sequelize, normalizedFilters, false);
    options.include = [
      {
        model: City,
        as: 'city',
        attributes: CITY_BASIC_FIELDS,
      }
    ];
    const findOptions = buildFindOptions(where, options);

    const result = await subAreaRepository.findAndCountByCriteria(findOptions);

    if (result.err) throw result.err;
    const subAreas = await mappings.toSubAreaResponses(result.data);

    return {
      subAreas,
      count: result.count,
      err: null,
    };
  } catch (error) {
    console.error('SubAreaService findPage error:', error);
    return {
      subAreas: [],
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
