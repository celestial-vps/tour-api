'use strict';
const learningLevelRepository = require('../repositories/learning-level.repository');
const mappings = require('../mappings/learning-level.vm');
const messageMaps = require('../mappings/message.vm');
const sequelize = require('../config/sequelize');
const moment = require('moment');
const { buildFilterConditions, buildFindOptions } = require('../misc/sequelizeFilterBuilder');
const buildResponse = require('../common/build.response');
const { LEARNING_LEVEL_BASIC_FIELDS } = require('../constants/learning-level.fields');

const create = async (dto, userOid) => {
  // @ts-ignore
  const now = new Date().formatUTC();
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const data = {
      levelName: dto.levelName,
      type: dto.type,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, err } = await learningLevelRepository.save(data, { transaction });

    if (err || !result) {
      await transaction.rollback();
      return {
        learningLevel: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    await transaction.commit();

    const msgData = { value: result.oid, name: result.levelName };
    const learningLevel = await messageMaps.toMessageResponse(msgData);

    return { learningLevel, err: null };

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Create failed:', error);
    return {
      learningLevel: null,
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

    const { result: existing, err: findError } = await learningLevelRepository.findById(oid, findOptions);

    if (findError) {
      if (localTransaction) await localTransaction.rollback();
      return { learningLevel: null, err: findError };
    }

    if (!existing) {
      if (localTransaction) await localTransaction.rollback();
      return { learningLevel: null, err: { message: "LearningLevel not found", status: 404 } };
    }

    const updateData = {
      levelName: dto.levelName ?? existing.levelName,
      type: dto.type ?? existing.type,
      lastModifiedBy: userOid ?? existing.lastModifiedBy,
      updatedAt: now,
    };

    const { result: updateResult, err: updateError } = await learningLevelRepository.update(
      oid,
      updateData,
      currentTransaction ? { transaction: currentTransaction } : {}
    );

    if (updateError) {
      if (localTransaction) await localTransaction.rollback();
      return { learningLevel: null, err: updateError };
    }

    if (localTransaction) await localTransaction.commit();

    const msgData = { value: existing.oid, name: existing.levelName };
    const learningLevel = await messageMaps.toMessageResponse(msgData);

    return { learningLevel, err: null };

  } catch (err) {
    if (localTransaction) await localTransaction.rollback();
    console.error('Update failed:', err);
    return {
      learningLevel: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const deleted = async (oid) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { result: resultFind, err: errFind } = await learningLevelRepository.findById(oid, { transaction });
    if (errFind) {
      await transaction.rollback();
      return { learningLevel: null, err: errFind };
    }

    if (!resultFind) {
      await transaction.rollback();
      return {
        learningLevel: null,
        err: { message: 'Data Not Found', status: 404 }
      };
    }

    const { result, err } = await learningLevelRepository.remove(oid, { transaction });
    if (err) {
      await transaction.rollback();
      return { learningLevel: null, err };
    }

    await transaction.commit();

    const msgData = { value: resultFind.oid, name: resultFind.levelName };
    const learningLevel = await messageMaps.toMessageResponse(msgData);

    return { learningLevel, err: null };

  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Delete failed:', err);
    return {
      learningLevel: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await learningLevelRepository.findAll({
      include: [],
      order: [['createdAt', 'DESC']],
      attributes: LEARNING_LEVEL_BASIC_FIELDS
    });

    if (err) return { learningLevels: [], err };

    const learningLevels = await mappings.toLearningLevelResponses(result);
    return { learningLevels, err: null };
  } catch (err) {
    return {
      learningLevels: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findById = async (oid, options = {}) => {
  try {
    const { result, err } = await learningLevelRepository.findById(oid, options);

    if (err) {
      return {
        learningLevel: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    if (!result) {
      return { learningLevel: null, err: null };
    }

    const learningLevel = await mappings.toLearningLevelResponse(result);

    return { learningLevel, err: null };
  } catch (err) {
    console.error('Error finding learningLevel:', err);
    return {
      learningLevel: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findPage = async (filters, options) => {
  try {
    const { search, ...restFilters } = filters;
    const normalizedFilters = search ? { ...restFilters, levelName: search } : filters;

    const where = buildFilterConditions(sequelize, normalizedFilters, false);
    const findOptions = buildFindOptions(where, options);

    const result = await learningLevelRepository.findAndCountByCriteria(findOptions);

    if (result.err) throw result.err;
    const learningLevels = await mappings.toLearningLevelResponses(result.data);

    return {
      learningLevels,
      count: result.count,
      err: null,
    };
  } catch (error) {
    console.error('LearningLevelService findPage error:', error);
    return {
      learningLevels: [],
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
