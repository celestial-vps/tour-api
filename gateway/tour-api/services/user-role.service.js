'use strict';
const userRoleRepository = require('../repositories/user-role.repository');
const mappings = require('../mappings/user-role.vm');
const messageMaps = require('../mappings/message.vm');
const sequelize = require('../config/sequelize');
const moment = require('moment');
const { buildFilterConditions, buildFindOptions } = require('../misc/sequelizeFilterBuilder');
const buildResponse = require('../common/build.response');
const { USER_ROLE_BASIC_FIELDS } = require('../constants/user-role.fields');

const create = async (dto, userOid) => {
  // @ts-ignore
  const now = new Date().formatUTC();
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const data = {
      roleName: dto.roleName,
      targetType: dto.targetType,
      isAdministrative: dto.isAdministrative,
      readState: dto.readState,
      writeState: dto.writeState,
      createState: dto.createState,
      deleteState: dto.deleteState,
      navigateState: dto.navigateState,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, err } = await userRoleRepository.save(data, { transaction });

    if (err || !result) {
      await transaction.rollback();
      return {
        userRole: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    await transaction.commit();

    const msgData = { value: result.oid, name: result.roleName };
    const userRole = await messageMaps.toMessageResponse(msgData);

    return { userRole, err: null };

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Create failed:', error);
    return {
      userRole: null,
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

    const { result: existing, err: findError } = await userRoleRepository.findById(oid, findOptions);

    if (findError) {
      if (localTransaction) await localTransaction.rollback();
      return { userRole: null, err: findError };
    }

    if (!existing) {
      if (localTransaction) await localTransaction.rollback();
      return { userRole: null, err: { message: "UserRole not found", status: 404 } };
    }

    const updateData = {
      roleName: dto.roleName ?? existing.roleName,
      targetType: dto.targetType ?? existing.targetType,
      isAdministrative: dto.isAdministrative ?? existing.isAdministrative,
      readState: dto.readState ?? existing.readState,
      writeState: dto.writeState ?? existing.writeState,
      createState: dto.createState ?? existing.createState,
      deleteState: dto.deleteState ?? existing.deleteState,
      navigateState: dto.navigateState ?? existing.navigateState,
      lastModifiedBy: userOid ?? existing.lastModifiedBy,
      updatedAt: now,
    };

    const { result: updateResult, err: updateError } = await userRoleRepository.update(
      oid,
      updateData,
      currentTransaction ? { transaction: currentTransaction } : {}
    );

    if (updateError) {
      if (localTransaction) await localTransaction.rollback();
      return { userRole: null, err: updateError };
    }

    if (localTransaction) await localTransaction.commit();

    const msgData = { value: existing.oid, name: existing.roleName };
    const userRole = await messageMaps.toMessageResponse(msgData);

    return { userRole, err: null };

  } catch (err) {
    if (localTransaction) await localTransaction.rollback();
    console.error('Update failed:', err);
    return {
      userRole: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const deleted = async (oid) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { result: resultFind, err: errFind } = await userRoleRepository.findById(oid, { transaction });
    if (errFind) {
      await transaction.rollback();
      return { userRole: null, err: errFind };
    }

    if (!resultFind) {
      await transaction.rollback();
      return {
        userRole: null,
        err: { message: 'Data Not Found', status: 404 }
      };
    }

    const { result, err } = await userRoleRepository.remove(oid, { transaction });
    if (err) {
      await transaction.rollback();
      return { userRole: null, err };
    }

    await transaction.commit();

    const msgData = { value: resultFind.oid, name: resultFind.roleName };
    const userRole = await messageMaps.toMessageResponse(msgData);

    return { userRole, err: null };

  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Delete failed:', err);
    return {
      userRole: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await userRoleRepository.findAll({
      include: [],
      order: [['createdAt', 'DESC']],
      attributes: USER_ROLE_BASIC_FIELDS
    });

    if (err) return { userRoles: [], err };

    const userRoles = await mappings.toUserRoleResponses(result);
    return { userRoles, err: null };
  } catch (err) {
    return {
      userRoles: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findById = async (oid, options = {}) => {
  try {
    const { result, err } = await userRoleRepository.findById(oid, options);

    if (err) {
      return {
        userRole: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    if (!result) {
      return { userRole: null, err: null };
    }

    const userRole = await mappings.toUserRoleResponse(result);

    return { userRole, err: null };
  } catch (err) {
    console.error('Error finding userRole:', err);
    return {
      userRole: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findPage = async (filters, options) => {
  try {
    const { search, ...restFilters } = filters;
    const normalizedFilters = search ? { ...restFilters, roleName: search } : filters;

    const where = buildFilterConditions(sequelize, normalizedFilters, false);
    const findOptions = buildFindOptions(where, options);

    const result = await userRoleRepository.findAndCountByCriteria(findOptions);

    if (result.err) throw result.err;

    return {
      userRoles: result.data,
      count: result.count,
      err: null,
    };
  } catch (error) {
    console.error('UserRoleService findPage error:', error);
    return {
      userRoles: [],
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
