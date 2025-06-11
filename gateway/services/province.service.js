const provinceRepository = require('../repositories/province.repository');
const mappings = require('../mappings/province.vm');
const messageMaps = require('../mappings/message.vm');
const sequelize = require('../config/sequelize');
const moment = require('moment');
const buildResponse = require('../common/build.response');
const { buildFilterConditions, buildFindOptions } = require('../misc/sequelizeFilterBuilder');
const { PROVINCE_BASIC_FIELDS } = require('../constants/province.fields');
const Country = require('../models/country');

const create = async (dto, userOid) => {
    const now = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    let transaction;

    try {
        transaction = await sequelize.transaction();

        const data = {
            provinceName: dto.provinceName,
            countryOid: dto.countryOid,
            createdBy: userOid,
            createdAt: now,
            lastModifiedBy: userOid,
            updatedAt: now,
        };

        const { result, err } = await provinceRepository.save(data, { transaction });

        if (err || !result) {
            await transaction.rollback();
            return {
                province: null,
                err: buildResponse.responseInternalServerError(err).data.error,
            };
        }

        await transaction.commit();

        const msgData = { value: result.oid, name: result.provinceName };
        const province = await messageMaps.toMessageResponse(msgData);

        return { province, err: null };

    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error('Create failed:', error);

        return {
            province: null,
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

        const { result: existingProvince, err: findError } = await provinceRepository.findById(oid, { transaction: currentTransaction });

        if (findError || !existingProvince) {
            if (localTransaction) await localTransaction.rollback();
            return { province: null, err: findError || { message: 'Province not found', status: 404 } };
        }

        const updateData = {
            provinceName: dto.provinceName ?? existingProvince.provinceName,
            countryOid: dto.countryOid ?? existingProvince.countryOid,
            lastModifiedBy: userOid,
            updatedAt: now,
        };

        const { result: updateResult, err: updateError } = await provinceRepository.update(oid, updateData, { transaction: currentTransaction });

        if (updateError) {
            if (localTransaction) await localTransaction.rollback();
            return { province: null, err: updateError };
        }

        if (localTransaction) await localTransaction.commit();

        const msgData = { value: existingProvince.oid, name: existingProvince.provinceName };
        const province = await messageMaps.toMessageResponse(msgData);

        return { province, err: null };
    } catch (err) {
        if (localTransaction) await localTransaction.rollback();
        return {
            province: null,
            err: buildResponse.responseInternalServerError(err).data.error,
        };
    }
};

const deleted = async (oid) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();

        const { result: existing, err: errFind } = await provinceRepository.findById(oid, { transaction });
        if (errFind || !existing) {
            await transaction.rollback();
            return {
                province: null,
                err: errFind || { message: 'Data Not Found', status: 404 }
            };
        }

        const { result, err } = await provinceRepository.remove(oid, { transaction });
        if (err) {
            await transaction.rollback();
            return { province: null, err };
        }

        await transaction.commit();

        const msgData = { value: existing.oid, name: existing.provinceName };
        const province = await messageMaps.toMessageResponse(msgData);

        return { province, err: null };
    } catch (err) {
        if (transaction) await transaction.rollback();
        return {
            province: null,
            err: buildResponse.responseInternalServerError(err).data.error,
        };
    }
};

const findAll = async () => {
    try {
        const { result, err } = await provinceRepository.findAll({
            include: [],
            order: [['createdAt', 'DESC']],
            attributes: PROVINCE_BASIC_FIELDS,
        });

        if (err) return { provinces: [], err };

        const provinces = await mappings.toProvinceResponses(result);
        return { provinces, err: null };
    } catch (err) {
        return {
            provinces: [],
            err: buildResponse.responseInternalServerError(err).data.error,
        };
    }
};

const findById = async (oid, options = {}) => {
    try {
        const { result, err } = await provinceRepository.findById(oid, options);
        if (err) return { province: null, err: buildResponse.responseInternalServerError(err).data.error };
        if (!result) return { province: null, err: null };

        const province = await mappings.toProvinceResponse(result);
        return { province, err: null };
    } catch (err) {
        return {
            province: null,
            err: buildResponse.responseInternalServerError(err).data.error,
        };
    }
};

const findPage = async (filters, options) => {
    try {
        const where = buildFilterConditions(sequelize, filters, false);
        const findOptions = buildFindOptions(where, options);

        // Pastikan Country sudah di-import dan tersedia
        findOptions.include = [
            {
                model: Country,
                as: 'country',
                required: false,
                paranoid: false // ⬅️ ini penting!
            }
        ];

        // Jangan overwrite lagi findOptions.include dengan undefined atau variabel lain
        // findOptions.include = include; // <-- hapus baris ini

        const result = await provinceRepository.findAndCountByCriteria(findOptions);
        if (result.err) throw result.err;

        const provinces = await mappings.toProvinceResponses(result.data);
        return {
            provinces,
            count: result.count,
            err: null,
        };
    } catch (err) {
        return {
            provinces: [],
            count: 0,
            err: buildResponse.responseInternalServerError(err).data.error,
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
