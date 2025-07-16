'use strict';
const brandRepository = require('../repositories/brand.repository');
const mappings = require('../mappings/brand.vm');
const messageMaps = require('../mappings/message.vm');
const sequelize = require('../config/sequelize');
const moment = require('moment');
const { buildFilterConditions, buildFindOptions } = require('../misc/sequelizeFilterBuilder');
const buildResponse = require('../common/build.response');
const { BRAND_BASIC_FIELDS } = require('../constants/brand.fields');
const { getImageFile } = require('../middleware/image-file/image-file-mc.service');


const create = async (dto, userOid) => {
  // @ts-ignore
  const now = new Date().formatUTC();
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const data = {
      brandName: dto.brandName,
      imageOid: dto.imageOid,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, err } = await brandRepository.save(data, { transaction });

    if (err || !result) {
      await transaction.rollback();
      return {
        Brand: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    await transaction.commit();

    const msgData = { value: result.oid, name: result.undefined };
    const Brand = await messageMaps.toMessageResponse(msgData);

    return { Brand, err: null };

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Create failed:', error);
    return {
      Brand: null,
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

    const { result: existing, err: findError } = await brandRepository.findById(oid, findOptions);

    if (findError) {
      if (localTransaction) await localTransaction.rollback();
      return { Brand: null, err: findError };
    }

    if (!existing) {
      if (localTransaction) await localTransaction.rollback();
      return { Brand: null, err: { message: "Brand not found", status: 404 } };
    }

    const updateData = {
      brandName: dto.brandName ?? existing.brandName,
      imageOid: dto.imageOid ?? existing.imageOid,
      lastModifiedBy: userOid ?? existing.lastModifiedBy,
      updatedAt: now,
    };

    const { result: updateResult, err: updateError } = await brandRepository.update(
      oid,
      updateData,
      currentTransaction ? { transaction: currentTransaction } : {}
    );

    if (updateError) {
      if (localTransaction) await localTransaction.rollback();
      return { Brand: null, err: updateError };
    }

    if (localTransaction) await localTransaction.commit();

    const msgData = { value: existing.oid, name: existing.undefined };
    const Brand = await messageMaps.toMessageResponse(msgData);

    return { Brand, err: null };

  } catch (err) {
    if (localTransaction) await localTransaction.rollback();
    console.error('Update failed:', err);
    return {
      Brand: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const deleted = async (oid) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { result: resultFind, err: errFind } = await brandRepository.findById(oid, { transaction });
    if (errFind) {
      await transaction.rollback();
      return { Brand: null, err: errFind };
    }

    if (!resultFind) {
      await transaction.rollback();
      return {
        Brand: null,
        err: { message: 'Data Not Found', status: 404 }
      };
    }

    const { result, err } = await brandRepository.remove(oid, { transaction });
    if (err) {
      await transaction.rollback();
      return { Brand: null, err };
    }

    await transaction.commit();

    const msgData = { value: resultFind.oid, name: resultFind.undefined };
    const Brand = await messageMaps.toMessageResponse(msgData);

    return { Brand, err: null };

  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Delete failed:', err);
    return {
      Brand: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await brandRepository.findAll({
      include: [],
      order: [['createdAt', 'DESC']],
      attributes: BRAND_BASIC_FIELDS
    });

    if (err) return { brands: [], err };

    const brands = await mappings.toBrandResponses(result);
    return { brands, err: null };
  } catch (err) {
    return {
      brands: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};
const findById = async (oid, options = {}) => {
  try {
    const { result, err } = await brandRepository.findById(oid, options);

    if (err) {
      return {
        brand: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    if (!result) {
      return { brand: null, err: null };
    }

    // Tambahkan properti `fileUrl` dari pemanggilan image microservice
    let fileUrl = null;
    try {
      const imageResponse = await getImageFile(result.imageOid);
      // @ts-ignore
      fileUrl = imageResponse.data.data.fileUrl || null;
    } catch (imageError) {
      console.warn('Gagal mengambil image file:', imageError.message);
    }

    const brandData = {
      ...result.dataValues,
      fileUrl,
    };

    const brand = await mappings.toBrandResponse(brandData);
    return { brand, err: null };
  } catch (err) {
    console.error('Error finding Brand:', err);
    return {
      brand: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};


const findPage = async (filters, options) => {
  try {
    const { search, ...restFilters } = filters;
    const normalizedFilters = search ? { ...restFilters, undefined: search } : filters;

    const where = buildFilterConditions(sequelize, normalizedFilters, false);
    const findOptions = buildFindOptions(where, options);

    const result = await brandRepository.findAndCountByCriteria(findOptions);

    if (result.err) throw result.err;
    const brands = await mappings.toBrandResponses(result.data);
    return {
      brands,
      count: result.count,
      err: null,
    };
  } catch (error) {
    console.error('BrandService findPage error:', error);
    return {
      brands: [],
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
