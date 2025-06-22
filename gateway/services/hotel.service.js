'use strict';
const hotelRepository = require('../repositories/hotel.repository');
const mappings = require('../mappings/hotel.vm');
const messageMaps = require('../mappings/message.vm');
const sequelize = require('../config/sequelize');
const moment = require('moment');
const { buildFilterConditions, buildFindOptions } = require('../misc/sequelizeFilterBuilder');
const buildResponse = require('../common/build.response');
const { HOTEL_BASIC_FIELDS } = require('../constants/hotel.fields');

const create = async (dto, userOid) => {
  // @ts-ignore
  const now = new Date().formatUTC(); 
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const data = {
      hotelName: dto.hotelName,
      address: dto.address,
      phone: dto.phone,
      star_rating: dto.star_rating,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, err } = await hotelRepository.save(data, { transaction });

    if (err || !result) {
      await transaction.rollback();
      return {
        Hotel: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    await transaction.commit();

    const msgData = { value: result.oid, name: result.address };
    const hotel = await messageMaps.toMessageResponse(msgData);

    return { hotel, err: null };

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Create failed:', error);
    return {
      hotel: null,
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

    const { result: existing, err: findError } = await hotelRepository.findById(oid, findOptions);

    if (findError) {
      if (localTransaction) await localTransaction.rollback();
      return { Hotel: null, err: findError };
    }

    if (!existing) {
      if (localTransaction) await localTransaction.rollback();
      return { Hotel: null, err: { message: "Hotel not found", status: 404 } };
    }

    const updateData = {
      hotelName: dto.hotelName ?? existing.hotelName,
      address: dto.address ?? existing.address,
      phone: dto.phone ?? existing.phone,
      star_rating: dto.star_rating ?? existing.star_rating,
      lastModifiedBy: userOid ?? existing.lastModifiedBy,
      updatedAt: now,
    };

    const { result: updateResult, err: updateError } = await hotelRepository.update(
      oid,
      updateData,
      currentTransaction ? { transaction: currentTransaction } : {}
    );

    if (updateError) {
      if (localTransaction) await localTransaction.rollback();
      return { Hotel: null, err: updateError };
    }

    if (localTransaction) await localTransaction.commit();

    const msgData = { value: existing.oid, name: existing.address };
    const hotel = await messageMaps.toMessageResponse(msgData);

    return { hotel, err: null };

  } catch (err) {
    if (localTransaction) await localTransaction.rollback();
    console.error('Update failed:', err);
    return {
      hotel: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const deleted = async (oid) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { result: resultFind, err: errFind } = await hotelRepository.findById(oid, { transaction });
    if (errFind) {
      await transaction.rollback();
      return { Hotel: null, err: errFind };
    }

    if (!resultFind) {
      await transaction.rollback();
      return {
        Hotel: null,
        err: { message: 'Data Not Found', status: 404 }
      };
    }

    const { result, err } = await hotelRepository.remove(oid, { transaction });
    if (err) {
      await transaction.rollback();
      return { Hotel: null, err };
    }

    await transaction.commit();

    const msgData = { value: resultFind.oid, name: resultFind.address };
    const hotel = await messageMaps.toMessageResponse(msgData);

    return { hotel, err: null };

  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Delete failed:', err);
    return {
      hotel: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await hotelRepository.findAll({
      include: [],
      order: [['createdAt', 'DESC']],
      attributes: HOTEL_BASIC_FIELDS
    });

    if (err) return { hotels: [], err };

    const hotels = await mappings.toHotelResponses(result);
    return { hotels, err: null };
  } catch (err) {
    return {
      hotels: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findById = async (oid, options = {}) => {
  try {
    const { result, err } = await hotelRepository.findById(oid, options);

    if (err) {
      return {
        Hotel: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    if (!result) {
      return { hotel: null, err: null };
    }

    const hotel = await mappings.toHotelResponse(result);

    return { hotel, err: null };
  } catch (err) {
    console.error('Error finding Hotel:', err);
    return {
      hotel: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findPage = async (filters, options) => {
  try {
    const { search, ...restFilters } = filters;
    const normalizedFilters = search ? { ...restFilters, address: search } : filters;

    const where = buildFilterConditions(sequelize, normalizedFilters, false);
    const findOptions = buildFindOptions(where, options);

    const result = await hotelRepository.findAndCountByCriteria(findOptions);

    if (result.err) throw result.err;

    return {
      hotels: result.data,
      count: result.count,
      err: null,
    };
  } catch (error) {
    console.error('HotelService findPage error:', error);
    return {
      hotels: [],
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
