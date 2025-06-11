const bankRepository = require('../repositories/bank.repository');
const mappings = require('../mappings/bank.vm');
const messageMaps = require('../mappings/message.vm');
const sequelize = require('../config/sequelize');
const moment = require('moment');
const { buildFilterConditions, buildFindOptions } = require('../misc/sequelizeFilterBuilder');
const buildResponse = require('../common/build.response');
const { BANK_BASIC_FIELDS } = require('../constants/bank.fields');

const create = async (dto, userOid) => {
  const now = moment.utc().format('YYYY-MM-DD HH:mm:ss');
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const data = {
      bankCode: dto.bankCode,
      bankName: dto.bankName,
      bankCurrency: dto.bankCurrency,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, err } = await bankRepository.save(data, { transaction });

    if (err || !result) {
      await transaction.rollback();
      return {
        bank: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    await transaction.commit();

    const msgData = { value: result.oid, name: result.bankName };
    const bank = await messageMaps.toMessageResponse(msgData);

    return { bank, err: null };

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Create failed:', error);

    return {
      bank: null,
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

    // Siapkan opsi untuk findById, termasuk transaksi dan include relasi jika diperlukan
    const findOptions = {
      transaction: currentTransaction,
      include: [],  // ubah sesuai kebutuhan, bisa [] atau diambil dari dto misal
    };

    // Panggil findById dengan options yang benar
    const { result: existingBank, err: findError } = await bankRepository.findById(oid, findOptions);

    if (findError) {
      if (localTransaction) await localTransaction.rollback();
      return { bank: null, err: findError };
    }

    if (!existingBank) {
      if (localTransaction) await localTransaction.rollback();
      return { bank: null, err: { message: "Bank not found", status: 404 } };
    }

    const updateData = {
      bankCode: dto.bankCode ?? existingBank.bankCode,
      bankName: dto.bankName ?? existingBank.bankName,
      bankCurrency: dto.bankCurrency ?? existingBank.bankCurrency,
      lastModifiedBy: userOid ?? existingBank.lastModifiedBy,
      updatedAt: now,
    };

    // Update data dengan transaksi yang sama
    const { result: updateResult, err: updateError } = await bankRepository.update(
      oid,
      updateData,
      currentTransaction ? { transaction: currentTransaction } : {}
    );

    if (updateError) {
      if (localTransaction) await localTransaction.rollback();
      return { bank: null, err: updateError };
    }

    if (localTransaction) {
      await localTransaction.commit();
    }

    // Buat response message dari data yang sudah diupdate
    const msgData = { value: existingBank.oid, name: existingBank.bankName };
    const bank = await messageMaps.toMessageResponse(msgData);

    return { bank, err: null };

  } catch (err) {
    if (localTransaction) await localTransaction.rollback();
    console.error('Update failed:', err);

    return {
      bank: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};


const deleted = async (oid) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { result: resultFind, err: errFind } = await bankRepository.findById(oid, { transaction });
    if (errFind) {
      await transaction.rollback();
      return { bank: null, err: errFind };
    }

    if (!resultFind) {
      await transaction.rollback();
      return {
        bank: null,
        err: { message: 'Data Not Found', status: 404 }
      };
    }

    const { result, err } = await bankRepository.remove(oid, { transaction });
    if (err) {
      await transaction.rollback();
      return { bank: null, err };
    }

    await transaction.commit();

    const msgData = { value: resultFind.oid, name: resultFind.bankName };
    const bank = await messageMaps.toMessageResponse(msgData);

    return { bank, err: null };

  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Delete failed:', err);

    return {
      bank: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await bankRepository.findAll({
      include: [],
      order: [['createdAt', 'DESC']],
      attributes: BANK_BASIC_FIELDS
    });

    if (err) return { banks: [], err };

    const banks = await mappings.toBankResponses(result);
    return { banks, err: null };
  } catch (err) {
    return {
      banks: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findById = async (oid, options = {}) => {
  try {
    const { result, err } = await bankRepository.findById(oid, options);

    if (err) {
      return {
        bank: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    if (!result) {
      // Data not found, no error, just empty result
      return { bank: null, err: null };
    }

    const bank = await mappings.toBankResponse(result);

    return { bank, err: null };
  } catch (err) {
    console.error('Error finding bank:', err);
    return {
      bank: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};



const findPage = async (filters, options) => {
  try {

    const { search, ...restFilters } = filters;
    const normalizedFilters = search ? { ...restFilters, bankName: search } : filters;

    const where = buildFilterConditions(sequelize, normalizedFilters, false); // case-insensitive
    const findOptions = buildFindOptions(where, options);

    const result = await bankRepository.findAndCountByCriteria(findOptions);

    if (result.err) throw result.err;

    return {
      banks: result.data,
      count: result.count,
      err: null,
    };
  } catch (error) {
    console.error('BankService findPage error:', error);
    return {
      banks: [],
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
