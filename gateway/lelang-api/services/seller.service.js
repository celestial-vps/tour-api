const sellerRepository = require('../repositories/seller.repository');
const mappings = require('../mappings/seller.vm');
const moment = require('moment');
const messageMaps = require('../mappings/message.vm');
const mongoose = require('mongoose');
const buildBesponse = require('../common/build.response');
const { v4: uuidv4 } = require('uuid');

const create = async (dto, userOid) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    try {

        const data = {
            _id: uuidv4(),
            userId: userOid,
            storeName: dto.storeName,
            storeDescription: dto.storeDescription ?? null,
            phone: dto.phone ?? null,
            nationalId: dto.nationalId ?? null,
            bankAccountNumber: dto.bankAccountNumber ?? null,
            bankAccountName: dto.bankAccountName ?? null,
            sellerStatus: dto.sellerStatus ?? null,
            createdBy: userOid,
            createdAt: now,
            lastModifiedBy: userOid,
            updatedAt: now,
        };

        const { result, error } = await sellerRepository.save(data);
        await session.commitTransaction();
        session.endSession();

        if (error) {
            return { seller: null, error };
        }
        if (result) {
            const msgData = {
                value: data._id,
                name: data.storeName
            }
            const seller = await messageMaps.toMessageResponse(msgData);
            return { seller, error: null };
        } else {
            return {
                seller: {}, error: { httpStatus: 500, message: 'Failed to delete Immage File' },
            };
        }
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return {
            seller: null, error: { httpStatus: 500, message: 'Failed to delete Immage File' },
        };
    }
};

const update = async (oid, dto, userOid) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    try {

        const { result: resultFind, error: errSeller } = await sellerRepository.findById(oid);
        if (errSeller != null) {
            return { seller: {}, error: errSeller }
        }
        if (resultFind == null) {
            return {
                seller: {}, error: {
                    httpStatus: 404,
                }
            }
        }

        resultFind.userId = userOid ?? resultFind.userId
        resultFind.storeName = dto.storeName ?? resultFind.storeName
        resultFind.storeDescription = dto.storeDescription ?? resultFind.storeDescription
        resultFind.phone = dto.phone ?? resultFind.phone
        resultFind.nationalId = dto.nationalId ?? resultFind.nationalId
        resultFind.bankAccountNumber = dto.bankAccountNumber ?? resultFind.bankAccountNumber
        resultFind.bankAccountName = dto.bankAccountName ?? resultFind.bankAccountName
        resultFind.sellerStatus = dto.sellerStatus ?? resultFind.sellerStatus
        resultFind.lastModifiedBy = userOid ?? resultFind.lastModifiedBy
        resultFind.updatedAt = now

        const { result, error } = await sellerRepository.update(oid, resultFind);
        await session.commitTransaction();
        session.endSession();
        if (error) {
            return { seller: result, error };
        }
        if (result) {
            const msgData = {
                value: resultFind._id,
                name: resultFind.storeName
            }
            const seller = await messageMaps.toMessageResponse(msgData);
            return { seller, error: null };
        } else {
            return {
                seller: {}, error: { httpStatus: 500, message: 'Failed to delete Immage File' },
            };
        }
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return {
            seller: null, error: { httpStatus: 500, message: 'Failed to delete Immage File' },
        };
    }
};

const deleted = async (oid) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    try {
        const { result: resultFind, error: errSeller } = await sellerRepository.findById(oid);
        if (errSeller != null) {
            return { seller: {}, error: errSeller }
        }
        if (resultFind == null) {
            return {
                seller: {}, error: {
                    httpStatus: 404,
                }
            }
        }

        const { result, error } = await sellerRepository.deleted(oid);
        await session.commitTransaction();
        session.endSession();
        if (error) {
            return { result: null, error };
        }
        if (result) {
            const msgData = {
                value: resultFind._id,
                name: resultFind.storeName
            }
            const seller = await messageMaps.toMessageResponse(msgData);
            return { seller, error: null };
        } else {
            return {
                seller: {}, error: { httpStatus: 500, message: 'Failed to delete Immage File' },
            };
        }
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return {
            seller: null, error: { httpStatus: 500, message: 'Failed to delete Immage File' },
        };
    }
};

const findAll = async () => {
    try {
        const { result, error } = await sellerRepository.findAll();
        const sellers = await mappings.toSellerResponses(result)
        return { sellers, error: null }
    } catch (error) {
        return { sellers: [], error }
    }
};

const findById = async (oid) => {
    try {
        const { result, error } = await sellerRepository.findById(oid);
        if (error != null) {
            return { seller: {}, error }
        }
        if (result == null) {
            return {
                seller: null, error: {
                    httpStatus: 404,
                }
            }
        }
        const seller = await mappings.toSellerResponse(result)
        return { seller, error: null }
    } catch (error) {
        return {
            seller: [], error: { httpStatus: 500, message: 'Failed to delete Immage File' },
        }
    }

};

const findPage = async (condition, page, pageSize) => {
    try {
        const { count, errCount } = await sellerRepository.findCountByCriteria(condition);
        if (errCount) {
            return { sellers: [], count: 0, errCount }
        }
        const { result: sellers, error: error } = await sellerRepository.findByCriteria(condition, page, pageSize);
        if (error) {
            return { sellers: [], count: 0, errCount }
        }
        const sellerResponses = await mappings.toSellerResponses(sellers)
        return { sellers: sellerResponses, count, error: error };
    } catch (error) {
        return {
            sellers: [], count: 0,error: { httpStatus: 500, message: 'Failed to delete Immage File' },
        }
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