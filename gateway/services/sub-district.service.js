'use strict';
const subDistrictRepository = require('../repositories/sub-district.repository');
const mappings = require('../mappings/sub-district.vm');
const messageMaps = require('../mappings/message.vm');
const sequelize = require('../config/sequelize');
const moment = require('moment');
const { buildFilterConditions, buildFindOptions } = require('../misc/sequelizeFilterBuilder');
const buildResponse = require('../common/build.response');
const { SUBDISTRICT_BASIC_FIELDS } = require('../constants/sub-district.fields');
const { DISTRICT_BASIC_FIELDS } = require('../constants/district.fields');
const { District } = require('../models');

const create = async (dto, userOid) => {
  // @ts-ignore
  const now = new Date().formatUTC(); 
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const data = {
      districtOid: dto.districtOid,
      subDistrictName: dto.subDistrictName,
      postalCode: dto.postalCode,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, err } = await subDistrictRepository.save(data, { transaction });

    if (err || !result) {
      await transaction.rollback();
      return {
        subDistrict: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    await transaction.commit();

    const msgData = { value: result.oid, name: result.subDistrictName };
    const subDistrict = await messageMaps.toMessageResponse(msgData);

    return { subDistrict, err: null };

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Create failed:', error);
    return {
      subDistrict: null,
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

    const { result: existing, err: findError } = await subDistrictRepository.findById(oid, findOptions);

    if (findError) {
      if (localTransaction) await localTransaction.rollback();
      return { subDistrict: null, err: findError };
    }

    if (!existing) {
      if (localTransaction) await localTransaction.rollback();
      return { subDistrict: null, err: { message: "Sub District not found", status: 404 } };
    }

    const updateData = {
      districtOid: dto.districtOid ?? existing.districtOid,
      subDistrictName: dto.subDistrictName ?? existing.subDistrictName,
      postalCode: dto.postalCode ?? existing.postalCode,
      lastModifiedBy: userOid ?? existing.lastModifiedBy,
      updatedAt: now,
    };

    const { result: updateResult, err: updateError } = await subDistrictRepository.update(
      oid,
      updateData,
      currentTransaction ? { transaction: currentTransaction } : {}
    );

    if (updateError) {
      if (localTransaction) await localTransaction.rollback();
      return { subDistrict: null, err: updateError };
    }

    if (localTransaction) await localTransaction.commit();

    const msgData = { value: existing.oid, name: existing.subDistrictName };
    const subDistrict = await messageMaps.toMessageResponse(msgData);

    return { subDistrict, err: null };

  } catch (err) {
    if (localTransaction) await localTransaction.rollback();
    console.error('Update failed:', err);
    return {
      subDistrict: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const deleted = async (oid) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { result: resultFind, err: errFind } = await subDistrictRepository.findById(oid, { transaction });
    if (errFind) {
      await transaction.rollback();
      return { subDistrict: null, err: errFind };
    }

    if (!resultFind) {
      await transaction.rollback();
      return {
        subDistrict: null,
        err: { message: 'Data Not Found', status: 404 }
      };
    }

    const { result, err } = await subDistrictRepository.remove(oid, { transaction });
    if (err) {
      await transaction.rollback();
      return { subDistrict: null, err };
    }

    await transaction.commit();

    const msgData = { value: resultFind.oid, name: resultFind.subDistrictName };
    const subDistrict = await messageMaps.toMessageResponse(msgData);

    return { subDistrict, err: null };

  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Delete failed:', err);
    return {
      subDistrict: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await subDistrictRepository.findAll({
      include: [],
      order: [['createdAt', 'DESC']],
      attributes: SUBDISTRICT_BASIC_FIELDS
    });

    if (err) return { SubDistricts: [], err };

    const subDistrict = await mappings.toSubDistrictResponses(result);
    return { subDistrict, err: null };
  } catch (err) {
    return {
      subDistrict: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findById = async (oid, options = {}) => {
  try {
    options.include = [
      {
        model: District,
        as: 'district',
        attributes: DISTRICT_BASIC_FIELDS,
      }
    ];

    const { result, err } = await subDistrictRepository.findById(oid, options);

    if (err) {
      return {
        subDistrict: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    if (!result) {
      return { subDistrict: null, err: null };
    }

    const subDistrict = await mappings.toSubDistrictResponse(result);

    return { subDistrict, err: null };
  } catch (err) {
    console.error('Error finding SubDistrict:', err);
    return {
      subDistrict: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findPage = async (filters, options) => {
  try {
    const { search, ...restFilters } = filters;
    const normalizedFilters = search ? { ...restFilters, subDistrictName: search } : filters;

    const where = buildFilterConditions(sequelize, normalizedFilters, false);

    options.include = [
      {
        model: District,
        as: 'district',
        attributes: DISTRICT_BASIC_FIELDS,
      }
    ];
    const findOptions = buildFindOptions(where, options);

    const result = await subDistrictRepository.findAndCountByCriteria(findOptions);

    if (result.err) throw result.err;
    const subDistricts = await mappings.toSubDistrictResponses(result.data);

    return {
      subDistricts,
      count: result.count,
      err: null,
    };
  } catch (error) {
    console.error('SubDistrictService findPage error:', error);
    return {
      SubDistricts: [],
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
