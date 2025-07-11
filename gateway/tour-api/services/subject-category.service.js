'use strict';
const subjectCategoryRepository = require('../repositories/subject-category.repository');
const mappings = require('../mappings/subject-category.vm');
const messageMaps = require('../mappings/message.vm');
const sequelize = require('../config/sequelize');
const moment = require('moment');
const { buildFilterConditions, buildFindOptions } = require('../misc/sequelizeFilterBuilder');
const buildResponse = require('../common/build.response');
const { SUBJECT_CATEGORY_BASIC_FIELDS } = require('../constants/subject-category.fields');

const create = async (dto, userOid) => {
  const now = new Date().formatUTC();
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const data = {
      categoryName: dto.categoryName,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, err } = await subjectCategoryRepository.save(data, { transaction });

    if (err || !result) {
      await transaction.rollback();
      return {
        subjectCategory: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    await transaction.commit();

    const msgData = { value: result.oid, name: result.categoryName };
    const subjectCategory = await messageMaps.toMessageResponse(msgData);

    return { subjectCategory, err: null };

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Create failed:', error);
    return {
      subjectCategory: null,
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

    const { result: existing, err: findError } = await subjectCategoryRepository.findById(oid, findOptions);

    if (findError) {
      if (localTransaction) await localTransaction.rollback();
      return { subjectCategory: null, err: findError };
    }

    if (!existing) {
      if (localTransaction) await localTransaction.rollback();
      return { subjectCategory: null, err: { message: "SubjectCategory not found", status: 404 } };
    }

    const updateData = {
      categoryName: dto.categoryName ?? existing.categoryName,
      lastModifiedBy: userOid ?? existing.lastModifiedBy,
      updatedAt: now,
    };

    const { result: updateResult, err: updateError } = await subjectCategoryRepository.update(
      oid,
      updateData,
      currentTransaction ? { transaction: currentTransaction } : {}
    );

    if (updateError) {
      if (localTransaction) await localTransaction.rollback();
      return { subjectCategory: null, err: updateError };
    }

    if (localTransaction) await localTransaction.commit();

    const msgData = { value: existing.oid, name: existing.categoryName };
    const subjectCategory = await messageMaps.toMessageResponse(msgData);

    return { subjectCategory, err: null };

  } catch (err) {
    if (localTransaction) await localTransaction.rollback();
    console.error('Update failed:', err);
    return {
      subjectCategory: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const deleted = async (oid) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { result: resultFind, err: errFind } = await subjectCategoryRepository.findById(oid, { transaction });
    if (errFind) {
      await transaction.rollback();
      return { subjectCategory: null, err: errFind };
    }

    if (!resultFind) {
      await transaction.rollback();
      return {
        subjectCategory: null,
        err: { message: 'Data Not Found', status: 404 }
      };
    }

    const { result, err } = await subjectCategoryRepository.remove(oid, { transaction });
    if (err) {
      await transaction.rollback();
      return { subjectCategory: null, err };
    }

    await transaction.commit();

    const msgData = { value: resultFind.oid, name: resultFind.categoryName };
    const subjectCategory = await messageMaps.toMessageResponse(msgData);

    return { subjectCategory, err: null };

  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Delete failed:', err);
    return {
      subjectCategory: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await subjectCategoryRepository.findAll({
      include: [],
      order: [['createdAt', 'DESC']],
      attributes: SUBJECT_CATEGORY_BASIC_FIELDS
    });

    if (err) return { subjectCategories: [], err };

    const subjectCategories = await mappings.toSubjectCategoryResponses(result);
    return { subjectCategories, err: null };
  } catch (err) {
    return {
      subjectCategories: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findById = async (oid, options = {}) => {
  try {
    const { result, err } = await subjectCategoryRepository.findById(oid, options);

    if (err) {
      return {
        subjectCategory: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    if (!result) {
      return { subjectCategory: null, err: null };
    }

    const subjectCategory = await mappings.toSubjectCategoryResponse(result);

    return { subjectCategory, err: null };
  } catch (err) {
    console.error('Error finding subjectCategory:', err);
    return {
      subjectCategory: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findPage = async (filters, options) => {
  try {
    const { search, ...restFilters } = filters;
    const normalizedFilters = search ? { ...restFilters, categoryName: search } : filters;

    const where = buildFilterConditions(sequelize, normalizedFilters, false);
    const findOptions = buildFindOptions(where, options);

    const result = await subjectCategoryRepository.findAndCountByCriteria(findOptions);

    if (result.err) throw result.err;

    return {
      subjectCategories: result.data,
      count: result.count,
      err: null,
    };
  } catch (error) {
    console.error('SubjectCategoryService findPage error:', error);
    return {
      subjectCategories: [],
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
