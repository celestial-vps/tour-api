const districtRepository = require('../repositories/district.repository');
const sequelize = require('../config/sequelize');
const moment = require('moment');
const buildResponse = require('../common/build.response');
const { buildFilterConditions, buildFindOptions } = require('../misc/sequelizeFilterBuilder');

const create = async (dto, userOid) => {
  const now = moment.utc().format('YYYY-MM-DD HH:mm:ss');
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const data = {
      cityOid: dto.cityOid,
      districtName: dto.districtName,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, err } = await districtRepository.save(data, { transaction });

    if (err || !result) {
      await transaction.rollback();
      return { district: null, err: buildResponse.responseInternalServerError(err).data.error };
    }

    await transaction.commit();

    return { district: result, err: null };
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('District Service Create Error:', error);
    return { district: null, err: buildResponse.responseInternalServerError(error).data.error };
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
      include: ['city'], // bisa disesuaikan, optional
    };

    const { result: existingDistrict, err: findErr } = await districtRepository.findById(oid, findOptions);

    if (findErr) {
      if (localTransaction) await localTransaction.rollback();
      return { district: null, err: findErr };
    }

    if (!existingDistrict) {
      if (localTransaction) await localTransaction.rollback();
      return { district: null, err: { message: "District not found", status: 404 } };
    }

    const updateData = {
      cityOid: dto.cityOid ?? existingDistrict.cityOid,
      districtName: dto.districtName ?? existingDistrict.districtName,
      lastModifiedBy: userOid ?? existingDistrict.lastModifiedBy,
      updatedAt: now,
    };

    const { result: updateResult, err: updateErr } = await districtRepository.update(
      oid,
      updateData,
      currentTransaction ? { transaction: currentTransaction } : {}
    );

    if (updateErr) {
      if (localTransaction) await localTransaction.rollback();
      return { district: null, err: updateErr };
    }

    if (localTransaction) {
      await localTransaction.commit();
    }

    return { district: updateResult, err: null };
  } catch (err) {
    if (localTransaction) await localTransaction.rollback();
    console.error('District Service Update Error:', err);
    return { district: null, err: buildResponse.responseInternalServerError(err).data.error };
  }
};

const deleted = async (oid) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { result: foundDistrict, err: errFind } = await districtRepository.findById(oid, { transaction });
    if (errFind) {
      await transaction.rollback();
      return { district: null, err: errFind };
    }

    if (!foundDistrict) {
      await transaction.rollback();
      return { district: null, err: { message: 'Data Not Found', status: 404 } };
    }

    const { result, err } = await districtRepository.remove(oid, { transaction });
    if (err) {
      await transaction.rollback();
      return { district: null, err };
    }

    await transaction.commit();

    return { district: foundDistrict, err: null };
  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('District Service Delete Error:', err);
    return { district: null, err: buildResponse.responseInternalServerError(err).data.error };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await districtRepository.findAll({
      include: ['city'], // sesuaikan relasi jika perlu
      order: [['createdAt', 'DESC']],
    });

    if (err) return { districts: [], err };

    return { districts: result, err: null };
  } catch (err) {
    console.error('District Service findAll Error:', err);
    return { districts: [], err: buildResponse.responseInternalServerError(err).data.error };
  }
};

const findById = async (oid, options = {}) => {
  try {
    const { result, err } = await districtRepository.findById(oid, options);

    if (err) return { district: null, err: buildResponse.responseInternalServerError(err).data.error };

    if (!result) return { district: null, err: null };

    return { district: result, err: null };
  } catch (err) {
    console.error('District Service findById Error:', err);
    return { district: null, err: buildResponse.responseInternalServerError(err).data.error };
  }
};

const findPage = async (filters, options) => {
  try {
    const where = buildFilterConditions(sequelize, filters, false);
    const findOptions = buildFindOptions(where, options);

    const result = await districtRepository.findAndCountByCriteria(findOptions);

    if (result.err) throw result.err;

    return {
      districts: result.data,
      count: result.count,
      err: null,
    };
  } catch (error) {
    console.error('District Service findPage Error:', error);
    return {
      districts: [],
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
  findPage,
};
