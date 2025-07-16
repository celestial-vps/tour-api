'use strict';
const travelPromoRepository = require('../repositories/travel-promo.repository');
const mappings = require('../mappings/travel-promo.vm');
const messageMaps = require('../mappings/message.vm');
const sequelize = require('../config/sequelize');
const moment = require('moment');
const { buildFilterConditions, buildFindOptions } = require('../misc/sequelizeFilterBuilder');
const buildResponse = require('../common/build.response');
const { TRAVEL_PROMO_BASIC_FIELDS } = require('../constants/travel-promo.fields');

const create = async (dto, userOid) => {
  const now = new Date().formatUTC();
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const data = {
      code: dto.code,
      discountType: dto.discountType,
      discountValue: dto.discountValue,
      usageLimit: dto.usageLimit,
      usedCount: dto.usedCount,
      validFrom: dto.validFrom,
      validUntil: dto.validUntil,
      isActive: dto.isActive,
      description: dto.description,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, err } = await travelPromoRepository.save(data, { transaction });

    if (err || !result) {
      await transaction.rollback();
      return {
        travelPromo: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    await transaction.commit();

    const msgData = { value: result.oid, name: result.code };
    const travelPromo = await messageMaps.toMessageResponse(msgData);

    return { travelPromo, err: null };

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Create failed:', error);
    return {
      travelPromo: null,
      err: buildResponse.responseInternalServerError(error).data.error,
    };
  }
};

const update = async (oid, dto, userOid, options = {}) => {
  const { transaction = null, useTransaction = false } = options;
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

    const { result: existing, err: findError } = await travelPromoRepository.findById(oid, findOptions);

    if (findError) {
      if (localTransaction) await localTransaction.rollback();
      return { travelPromo: null, err: findError };
    }

    if (!existing) {
      if (localTransaction) await localTransaction.rollback();
      return { travelPromo: null, err: { message: "TravelPromo not found", status: 404 } };
    }

    const updateData = {
      code: dto.code ?? existing.code,
      discountType: dto.discountType ?? existing.discountType,
      discountValue: dto.discountValue ?? existing.discountValue,
      usageLimit: dto.usageLimit ?? existing.usageLimit,
      usedCount: dto.usedCount ?? existing.usedCount,
      validFrom: dto.validFrom ?? existing.validFrom,
      validUntil: dto.validUntil ?? existing.validUntil,
      isActive: dto.isActive ?? existing.isActive,
      description: dto.description ?? existing.description,
      lastModifiedBy: userOid ?? existing.lastModifiedBy,
      updatedAt: now,
    };

    const { result: updateResult, err: updateError } = await travelPromoRepository.update(
      oid,
      updateData,
      currentTransaction ? { transaction: currentTransaction } : {}
    );

    if (updateError) {
      if (localTransaction) await localTransaction.rollback();
      return { travelPromo: null, err: updateError };
    }

    if (localTransaction) await localTransaction.commit();

    const msgData = { value: existing.oid, name: existing.code };
    const travelPromo = await messageMaps.toMessageResponse(msgData);

    return { travelPromo, err: null };

  } catch (err) {
    if (localTransaction) await localTransaction.rollback();
    console.error('Update failed:', err);
    return {
      travelPromo: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const deleted = async (oid) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { result: resultFind, err: errFind } = await travelPromoRepository.findById(oid, { transaction });
    if (errFind) {
      await transaction.rollback();
      return { travelPromo: null, err: errFind };
    }

    if (!resultFind) {
      await transaction.rollback();
      return {
        travelPromo: null,
        err: { message: 'Data Not Found', status: 404 }
      };
    }

    const { result, err } = await travelPromoRepository.remove(oid, { transaction });
    if (err) {
      await transaction.rollback();
      return { travelPromo: null, err };
    }

    await transaction.commit();

    const msgData = { value: resultFind.oid, name: resultFind.code };
    const travelPromo = await messageMaps.toMessageResponse(msgData);

    return { travelPromo, err: null };

  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Delete failed:', err);
    return {
      travelPromo: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await travelPromoRepository.findAll({
      include: [],
      order: [['createdAt', 'DESC']],
      attributes: TRAVEL_PROMO_BASIC_FIELDS
    });

    if (err) return { travelPromos: [], err };

    const travelPromos = await mappings.toTravelPromoResponses(result);
    return { travelPromos, err: null };
  } catch (err) {
    return {
      travelPromos: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findById = async (oid, options = {}) => {
  try {
    const { result, err } = await travelPromoRepository.findById(oid, options);

    if (err) {
      return {
        travelPromo: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    if (!result) {
      return { travelPromo: null, err: null };
    }

    const travelPromo = await mappings.toTravelPromoResponse(result);

    return { travelPromo, err: null };
  } catch (err) {
    console.error('Error finding travelPromo:', err);
    return {
      travelPromo: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findPage = async (filters, options) => {
  try {
    const { search, ...restFilters } = filters;
    const normalizedFilters = search ? { ...restFilters, code: search } : filters;

    const where = buildFilterConditions(sequelize, normalizedFilters, false);
    const findOptions = buildFindOptions(where, options);

    const result = await travelPromoRepository.findAndCountByCriteria(findOptions);

    if (result.err) throw result.err;

    return {
      travelPromos: result.data,
      count: result.count,
      err: null,
    };
  } catch (error) {
    console.error('TravelPromoService findPage error:', error);
    return {
      travelPromos: [],
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
