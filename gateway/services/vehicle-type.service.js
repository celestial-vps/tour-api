'use strict';
const vehicleTypeRepository = require('../repositories/vehicle-type.repository');
const mappings = require('../mappings/vehicle-type.vm');
const messageMaps = require('../mappings/message.vm');
const sequelize = require('../config/sequelize');
const moment = require('moment');
const { buildFilterConditions, buildFindOptions } = require('../misc/sequelizeFilterBuilder');
const buildResponse = require('../common/build.response');
const { VEHICLE_TYPE_BASIC_FIELDS } = require('../constants/vehicle-type.fields');

const create = async (dto, userOid) => {
  // @ts-ignore
  const now = new Date().formatUTC(); 
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const data = {
      typeName: dto.typeName,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, err } = await vehicleTypeRepository.save(data, { transaction });

    if (err || !result) {
      await transaction.rollback();
      return {
        VehicleType: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    await transaction.commit();

    const msgData = { value: result.oid, name: result.undefined };
    const VehicleType = await messageMaps.toMessageResponse(msgData);

    return { VehicleType, err: null };

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Create failed:', error);
    return {
      VehicleType: null,
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

    const { result: existing, err: findError } = await vehicleTypeRepository.findById(oid, findOptions);

    if (findError) {
      if (localTransaction) await localTransaction.rollback();
      return { vehicleType: null, err: findError };
    }

    if (!existing) {
      if (localTransaction) await localTransaction.rollback();
      return { vehicleType: null, err: { message: "VehicleType not found", status: 404 } };
    }

    const updateData = {
      typeName: dto.typeName ?? existing.typeName,
      lastModifiedBy: userOid ?? existing.lastModifiedBy,
      updatedAt: now,
    };

    const { result: updateResult, err: updateError } = await vehicleTypeRepository.update(
      oid,
      updateData,
      currentTransaction ? { transaction: currentTransaction } : {}
    );

    if (updateError) {
      if (localTransaction) await localTransaction.rollback();
      return { VehicleType: null, err: updateError };
    }

    if (localTransaction) await localTransaction.commit();

    const msgData = { value: existing.oid, name: existing.undefined };
    const vehicleType = await messageMaps.toMessageResponse(msgData);

    return { vehicleType, err: null };

  } catch (err) {
    if (localTransaction) await localTransaction.rollback();
    console.error('Update failed:', err);
    return {
      vehicleType: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const deleted = async (oid) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { result: resultFind, err: errFind } = await vehicleTypeRepository.findById(oid, { transaction });
    if (errFind) {
      await transaction.rollback();
      return { VehicleType: null, err: errFind };
    }

    if (!resultFind) {
      await transaction.rollback();
      return {
        vehicleType: null,
        err: { message: 'Data Not Found', status: 404 }
      };
    }

    const { result, err } = await vehicleTypeRepository.remove(oid, { transaction });
    if (err) {
      await transaction.rollback();
      return { vehicleType: null, err };
    }

    await transaction.commit();

    const msgData = { value: resultFind.oid, name: resultFind.undefined };
    const vehicleType = await messageMaps.toMessageResponse(msgData);

    return { vehicleType, err: null };

  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Delete failed:', err);
    return {
      vehicleType: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await vehicleTypeRepository.findAll({
      include: [],
      order: [['createdAt', 'DESC']],
      attributes: VEHICLE_TYPE_BASIC_FIELDS
    });

    if (err) return { VehicleTypes: [], err };

    const vehicleTypes = await mappings.toVehicleTypeResponses(result);
    return { vehicleTypes, err: null };
  } catch (err) {
    return {
      vehicleTypes: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findById = async (oid, options = {}) => {
  try {
    const { result, err } = await vehicleTypeRepository.findById(oid, options);

    if (err) {
      return {
        vehicleType: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    if (!result) {
      return { vehicleType: null, err: null };
    }

    const vehicleType = await mappings.toVehicleTypeResponse(result);

    return { vehicleType, err: null };
  } catch (err) {
    console.error('Error finding VehicleType:', err);
    return {
      vehicleType: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findPage = async (filters, options) => {
  try {
    const { search, ...restFilters } = filters;
    const normalizedFilters = search ? { ...restFilters, typeName: search } : filters;

    const where = buildFilterConditions(sequelize, normalizedFilters, false);
    const findOptions = buildFindOptions(where, options);

    const result = await vehicleTypeRepository.findAndCountByCriteria(findOptions);

    if (result.err) throw result.err;

    return {
      vehicleTypes: result.data,
      count: result.count,
      err: null,
    };
  } catch (error) {
    console.error('VehicleTypeService findPage error:', error);
    return {
      vehicleTypes: [],
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
