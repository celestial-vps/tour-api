'use strict';
const hotelRepository = require('../repositories/hotel.repository');
const hotelRoomRepository = require('../repositories/hotel-room.repository')
const hotelRoomAmenetyRepository = require('../repositories/hotel-room-amenity.repository')
const hotelAmenetyRepository = require('../repositories/hotel-amenity.repository')

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

    // Simpan hotel terlebih dahulu
    const data = {
      hotelName: dto.hotelName,
      address: dto.address,
      phone: dto.phone,
      starRating: dto.starRating,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, err } = await hotelRepository.save(data, { transaction });
    if (err || !result) {
      await transaction.rollback();
      return {
        hotel: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    if (Array.isArray(dto.hotelmenities) && dto.hotelmenities.length > 0) {
      for (const hotel of dto.hotelmenities) {
        // Simpan room tanpa amenities terlebih dahulu
        const dataAmenity = {
          hotelOid: result.oid,
          hotelAmenityName: hotel, // pastikan key sesuai model           
        };

        const { result: resultRoomAmenety, err: errRoomAmenety } = await hotelAmenetyRepository.save(dataAmenity, { transaction });
        if (errRoomAmenety || !resultRoomAmenety) {
          await transaction.rollback();
          return {
            hotel: null,
            err: buildResponse.responseInternalServerError(errRoomAmenety).data.error,
          };
        }
      }
    }


    // Simpan hotelRooms dan amenities (jika ada)
    if (Array.isArray(dto.hotelRooms) && dto.hotelRooms.length > 0) {
      for (const room of dto.hotelRooms) {
        // Simpan room tanpa amenities terlebih dahulu
        const dataRoom = {
          hotelOid: result.oid,
          roomType: room.roomType, // pastikan key sesuai model
          capacity: room.capacity,
          pricePerNight: room.pricePerNight,
          createdBy: userOid,
          createdAt: now,
          lastModifiedBy: userOid,
          updatedAt: now,
        };

        const { result: resultRoom, err: errRoom } = await hotelRoomRepository.save(dataRoom, { transaction });
        if (errRoom || !resultRoom) {
          await transaction.rollback();
          return {
            hotel: null,
            err: buildResponse.responseInternalServerError(errRoom).data.error,
          };
        }

        // Simpan amenities jika ada dan amenities disimpan di tabel terpisah
        if (Array.isArray(room.amenities) && room.amenities.length > 0) {
          const amenitiesToSave = room.amenities.map(amenity => ({
            hotelRoomOid: resultRoom.oid, // gunakan oid dari room yang baru disimpan
            status: amenity,
            createdBy: userOid,
            createdAt: now,
            lastModifiedBy: userOid,
            updatedAt: now,
          }));

          const { err: errAmenity } = await hotelRoomAmenetyRepository.saveMany(amenitiesToSave, { transaction });
          if (errAmenity) {
            await transaction.rollback();
            return {
              hotel: null,
              err: buildResponse.responseInternalServerError(errAmenity).data.error,
            };
          }
        }
      }
    }

    await transaction.commit();

    const msgData = { value: result.oid, name: result.hotelName };
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
  let localTransaction = null;
  // @ts-ignore
  const now = new Date().formatUTC();

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

    if (findError || !existing) {
      if (localTransaction) await localTransaction.rollback();
      return {
        hotel: null,
        err: findError || { message: "Hotel not found", status: 404 },
      };
    }

    // Hapus semua amenities hotelRooms lama dulu (berdasarkan hotelRoomOid)
    const hotelRooms = await hotelRoomRepository.findAll({
      where: { hotelOid: existing.oid },
      attributes: ['oid'],
      transaction: currentTransaction,
    });
    const roomOids = hotelRooms.result.map(r => r.oid);

    if (roomOids.length > 0) {
      await hotelRoomAmenetyRepository.removeByRoomOids(roomOids, { transaction: currentTransaction });
    }

    // Hapus semua kamar dan amenities lama
    await hotelRoomRepository.removeByHotelId(existing.oid, { transaction: currentTransaction });


    const insertedRooms = [];

    if (Array.isArray(dto.hotelRooms) && dto.hotelRooms.length > 0) {
      for (const room of dto.hotelRooms) {
        const { amenities, ...roomData } = room;

        const savedRoom = await hotelRoomRepository.save(
          { ...roomData, hotelOid: existing.oid },
          { transaction: currentTransaction }
        );

        insertedRooms.push({ ...savedRoom.result.dataValues, amenities: room.amenities });
      }

      //  await hotelRoomAmenetyRepository.removeByHotelOid(existing.oid, { transaction: currentTransaction });


      const roomAmenitiesToSave = insertedRooms.flatMap(room =>
        (room.amenities || []).map(amenity => ({
          // @ts-ignore
          hotelRoomId: room.oid,
          status: amenity
        }))
      );

      if (roomAmenitiesToSave.length > 0) {
        await hotelRoomAmenetyRepository.saveMany(roomAmenitiesToSave, {
          transaction: currentTransaction
        });
      }
    }

    const updateData = {
      hotelName: dto.hotelName ?? existing.hotelName,
      address: dto.address ?? existing.address,
      phone: dto.phone ?? existing.phone,
      starRating: dto.starRating ?? existing.starRating,
      lastModifiedBy: userOid ?? existing.lastModifiedBy,
      updatedAt: now,
    };

    const { result: updateResult, err: updateError } = await hotelRepository.update(
      oid,
      updateData,
      { transaction: currentTransaction }
    );

    if (updateError) {
      if (localTransaction) await localTransaction.rollback();
      return { hotel: null, err: updateError };
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
        hotel: null,
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
    const hotels = await mappings.toHotelResponses(result.data);

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
