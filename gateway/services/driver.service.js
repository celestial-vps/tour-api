'use strict';
const driverRepository = require('../repositories/driver.repository');
const userRepository = require('../repositories/user.repository');

const mappings = require('../mappings/driver.vm');
const messageMaps = require('../mappings/message.vm');
const sequelize = require('../config/sequelize');
const moment = require('moment');
const { buildFilterConditions, buildFindOptions } = require('../misc/sequelizeFilterBuilder');
const buildResponse = require('../common/build.response');
const { DRIVER_BASIC_FIELDS } = require('../constants/driver.fields');
const { hashPassword } = require('../misc/password');

const create = async (dto, userOid) => {
  // @ts-ignore
  const now = new Date().formatUTC();
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const hashedPassword = await hashPassword("123456");
    const dataUser = {
      name: dto.name ?? null,
      email: dto.email,
      password: hashedPassword,
      birthday: dto.birthday ?? null,
      memberNumber: dto.memberNumber ?? null,
      androidToken: dto.androidToken ?? null,
      expiredTime: dto.expiredTime ?? null,
      isActive: dto.isActive,
      activatedAt: dto.activatedAt,
      roleOid: '18d756c1-4f4f-46b1-8a5e-556b2fea264e',
      description: dto.description ?? null,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result: resultUser, err: errUser } = await userRepository.save(dataUser, { transaction });

    if (errUser || !resultUser) {
      await transaction.rollback();
      return {
        driver: null,
        err: buildResponse.responseInternalServerError(errUser).data.error,
      };
    }

    const data = {
      licenseNumber: dto.licenseNumber,
      licenseExpiry: dto.licenseExpiry,  
      hiredAt: dto.hiredAt,
      // terminatedAt: dto.terminatedAt,
      // ratingAvg: dto.ratingAvg,
      // totalTrips: dto.totalTrips,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, err } = await driverRepository.save(data, { transaction });

    if (err || !result) {
      await transaction.rollback();
      return {
        driver: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }


    await transaction.commit();

    const msgData = { value: result.oid, name: result.userOid };
    const driver = await messageMaps.toMessageResponse(msgData);

    return { driver, err: null };

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Create failed:', error);
    return {
      driver: null,
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

    const { result: existing, err: findError } = await driverRepository.findById(oid, findOptions);

    if (findError) {
      if (localTransaction) await localTransaction.rollback();
      return { driver: null, err: findError };
    }

    if (!existing) {
      if (localTransaction) await localTransaction.rollback();
      return { driver: null, err: { message: "Driver not found", status: 404 } };
    }

    const updateData = {      
      licenseNumber: dto.licenseNumber ?? existing.licenseNumber,
      licenseExpiry: dto.licenseExpiry ?? existing.licenseExpiry,    
      status: dto.status ?? existing.status,
      hiredAt: dto.hiredAt ?? existing.hiredAt,
      terminatedAt: dto.terminatedAt ?? existing.terminatedAt,
      ratingAvg: dto.ratingAvg ?? existing.ratingAvg,
      totalTrips: dto.totalTrips ?? existing.totalTrips,
      lastModifiedBy: userOid ?? existing.lastModifiedBy,
      updatedAt: now,
    };

    const { result: updateResult, err: updateError } = await driverRepository.update(
      oid,
      updateData,
      currentTransaction ? { transaction: currentTransaction } : {}
    );

    if (updateError) {
      if (localTransaction) await localTransaction.rollback();
      return { driver: null, err: updateError };
    }

    if (localTransaction) await localTransaction.commit();

    const msgData = { value: existing.oid, name: existing.userOid };
    const driver = await messageMaps.toMessageResponse(msgData);

    return { driver, err: null };

  } catch (err) {
    if (localTransaction) await localTransaction.rollback();
    console.error('Update failed:', err);
    return {
      driver: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const deleted = async (oid) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { result: resultFind, err: errFind } = await driverRepository.findById(oid, { transaction });
    if (errFind) {
      await transaction.rollback();
      return { driver: null, err: errFind };
    }

    if (!resultFind) {
      await transaction.rollback();
      return {
        driver: null,
        err: { message: 'Data Not Found', status: 404 }
      };
    }

    const { result, err } = await driverRepository.remove(oid, { transaction });
    if (err) {
      await transaction.rollback();
      return { driver: null, err };
    }

    await transaction.commit();

    const msgData = { value: resultFind.oid, name: resultFind.userOid };
    const driver = await messageMaps.toMessageResponse(msgData);

    return { driver, err: null };

  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Delete failed:', err);
    return {
      driver: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await driverRepository.findAll({
      include: [],
      order: [['createdAt', 'DESC']],
      attributes: DRIVER_BASIC_FIELDS
    });

    if (err) return { drivers: [], err };

    const drivers = await mappings.toDriverResponses(result);
    return { drivers, err: null };
  } catch (err) {
    return {
      drivers: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findById = async (oid, options = {}) => {
  try {
    const { result, err } = await driverRepository.findById(oid, options);

    if (err) {
      return {
        driver: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    if (!result) {
      return { driver: null, err: null };
    }

    const driver = await mappings.toDriverResponse(result);

    return { driver, err: null };
  } catch (err) {
    console.error('Error finding driver:', err);
    return {
      driver: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findPage = async (filters, options) => {
  try {
    const { search, ...restFilters } = filters;
    const normalizedFilters = search ? { ...restFilters, userOid: search } : filters;

    const where = buildFilterConditions(sequelize, normalizedFilters, false);
    const findOptions = buildFindOptions(where, options);

    const result = await driverRepository.findAndCountByCriteria(findOptions);

    if (result.err) throw result.err;
    const drivers = await mappings.toDriverResponses(result.data);
    return {
      drivers,
      count: result.count,
      err: null,
    };
  } catch (error) {
    console.error('DriverService findPage error:', error);
    return {
      drivers: [],
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
