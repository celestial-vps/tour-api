const auditLogRepository = require('../repositories/audit-log.repository');
const mappings = require('../mappings/audit-log.vm');
const messageMaps = require('../mappings/message.vm');
const sequelize = require('../config/sequelize');
const moment = require('moment');
const { buildFilterConditions, buildFindOptions } = require('../misc/sequelizeFilterBuilder');
const buildResponse = require('../common/build.response');
const { BANK_BASIC_FIELDS } = require('../constants/audit-log.fields');

const create = async (dto, userOid) => {
  const now = moment.utc().format('YYYY-MM-DD HH:mm:ss');
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const data = {
      auditLogCode: dto.auditLogCode,
      auditLogName: dto.auditLogName,
      auditLogCurrency: dto.auditLogCurrency,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, err } = await auditLogRepository.save(data, { transaction });

    if (err || !result) {
      await transaction.rollback();
      return {
        auditLog: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    await transaction.commit();

    const msgData = { value: result.oid, name: result.auditLogName };
    const auditLog = await messageMaps.toMessageResponse(msgData);

    return { auditLog, err: null };

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Create failed:', error);

    return {
      auditLog: null,
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
    const { result: existingAuditLog, err: findError } = await auditLogRepository.findById(oid, findOptions);

    if (findError) {
      if (localTransaction) await localTransaction.rollback();
      return { auditLog: null, err: findError };
    }

    if (!existingAuditLog) {
      if (localTransaction) await localTransaction.rollback();
      return { auditLog: null, err: { message: "AuditLog not found", status: 404 } };
    }

    const updateData = {
      auditLogCode: dto.auditLogCode ?? existingAuditLog.auditLogCode,
      auditLogName: dto.auditLogName ?? existingAuditLog.auditLogName,
      auditLogCurrency: dto.auditLogCurrency ?? existingAuditLog.auditLogCurrency,
      lastModifiedBy: userOid ?? existingAuditLog.lastModifiedBy,
      updatedAt: now,
    };

    // Update data dengan transaksi yang sama
    const { result: updateResult, err: updateError } = await auditLogRepository.update(
      oid,
      updateData,
      currentTransaction ? { transaction: currentTransaction } : {}
    );

    if (updateError) {
      if (localTransaction) await localTransaction.rollback();
      return { auditLog: null, err: updateError };
    }

    if (localTransaction) {
      await localTransaction.commit();
    }

    // Buat response message dari data yang sudah diupdate
    const msgData = { value: existingAuditLog.oid, name: existingAuditLog.auditLogName };
    const auditLog = await messageMaps.toMessageResponse(msgData);

    return { auditLog, err: null };

  } catch (err) {
    if (localTransaction) await localTransaction.rollback();
    console.error('Update failed:', err);

    return {
      auditLog: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};


const deleted = async (oid) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { result: resultFind, err: errFind } = await auditLogRepository.findById(oid, { transaction });
    if (errFind) {
      await transaction.rollback();
      return { auditLog: null, err: errFind };
    }

    if (!resultFind) {
      await transaction.rollback();
      return {
        auditLog: null,
        err: { message: 'Data Not Found', status: 404 }
      };
    }

    const { result, err } = await auditLogRepository.remove(oid, { transaction });
    if (err) {
      await transaction.rollback();
      return { auditLog: null, err };
    }

    await transaction.commit();

    const msgData = { value: resultFind.oid, name: resultFind.auditLogName };
    const auditLog = await messageMaps.toMessageResponse(msgData);

    return { auditLog, err: null };

  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Delete failed:', err);

    return {
      auditLog: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await auditLogRepository.findAll({
      include: [],
      order: [['createdAt', 'DESC']],
      attributes: BANK_BASIC_FIELDS
    });

    if (err) return { auditLogs: [], err };

    const auditLogs = await mappings.toAuditLogResponses(result);
    return { auditLogs, err: null };
  } catch (err) {
    return {
      auditLogs: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findById = async (oid) => {
  try {

    const options = {
      include: [], // bisa ditambahkan jika ada relasi
    };
    const { result, err } = await auditLogRepository.findById(oid, options);

    if (err) {
      return {
        auditLog: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    if (!result) {
      // Data not found, no error, just empty result
      return { auditLog: null, err: null };
    }

    const auditLog = await mappings.toAuditLogResponse(result);

    return { auditLog, err: null };
  } catch (err) {
    console.error('Error finding auditLog:', err);
    return {
      auditLog: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};



const findPage = async (filters, options) => {
  try {

    const { search, ...restFilters } = filters;
    const normalizedFilters = search ? { ...restFilters, auditLogName: search } : filters;

    const where = buildFilterConditions(sequelize, normalizedFilters, false); // case-insensitive
    const findOptions = buildFindOptions(where, options);

    const result = await auditLogRepository.findAndCountByCriteria(findOptions);

    if (result.err) throw result.err;

    return {
      auditLogs: result.data,
      count: result.count,
      err: null,
    };
  } catch (error) {
    console.error('AuditLogService findPage error:', error);
    return {
      auditLogs: [],
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
