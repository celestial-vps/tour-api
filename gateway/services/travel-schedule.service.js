'use strict';
const travelScheduleRepository = require('../repositories/travel-schedule.repository');
const mappings = require('../mappings/travel-schedule.vm');
const messageMaps = require('../mappings/message.vm');
const sequelize = require('../config/sequelize');
const moment = require('moment');
const { buildFilterConditions, buildFindOptions } = require('../misc/sequelizeFilterBuilder');
const buildResponse = require('../common/build.response');
const { TRAVEL_SCHEDULE_BASIC_FIELDS } = require('../constants/travel-schedule.fields');
const { Vehicle, Driver, TravelRoute, SubArea } = require('../models');
const { VEHICLE_BASIC_FIELDS } = require('../constants/vehicle.fields');
const { DRIVER_BASIC_FIELDS } = require('../constants/driver.fields');
const Transaction = require('../models/transaction');
const { TRAVEL_ROUTE_BASIC_FIELDS } = require('../constants/travel-route.fields');
const { SUB_AREA_BASIC_FIELDS } = require('../constants/sub-area.fields');

const create = async (dto, userOid) => {
  // @ts-ignore
  const now = new Date().formatUTC();
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const data = {
      routeOid: dto.routeOid,
      vehicleOid: dto.vehicleOid,
      driverOid: dto.driverOid,
      departureTime: dto.departureTime,
      arrivalTime: dto.arrivalTime,
      status: dto.status,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, err } = await travelScheduleRepository.save(data, { transaction });

    if (err || !result) {
      await transaction.rollback();
      return {
        travelSchedule: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    await transaction.commit();

    const msgData = { value: result.oid, name: result.routeOid };
    const travelSchedule = await messageMaps.toMessageResponse(msgData);

    return { travelSchedule, err: null };

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Create failed:', error);
    return {
      travelSchedule: null,
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

    const { result: existing, err: findError } = await travelScheduleRepository.findById(oid, findOptions);

    if (findError) {
      if (localTransaction) await localTransaction.rollback();
      return { travelSchedule: null, err: findError };
    }

    if (!existing) {
      if (localTransaction) await localTransaction.rollback();
      return { travelSchedule: null, err: { message: "TravelSchedule not found", status: 404 } };
    }

    const updateData = {
      routeOid: dto.routeOid ?? existing.routeOid,
      vehicleOid: dto.vehicleOid ?? existing.vehicleOid,
      driverOid: dto.driverOid ?? existing.driverOid,
      departureTime: dto.departureTime ?? existing.departureTime,
      arrivalTime: dto.arrivalTime ?? existing.arrivalTime,
      status: dto.status ?? existing.status,
      lastModifiedBy: userOid ?? existing.lastModifiedBy,
      updatedAt: now,
    };

    const { result: updateResult, err: updateError } = await travelScheduleRepository.update(
      oid,
      updateData,
      currentTransaction ? { transaction: currentTransaction } : {}
    );

    if (updateError) {
      if (localTransaction) await localTransaction.rollback();
      return { travelSchedule: null, err: updateError };
    }

    if (localTransaction) await localTransaction.commit();

    const msgData = { value: existing.oid, name: existing.routeOid };
    const travelSchedule = await messageMaps.toMessageResponse(msgData);

    return { travelSchedule, err: null };

  } catch (err) {
    if (localTransaction) await localTransaction.rollback();
    console.error('Update failed:', err);
    return {
      travelSchedule: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const deleted = async (oid) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { result: resultFind, err: errFind } = await travelScheduleRepository.findById(oid, { transaction });
    if (errFind) {
      await transaction.rollback();
      return { travelSchedule: null, err: errFind };
    }

    if (!resultFind) {
      await transaction.rollback();
      return {
        travelSchedule: null,
        err: { message: 'Data Not Found', status: 404 }
      };
    }

    const { result, err } = await travelScheduleRepository.remove(oid, { transaction });
    if (err) {
      await transaction.rollback();
      return { travelSchedule: null, err };
    }

    await transaction.commit();

    const msgData = { value: resultFind.oid, name: resultFind.routeOid };
    const travelSchedule = await messageMaps.toMessageResponse(msgData);

    return { travelSchedule, err: null };

  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Delete failed:', err);
    return {
      travelSchedule: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await travelScheduleRepository.findAll({
      include: [],
      order: [['createdAt', 'DESC']],
      attributes: TRAVEL_SCHEDULE_BASIC_FIELDS
    });

    if (err) return { travelSchedules: [], err };

    const travelSchedules = await mappings.toTravelScheduleResponses(result);
    return { travelSchedules, err: null };
  } catch (err) {
    return {
      travelSchedules: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findById = async (oid, options = {}) => {
  try {
    const { result, err } = await travelScheduleRepository.findById(oid, options);

    if (err) {
      return {
        travelSchedule: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    if (!result) {
      return { travelSchedule: null, err: null };
    }

    const travelSchedule = await mappings.toTravelScheduleResponse(result);

    return { travelSchedule, err: null };
  } catch (err) {
    console.error('Error finding travelSchedule:', err);
    return {
      travelSchedule: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findPage = async (filters, options) => {
  try {
    const { search, ...restFilters } = filters;
    const normalizedFilters = search ? { ...restFilters, routeOid: search } : filters;

    const where = buildFilterConditions(sequelize, normalizedFilters, false);
    options.include = [
      {
        model: Vehicle,
        as: 'vehicle',
        attributes: VEHICLE_BASIC_FIELDS,
      },
      {
        model: Driver,
        as: 'driver',
        attributes: DRIVER_BASIC_FIELDS,
      },
      {
        model: TravelRoute,
        as: 'travelRoute',
        attributes: TRAVEL_ROUTE_BASIC_FIELDS,
        include: [
          {
            model: SubArea,
            as: 'originSubArea',
            attributes: SUB_AREA_BASIC_FIELDS,
          }, {
            model: SubArea,
            as: 'destinationSubArea',
            attributes: SUB_AREA_BASIC_FIELDS,
          }
        ],
      }
    ];
    const findOptions = buildFindOptions(where, options);

    const result = await travelScheduleRepository.findAndCountByCriteria(findOptions);

    if (result.err) throw result.err;
    const travelSchedules = await mappings.toTravelScheduleResponses(result.data);
    return {
      travelSchedules,
      count: result.count,
      err: null,
    };
  } catch (error) {
    console.error('TravelScheduleService findPage error:', error);
    return {
      travelSchedules: [],
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
