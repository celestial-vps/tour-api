'use strict';
const travelBookingRepository = require('../repositories/travel-booking.repository.js');
const customerRepository = require('../repositories/customer.repository.js');
const userRepository = require('../repositories/user.repository.js');

const mappings = require('../mappings/travel-booking.vm..js');
const messageMaps = require('../mappings/message.vm');
const sequelize = require('../config/sequelize');
const moment = require('moment');
const { buildFilterConditions, buildFindOptions } = require('../misc/sequelizeFilterBuilder');
const buildResponse = require('../common/build.response');
const { TRAVEL_BOOKING_BASIC_FIELDS } = require('../constants/travel-booking.fields.js');
const { hashPassword } = require('../misc/password.js');
const { Op } = require('sequelize');

const create = async (dto, userOid) => {
    // @ts-ignore
    const now = new Date().formatUTC();
    let transaction;

    try {
        transaction = await sequelize.transaction();

        const data = {
            code: dto.code,
            customerOid: dto.customerOid,
            scheduleOid: dto.scheduleOid,
            seatNumber: dto.seatNumber,
            status: dto.status,
            paymentStatus: dto.paymentStatus,
            bookedAt: dto.bookedAt,
            createdBy: userOid,
            createdAt: now,
            lastModifiedBy: userOid,
            updatedAt: now,
        };

        const { result, err } = await travelBookingRepository.save(data, { transaction });

        if (err || !result) {
            await transaction.rollback();
            return {
                travelBooking: null,
                err: buildResponse.responseInternalServerError(err).data.error,
            };
        }

        await transaction.commit();

        const msgData = { value: result.oid, name: result.code };
        const travelBooking = await messageMaps.toMessageResponse(msgData);

        return { travelBooking, err: null };

    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error('Create failed:', error);
        return {
            travelBooking: null,
            err: buildResponse.responseInternalServerError(error).data.error,
        };
    }
};


const createNoAuth = async (dtos) => {
    // @ts-ignore
    const now = new Date().formatUTC();
    let transaction;
    let customerOid = null;

    try {
        transaction = await sequelize.transaction();
        const dataUser = {
            email: dtos[0].email,
        }
        const { result: userResult, err } = await userRepository.advanceFlter(dataUser);

        if (err) {
            await transaction.rollback();
            return {
                travelBooking: null,
                err: buildResponse.responseInternalServerError(err).data.error,
            };
        }

        if (userResult && Array.isArray(userResult) && userResult.length > 0) {
            // const { customerData, err } = await customerRepository.advanceFlter(users[0].email);
            // if (err) {
            //     await transaction.rollback();
            //     return {
            //         travelBooking: null,
            //         err: buildResponse.responseInternalServerError(err).data.error,
            //     };
            // }
            const dataCustomer = {
                alamat: dtos[0].alamat,
                nama: dtos[0].nama,
                noHp: dtos[0].noHp,
                userOid: userResult[0].oid,
                email: dtos[0].email,
            };
            const { result: customerResult, errFilter } = await customerRepository.advanceFlter(dataCustomer.email);

            if (errFilter) {
                await transaction.rollback();
                return {
                    travelBooking: null,
                    err: buildResponse.responseInternalServerError(err).data.error,
                };
            }
            if (customerResult && Array.isArray(customerResult) && customerResult.length > 0) {
                customerOid = customerResult[0].oid;
            } else {
                const dataCustomer = {
                    alamat: dtos[0].alamat,
                    nama: dtos[0].nama,
                    noHp: dtos[0].noHp,
                    userOid: userResult[0].oid,
                };
                const { result: savedCustomer, err:errSave } = await customerRepository.save(dataCustomer, { transaction });
                if (errSave) {
                    await transaction.rollback();
                    return {
                        travelBooking: null,
                        err: buildResponse.responseInternalServerError(err).data.error,
                    };
                }
                customerOid = savedCustomer.oid;
            }


        } else {
            const hashedPassword = await hashPassword("123456");
            const dataUser = {
                name: dtos[0].nama ?? null,
                email: dtos[0].email,
                password: hashedPassword,
                birthday: dtos[0].birthday ?? null,
                androidToken: dtos[0].androidToken ?? null,
                expiredTime: dtos[0].expiredTime ?? null,
                isActive: dtos[0].isActive,
                activatedAt: dtos[0].activatedAt,
                roleOid: '3d626a33-393a-4450-bc3a-5979891be3cd',
                description: dtos[0].description ?? null
            };
            const { result: resultUser, err: errUser } = await userRepository.save(dataUser, { transaction });
            if (errUser) {
                await transaction.rollback();
                return {
                    travelBooking: null,
                    err: buildResponse.responseInternalServerError(errUser).data.error,
                };
            }
            const dataCustomer = {
                customerAddress: dtos[0].alamat,
                customerName: dtos[0].nama,
                customerPhone: dtos[0].noHp,
                customerEmail: dtos[0].email,
                userOid: resultUser.oid,
            };
            const { result, errSave } = await customerRepository.save(dataCustomer, { transaction });
            if (errSave) {
                await transaction.rollback();
                return {
                    travelBooking: null,
                    err: buildResponse.responseInternalServerError(err).data.error,
                };
            }
            customerOid = result.oid;
        }



        for (const dto of dtos) {
            const data = {
                customerOid: customerOid,
                scheduleOid: dto.scheduleOid,
                seatNumber: dto.seatNumber,
                status: dto.status,
                paymentStatus: dto.paymentStatus,
                bookedAt: dto.bookedAt,
            };
            const { result:resultBooking, err:errBooking } = await travelBookingRepository.save(data, { transaction });
            if (errBooking || !resultBooking) {
                await transaction.rollback();
                return {
                    travelBooking: null,
                    err: buildResponse.responseInternalServerError(err).data.error,
                };
            }
        }



        await transaction.commit();

        // const msgData = { value: result.oid, name: result.code };
        // const travelBooking = await messageMaps.toMessageResponse(msgData);

        return { travelBooking: dtos, err: null };

    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error('Create failed:', error);
        return {
            travelBooking: null,
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

        const { result: existing, err: findError } = await travelBookingRepository.findById(oid, findOptions);

        if (findError) {
            if (localTransaction) await localTransaction.rollback();
            return { travelBooking: null, err: findError };
        }

        if (!existing) {
            if (localTransaction) await localTransaction.rollback();
            return { travelBooking: null, err: { message: "TravelBooking not found", status: 404 } };
        }

        const updateData = {
            code: dto.code ?? existing.code,
            customerOid: dto.customerOid ?? existing.customerOid,
            scheduleOid: dto.scheduleOid ?? existing.scheduleOid,
            seatNumber: dto.seatNumber ?? existing.seatNumber,
            status: dto.status ?? existing.status,
            paymentStatus: dto.paymentStatus ?? existing.paymentStatus,
            bookedAt: dto.bookedAt ?? existing.bookedAt,
            lastModifiedBy: userOid ?? existing.lastModifiedBy,
            updatedAt: now,
        };

        const { result: updateResult, err: updateError } = await travelBookingRepository.update(
            oid,
            updateData,
            currentTransaction ? { transaction: currentTransaction } : {}
        );

        if (updateError) {
            if (localTransaction) await localTransaction.rollback();
            return { travelBooking: null, err: updateError };
        }

        if (localTransaction) await localTransaction.commit();

        const msgData = { value: existing.oid, name: existing.code };
        const travelBooking = await messageMaps.toMessageResponse(msgData);

        return { travelBooking, err: null };

    } catch (err) {
        if (localTransaction) await localTransaction.rollback();
        console.error('Update failed:', err);
        return {
            travelBooking: null,
            err: buildResponse.responseInternalServerError(err).data.error,
        };
    }
};

const deleted = async (oid) => {
    let transaction;

    try {
        transaction = await sequelize.transaction();

        const { result: resultFind, err: errFind } = await travelBookingRepository.findById(oid, { transaction });
        if (errFind) {
            await transaction.rollback();
            return { travelBooking: null, err: errFind };
        }

        if (!resultFind) {
            await transaction.rollback();
            return {
                travelBooking: null,
                err: { message: 'Data Not Found', status: 404 }
            };
        }

        const { result, err } = await travelBookingRepository.remove(oid, { transaction });
        if (err) {
            await transaction.rollback();
            return { travelBooking: null, err };
        }

        await transaction.commit();

        const msgData = { value: resultFind.oid, name: resultFind.code };
        const travelBooking = await messageMaps.toMessageResponse(msgData);

        return { travelBooking, err: null };

    } catch (err) {
        if (transaction) await transaction.rollback();
        console.error('Delete failed:', err);
        return {
            travelBooking: null,
            err: buildResponse.responseInternalServerError(err).data.error,
        };
    }
};

const findAll = async () => {
    try {
        const { result, err } = await travelBookingRepository.findAll({
            include: [],
            order: [['createdAt', 'DESC']],
            attributes: TRAVEL_BOOKING_BASIC_FIELDS
        });

        if (err) return { travelBookings: [], err };

        const travelBookings = await mappings.toTravelBookingResponses(result);
        return { travelBookings, err: null };
    } catch (err) {
        return {
            travelBookings: [],
            err: buildResponse.responseInternalServerError(err).data.error,
        };
    }
};

const findById = async (oid, options = {}) => {
    try {
        const { result, err } = await travelBookingRepository.findById(oid, options);

        if (err) {
            return {
                travelBooking: null,
                err: buildResponse.responseInternalServerError(err).data.error,
            };
        }

        if (!result) {
            return { travelBooking: null, err: null };
        }

        const travelBooking = await mappings.toTravelBookingResponse(result);

        return { travelBooking, err: null };
    } catch (err) {
        console.error('Error finding travelBooking:', err);
        return {
            travelBooking: null,
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

        const result = await travelBookingRepository.findAndCountByCriteria(findOptions);

        if (result.err) throw result.err;

        return {
            travelBookings: result.data,
            count: result.count,
            err: null,
        };
    } catch (error) {
        console.error('TravelBookingService findPage error:', error);
        return {
            travelBookings: [],
            count: 0,
            err: buildResponse.responseInternalServerError(error).data.error,
        };
    }
};
const findTopFive = async (filters, options) => {
  try {
    const { search, startDate, endDate, ...restFilters } = filters;

    // Normalize filters
    const normalizedFilters = search ? { ...restFilters, code: search } : restFilters;

    // Build where conditions
    const where = buildFilterConditions(sequelize, normalizedFilters, false);

    // Tambahkan filter tanggal
    if (startDate && endDate) {
      where.bookedAt = {
        [Op.between]: [startDate, endDate],
      };
    }

    // Build options (if needed for association or future flexibility)
    const findOptions = {
      ...buildFindOptions(where, options),
      limit: 5,
    };

    // Panggil repository khusus Top 5
    const result = await travelBookingRepository.findTopFive(findOptions);

    if (result.err) throw result.err;

    return {
      travelBookings: result.data,
      count: result.count || result.data.length,
      err: null,
    };
  } catch (error) {
    console.error('TravelBookingService findTopFive error:', error);
    return {
      travelBookings: [],
      count: 0,
      err: buildResponse.responseInternalServerError(error).data.error,
    };
  }
};


module.exports = {
    create,
    createNoAuth,
    update,
    deleted,
    findAll,
    findById,
    findPage,
    findTopFive
};
