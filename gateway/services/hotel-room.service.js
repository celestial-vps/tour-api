'use strict';
const hotelRoomRepository = require('../repositories/hotel-room.repository');
const mappings = require('../mappings/hotel-room.vm');
const messageMaps = require('../mappings/message.vm');
const sequelize = require('../config/sequelize');
const moment = require('moment');
const { buildFilterConditions, buildFindOptions } = require('../misc/sequelizeFilterBuilder');
const buildResponse = require('../common/build.response');
const { HOTEL_ROOM_BASIC_FIELDS } = require('../constants/hotel-room.fields');

const create = async (dto, userOid) => {
  // @ts-ignore
  const now = new Date().formatUTC(); 
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const data = {
      hotelOid: dto.hotelOid,
      room_type: dto.room_type,
      capacity: dto.capacity,
      price_per_night: dto.price_per_night,
      amenities: dto.amenities,
      status: dto.status,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, err } = await hotelRoomRepository.save(data, { transaction });

    if (err || !result) {
      await transaction.rollback();
      return {
        HotelRoom: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    await transaction.commit();

    const msgData = { value: result.oid, name: result.room_type };
    const HotelRoom = await messageMaps.toMessageResponse(msgData);

    return { HotelRoom, err: null };

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Create failed:', error);
    return {
      HotelRoom: null,
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

    const { result: existing, err: findError } = await hotelRoomRepository.findById(oid, findOptions);

    if (findError) {
      if (localTransaction) await localTransaction.rollback();
      return { HotelRoom: null, err: findError };
    }

    if (!existing) {
      if (localTransaction) await localTransaction.rollback();
      return { HotelRoom: null, err: { message: "HotelRoom not found", status: 404 } };
    }

    const updateData = {
      hotelOid: dto.hotelOid ?? existing.hotelOid,
      room_type: dto.room_type ?? existing.room_type,
      capacity: dto.capacity ?? existing.capacity,
      price_per_night: dto.price_per_night ?? existing.price_per_night,
      amenities: dto.amenities ?? existing.amenities,
      status: dto.status ?? existing.status,
      lastModifiedBy: userOid ?? existing.lastModifiedBy,
      updatedAt: now,
    };

    const { result: updateResult, err: updateError } = await hotelRoomRepository.update(
      oid,
      updateData,
      currentTransaction ? { transaction: currentTransaction } : {}
    );

    if (updateError) {
      if (localTransaction) await localTransaction.rollback();
      return { HotelRoom: null, err: updateError };
    }

    if (localTransaction) await localTransaction.commit();

    const msgData = { value: existing.oid, name: existing.room_type };
    const HotelRoom = await messageMaps.toMessageResponse(msgData);

    return { HotelRoom, err: null };

  } catch (err) {
    if (localTransaction) await localTransaction.rollback();
    console.error('Update failed:', err);
    return {
      HotelRoom: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const deleted = async (oid) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { result: resultFind, err: errFind } = await hotelRoomRepository.findById(oid, { transaction });
    if (errFind) {
      await transaction.rollback();
      return { HotelRoom: null, err: errFind };
    }

    if (!resultFind) {
      await transaction.rollback();
      return {
        HotelRoom: null,
        err: { message: 'Data Not Found', status: 404 }
      };
    }

    const { result, err } = await hotelRoomRepository.remove(oid, { transaction });
    if (err) {
      await transaction.rollback();
      return { HotelRoom: null, err };
    }

    await transaction.commit();

    const msgData = { value: resultFind.oid, name: resultFind.room_type };
    const HotelRoom = await messageMaps.toMessageResponse(msgData);

    return { HotelRoom, err: null };

  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Delete failed:', err);
    return {
      HotelRoom: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await hotelRoomRepository.findAll({
      include: [],
      order: [['createdAt', 'DESC']],
      attributes: HOTEL_ROOM_BASIC_FIELDS
    });

    if (err) return { HotelRooms: [], err };

    const HotelRooms = await mappings.toHotelRoomResponses(result);
    return { HotelRooms, err: null };
  } catch (err) {
    return {
      HotelRooms: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findById = async (oid, options = {}) => {
  try {
    const { result, err } = await hotelRoomRepository.findById(oid, options);

    if (err) {
      return {
        HotelRoom: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    if (!result) {
      return { HotelRoom: null, err: null };
    }

    const HotelRoom = await mappings.toHotelRoomResponse(result);

    return { HotelRoom, err: null };
  } catch (err) {
    console.error('Error finding HotelRoom:', err);
    return {
      HotelRoom: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findPage = async (filters, options) => {
  try {
    const { search, ...restFilters } = filters;
    const normalizedFilters = search ? { ...restFilters, room_type: search } : filters;

    const where = buildFilterConditions(sequelize, normalizedFilters, false);
    const findOptions = buildFindOptions(where, options);

    const result = await hotelRoomRepository.findAndCountByCriteria(findOptions);

    if (result.err) throw result.err;

    return {
      hotelRooms: result.data,
      count: result.count,
      err: null,
    };
  } catch (error) {
    console.error('HotelRoomService findPage error:', error);
    return {
      HotelRooms: [],
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
