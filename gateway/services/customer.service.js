'use strict';
const customerRepository = require('../repositories/customer.repository');
const mappings = require('../mappings/customer.vm');
const messageMaps = require('../mappings/message.vm');
const sequelize = require('../config/sequelize');
const moment = require('moment');
const { buildFilterConditions, buildFindOptions } = require('../misc/sequelizeFilterBuilder');
const buildResponse = require('../common/build.response');
const { CUSTOMER_BASIC_FIELDS } = require('../constants/customer.fields');

const create = async (dto, userOid) => {
  const now = moment.utc().format('YYYY-MM-DD HH:mm:ss');
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const data = {
      customerName: dto.customerName,
      customerPhone: dto.customerPhone,
      customerEmail: dto.customerEmail,
      customerPostalCode: dto.customerPostalCode,
      bankOid: dto.bankOid,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, err } = await customerRepository.save(data, { transaction });

    if (err || !result) {
      await transaction.rollback();
      return {
        Customer: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    await transaction.commit();

    const msgData = { value: result.oid, name: result.customerPhone };
    const Customer = await messageMaps.toMessageResponse(msgData);

    return { Customer, err: null };

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Create failed:', error);
    return {
      Customer: null,
      err: buildResponse.responseInternalServerError(error).data.error,
    };
  }
};

const update = async (oid, dto, userOid, options = {}) => {
  const { transaction = null, useTransaction = false } = options;
  const now = moment.utc().format('YYYY-MM-DD HH:mm:ss');
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

    const { result: existing, err: findError } = await customerRepository.findById(oid, findOptions);

    if (findError) {
      if (localTransaction) await localTransaction.rollback();
      return { Customer: null, err: findError };
    }

    if (!existing) {
      if (localTransaction) await localTransaction.rollback();
      return { Customer: null, err: { message: "Customer not found", status: 404 } };
    }

    const updateData = {
      customerName: dto.customerName ?? existing.customerName,
      customerPhone: dto.customerPhone ?? existing.customerPhone,
      customerEmail: dto.customerEmail ?? existing.customerEmail,
      customerPostalCode: dto.customerPostalCode ?? existing.customerPostalCode,
      bankOid: dto.bankOid ?? existing.bankOid,
      lastModifiedBy: userOid ?? existing.lastModifiedBy,
      updatedAt: now,
    };

    const { result: updateResult, err: updateError } = await customerRepository.update(
      oid,
      updateData,
      currentTransaction ? { transaction: currentTransaction } : {}
    );

    if (updateError) {
      if (localTransaction) await localTransaction.rollback();
      return { Customer: null, err: updateError };
    }

    if (localTransaction) await localTransaction.commit();

    const msgData = { value: existing.oid, name: existing.customerPhone };
    const Customer = await messageMaps.toMessageResponse(msgData);

    return { Customer, err: null };

  } catch (err) {
    if (localTransaction) await localTransaction.rollback();
    console.error('Update failed:', err);
    return {
      Customer: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const deleted = async (oid) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { result: resultFind, err: errFind } = await customerRepository.findById(oid, { transaction });
    if (errFind) {
      await transaction.rollback();
      return { Customer: null, err: errFind };
    }

    if (!resultFind) {
      await transaction.rollback();
      return {
        Customer: null,
        err: { message: 'Data Not Found', status: 404 }
      };
    }

    const { result, err } = await customerRepository.remove(oid, { transaction });
    if (err) {
      await transaction.rollback();
      return { Customer: null, err };
    }

    await transaction.commit();

    const msgData = { value: resultFind.oid, name: resultFind.customerPhone };
    const Customer = await messageMaps.toMessageResponse(msgData);

    return { Customer, err: null };

  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Delete failed:', err);
    return {
      Customer: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await customerRepository.findAll({
      include: [],
      order: [['createdAt', 'DESC']],
      attributes: CUSTOMER_BASIC_FIELDS
    });

    if (err) return { Customers: [], err };

    const Customers = await mappings.toCustomerResponses(result);
    return { Customers, err: null };
  } catch (err) {
    return {
      Customers: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findById = async (oid, options = {}) => {
  try {
    const { result, err } = await customerRepository.findById(oid, options);

    if (err) {
      return {
        Customer: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    if (!result) {
      return { Customer: null, err: null };
    }

    const Customer = await mappings.toCustomerResponse(result);

    return { Customer, err: null };
  } catch (err) {
    console.error('Error finding Customer:', err);
    return {
      Customer: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findPage = async (filters, options) => {
  try {
    const { search, ...restFilters } = filters;
    const normalizedFilters = search ? { ...restFilters, customerPhone: search } : filters;

    const where = buildFilterConditions(sequelize, normalizedFilters, false);
    const findOptions = buildFindOptions(where, options);

    const result = await customerRepository.findAndCountByCriteria(findOptions);

    if (result.err) throw result.err;

    return {
      customers: result.data,
      count: result.count,
      err: null,
    };
  } catch (error) {
    console.error('CustomerService findPage error:', error);
    return {
      Customers: [],
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
