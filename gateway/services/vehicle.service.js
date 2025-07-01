'use strict';
const vehicleRepository = require('../repositories/vehicle.repository');
const mappings = require('../mappings/vehicle.vm');
const messageMaps = require('../mappings/message.vm');
const sequelize = require('../config/sequelize');
const moment = require('moment');
const { buildFilterConditions, buildFindOptions } = require('../misc/sequelizeFilterBuilder');
const buildResponse = require('../common/build.response');
const { VEHICLE_BASIC_FIELDS } = require('../constants/vehicle.fields');
const VehicleType = require('../models/vehicle-type');
const { VEHICLE_TYPE_BASIC_FIELDS } = require('../constants/vehicle-type.fields');

const create = async (dto, userOid) => {
  // @ts-ignore
  const now = new Date().formatUTC();
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const data = {
      vehicleTypeOid: dto.vehicleTypeOid,
      year: dto.year,
      color: dto.color,
      status: dto.status,
      seatCapacity: dto.seatCapacity,
      licensePlate: dto.licensePlate,
      pricePerDay: dto.pricePerDay,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, err } = await vehicleRepository.save(data, { transaction });

    if (err || !result) {
      await transaction.rollback();
      return {
        Vehicle: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    await transaction.commit();

    const msgData = { value: result.oid, name: result.year };
    const vehicle = await messageMaps.toMessageResponse(msgData);

    return { vehicle, err: null };

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Create failed:', error);
    return {
      vehicle: null,
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

    const { result: existing, err: findError } = await vehicleRepository.findById(oid, findOptions);

    if (findError) {
      if (localTransaction) await localTransaction.rollback();
      return { Vehicle: null, err: findError };
    }

    if (!existing) {
      if (localTransaction) await localTransaction.rollback();
      return { Vehicle: null, err: { message: "Vehicle not found", status: 404 } };
    }

    const updateData = {
      vehicleTypeOid: dto.vehicleTypeOid ?? existing.vehicleTypeOid,
      year: dto.year ?? existing.year,
      color: dto.color ?? existing.color,
      status: dto.status ?? existing.status,
      licensePlate: dto.licensePlate ?? existing.licensePlate,
      seatCapacity: dto.seatCapacity ?? existing.seatCapacity,
      pricePerDay: dto.pricePerDay ?? existing.pricePerDay,
      lastModifiedBy: userOid ?? existing.lastModifiedBy,
      updatedAt: now,
    };

    const { result: updateResult, err: updateError } = await vehicleRepository.update(
      oid,
      updateData,
      currentTransaction ? { transaction: currentTransaction } : {}
    );

    if (updateError) {
      if (localTransaction) await localTransaction.rollback();
      return { Vehicle: null, err: updateError };
    }

    if (localTransaction) await localTransaction.commit();

    const msgData = { value: existing.oid, name: existing.year };
    const vehicle = await messageMaps.toMessageResponse(msgData);

    return { vehicle, err: null };

  } catch (err) {
    if (localTransaction) await localTransaction.rollback();
    console.error('Update failed:', err);
    return {
      vehicle: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const deleted = async (oid) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { result: resultFind, err: errFind } = await vehicleRepository.findById(oid, { transaction });
    if (errFind) {
      await transaction.rollback();
      return { Vehicle: null, err: errFind };
    }

    if (!resultFind) {
      await transaction.rollback();
      return {
        Vehicle: null,
        err: { message: 'Data Not Found', status: 404 }
      };
    }

    const { result, err } = await vehicleRepository.remove(oid, { transaction });
    if (err) {
      await transaction.rollback();
      return { vehicle: null, err };
    }

    await transaction.commit();

    const msgData = { value: resultFind.oid, name: resultFind.year };
    const vehicle = await messageMaps.toMessageResponse(msgData);

    return { vehicle, err: null };

  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Delete failed:', err);
    return {
      vehicle: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await vehicleRepository.findAll({
      include: [],
      order: [['createdAt', 'DESC']],
      attributes: VEHICLE_BASIC_FIELDS
    });

    if (err) return { Vehicles: [], err };

    const vehicles = await mappings.toVehicleResponses(result);
    return { vehicles, err: null };
  } catch (err) {
    return {
      vehicles: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findById = async (oid, options = {}) => {
  try {
    const { result, err } = await vehicleRepository.findById(oid, options);

    if (err) {
      return {
        vehicle: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    if (!result) {
      return { vehicle: null, err: null };
    }

    const vehicle = await mappings.toVehicleResponse(result);

    return { vehicle, err: null };
  } catch (err) {
    console.error('Error finding Vehicle:', err);
    return {
      vehicle: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findPage = async (filters, options) => {
  try {
    const { search, ...restFilters } = filters;
    const normalizedFilters = search ? { ...restFilters, year: search } : filters;

    const where = buildFilterConditions(sequelize, normalizedFilters, false);
    options.include = [
      {
        model: VehicleType,
        as: 'vehicleType',
        attributes: VEHICLE_TYPE_BASIC_FIELDS,
      }
    ];
    const findOptions = buildFindOptions(where, options);

    const result = await vehicleRepository.findAndCountByCriteria(findOptions);
    if (result.err) throw result.err;
    const vehicles = await mappings.toVehicleResponses(result.data);

    return {
      vehicles,
      count: result.count,
      err: null,
    };
  } catch (error) {
    console.error('Vehicle Service findPage error:', error);
    return {
      vehicles: [],
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
