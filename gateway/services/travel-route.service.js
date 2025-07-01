'use strict';
const travelRouteRepository = require('../repositories/travel-route.repository');
const mappings = require('../mappings/travel-route.vm');
const messageMaps = require('../mappings/message.vm');
const sequelize = require('../config/sequelize');
const moment = require('moment');
const { buildFilterConditions, buildFindOptions } = require('../misc/sequelizeFilterBuilder');
const buildResponse = require('../common/build.response');
const { TRAVEL_ROUTE_BASIC_FIELDS } = require('../constants/travel-route.fields');
const { SubArea } = require('../models');
const { SUB_AREA_BASIC_FIELDS } = require('../constants/sub-area.fields');

const create = async (dto, userOid) => {
  // @ts-ignore
  const now = new Date().formatUTC();
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const data = {
      originSubAreaOid: dto.originSubAreaOid,
      destinationSubAreaOid: dto.destinationSubAreaOid,
      distanceKm: dto.distanceKm,
      estimatedTime: dto.estimatedTime,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, err } = await travelRouteRepository.save(data, { transaction });

    if (err || !result) {
      await transaction.rollback();
      return {
        travelRoute: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    await transaction.commit();

    const msgData = { value: result.oid, name: result.originOid };
    const travelRoute = await messageMaps.toMessageResponse(msgData);

    return { travelRoute, err: null };

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Create failed:', error);
    return {
      travelRoute: null,
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

    const { result: existing, err: findError } = await travelRouteRepository.findById(oid, findOptions);

    if (findError) {
      if (localTransaction) await localTransaction.rollback();
      return { travelRoute: null, err: findError };
    }

    if (!existing) {
      if (localTransaction) await localTransaction.rollback();
      return { travelRoute: null, err: { message: "TravelRoute not found", status: 404 } };
    }

    const updateData = {
      originSubAreaOid: dto.originSubAreaOid ?? existing.originSubAreaOid,
      destinationSubAreaOid: dto.destinationSubAreaOid ?? existing.destinationSubAreaOid,
      distanceKm: dto.distanceKm ?? existing.distanceKm,
      estimatedTime: dto.estimatedTime ?? existing.estimatedTime,
      lastModifiedBy: userOid ?? existing.lastModifiedBy,
      updatedAt: now,
    };

    const { result: updateResult, err: updateError } = await travelRouteRepository.update(
      oid,
      updateData,
      currentTransaction ? { transaction: currentTransaction } : {}
    );

    if (updateError) {
      if (localTransaction) await localTransaction.rollback();
      return { travelRoute: null, err: updateError };
    }

    if (localTransaction) await localTransaction.commit();

    const msgData = { value: existing.oid, name: existing.originOid };
    const travelRoute = await messageMaps.toMessageResponse(msgData);

    return { travelRoute, err: null };

  } catch (err) {
    if (localTransaction) await localTransaction.rollback();
    console.error('Update failed:', err);
    return {
      travelRoute: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const deleted = async (oid) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { result: resultFind, err: errFind } = await travelRouteRepository.findById(oid, { transaction });
    if (errFind) {
      await transaction.rollback();
      return { travelRoute: null, err: errFind };
    }

    if (!resultFind) {
      await transaction.rollback();
      return {
        travelRoute: null,
        err: { message: 'Data Not Found', status: 404 }
      };
    }

    const { result, err } = await travelRouteRepository.remove(oid, { transaction });
    if (err) {
      await transaction.rollback();
      return { travelRoute: null, err };
    }

    await transaction.commit();

    const msgData = { value: resultFind.oid, name: resultFind.originOid };
    const travelRoute = await messageMaps.toMessageResponse(msgData);

    return { travelRoute, err: null };

  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Delete failed:', err);
    return {
      travelRoute: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await travelRouteRepository.findAll({
      include: [],
      order: [['createdAt', 'DESC']],
      attributes: TRAVEL_ROUTE_BASIC_FIELDS
    });

    if (err) return { travelRoutes: [], err };

    const travelRoutes = await mappings.toTravelRouteResponses(result);
    return { travelRoutes, err: null };
  } catch (err) {
    return {
      travelRoutes: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findById = async (oid, options = {}) => {
  try {
    const { result, err } = await travelRouteRepository.findById(oid, options);

    if (err) {
      return {
        travelRoute: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    if (!result) {
      return { travelRoute: null, err: null };
    }

    const travelRoute = await mappings.toTravelRouteResponse(result);

    return { travelRoute, err: null };
  } catch (err) {
    console.error('Error finding travelRoute:', err);
    return {
      travelRoute: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findPage = async (filters, options) => {
  try {
    const { search, ...restFilters } = filters;
    const normalizedFilters = search ? { ...restFilters, originOid: search } : filters;

    const where = buildFilterConditions(sequelize, normalizedFilters, false);
    options.include = [
      {
        model: SubArea,
        as: 'originSubArea',
        attributes: SUB_AREA_BASIC_FIELDS,
      }, {
        model: SubArea,
        as: 'destinationSubArea',
        attributes: SUB_AREA_BASIC_FIELDS,
      }
    ];
    const findOptions = buildFindOptions(where, options);

    const result = await travelRouteRepository.findAndCountByCriteria(findOptions);

    if (result.err) throw result.err;
    const travelRoutes = await mappings.toTravelRouteResponses(result.data);

    return {
      travelRoutes,
      count: result.count,
      err: null,
    };
  } catch (error) {
    console.error('TravelRouteService findPage error:', error);
    return {
      travelRoutes: [],
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
