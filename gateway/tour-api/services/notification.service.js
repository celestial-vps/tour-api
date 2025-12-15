const userRepository = require('../repositories/user.repository');
const mappings = require('../mappings/bank.vm');
const messageMaps = require('../mappings/message.vm');
const sequelize = require('../config/sequelize');
const moment = require('moment');
const { buildFilterConditions, buildFindOptions } = require('../misc/sequelizeFilterBuilder');
const buildResponse = require('../common/build.response');
const { BANK_BASIC_FIELDS } = require('../constants/bank.fields');
const { sendNotification } = require('../misc/fcm'); // 

// require('../misc/datetime'); // Import string extensions for toCapitalize


const multipleNotification = async (dto, userOid) => {
    // @ts-ignore
    const now = new Date().formatUTC();

    let transaction;

    try {
        transaction = await sequelize.transaction();


        const { result, err } = await userRepository.findAll(data, { transaction });
        if (dto.platform === 'web') {
            dto.token = dto.token || result[0].tokenWeb;
        } else if (dto.platform === 'android') {
            dto.token = dto.token || result[0].androidToken;
        } else if (dto.platform === 'ios') {
            dto.token = dto.token || result[0].iosToken;
        }
        else if (dto.platform === 'desktop') {
            dto.token = result[0].tokenWeb || result[0].androidToken || result[0].iosToken || result[0].desktopToken;
        }
        else if (dto.platform === 'all') {
            dto.token = result[0].tokenWeb || result[0].androidToken || result[0].iosToken;
        }
        sendNotification(dto.token, dto.title, dto.body, dto.data);

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

const singleNotification = async (oid, dto, userOid, options = {}) => {
    const { transaction = null, useTransaction = false } = options;
    // @ts-ignore
    const now = new Date().formatUTC();
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
        const { result: existingBank, err: findError } = await userRepository.findById(oid, findOptions);

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



module.exports = {
    multipleNotification,
    singleNotification,
};

