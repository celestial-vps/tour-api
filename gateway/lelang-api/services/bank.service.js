const bankRepository = require('../repositories/bank.repository');
const mappings = require('../mappings/bank.vm');
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
      bankCode: dto.bankCode,
      bankName: dto.bankName,
      shortName: dto.shortName ?? null,
      description: dto.description ?? null,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, error } = await bankRepository.save(data);
    await session.commitTransaction();
    session.endSession();

    if (error) {
      return { bank: null, error };
    }
    if (result) {
      const msgData = {
        value: data._id,
        name: data.bankName
      }
      const bank = await messageMaps.toMessageResponse(msgData);
      return { bank, error: null };
    } else {
      return {
        bank: {}, error: { httpStatus: 500, message: 'Failed to delete Bank' },
      };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return {
      bank: null, error: { httpStatus: 500, message: 'Failed to delete Bank' },
    };
  }
};

const update = async (oid, dto, userOid) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {

    const { result: resultFind, error: errBank } = await bankRepository.findById(oid);
    if (errBank != null) {
      return { bank: {}, error: errBank }
    }
    if (resultFind == null) {
      return {
        bank: {}, error: {
          httpStatus: 404,
        }
      }
    }

    resultFind.bankCode = dto.bankCode ?? resultFind.bankCode
    resultFind.bankName = dto.bankName ?? resultFind.bankName
    resultFind.shortName = dto.shortName ?? resultFind.shortName
    resultFind.description = dto.description ?? resultFind.description
    resultFind.lastModifiedBy = userOid ?? resultFind.lastModifiedBy
    resultFind.updatedAt = now

    const { result, error } = await bankRepository.update(oid, resultFind);
    await session.commitTransaction();
    session.endSession();
    if (error) {
      return { bank: result, error };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.bankName
      }
      const bank = await messageMaps.toMessageResponse(msgData);
      return { bank, error: null };
    } else {
      return {
        bank: {},error: { httpStatus: 500, message: 'Failed to delete Bank' },
      };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return {
      bank: null, error: { httpStatus: 500, message: 'Failed to delete Bank' },
    };
  }
};

const deleted = async (oid) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {
    const { result: resultFind, error: errBank } = await bankRepository.findById(oid);
    if (errBank != null) {
      return { bank: {}, error: errBank }
    }
    if (resultFind == null) {
      return {
        bank: {}, error: {
          httpStatus: 404,
        }
      }
    }

    const { result, error } = await bankRepository.deleted(oid);
    await session.commitTransaction();
    session.endSession();
    if (error) {
      return { result: null, error };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.bankName
      }
      const bank = await messageMaps.toMessageResponse(msgData);
      return { bank, error: null };
    } else {
      return {
        bank: {}, error: { httpStatus: 500, message: 'Failed to delete Bank' },
      };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return {
      bank: null,error: { httpStatus: 500, message: 'Failed to delete Bank' },
    };
  }
};

const findAll = async () => {
  try {
    const { result, error } = await bankRepository.findAll();
    const banks = await mappings.toBankResponses(result)
    return { banks, error: null }
  } catch (error) {
    return { banks: [], error }
  }
};

const findById = async (oid) => {
  try {
    const { result, error } = await bankRepository.findById(oid);
    if (error != null) {
      return { bank: {}, error }
    }
    if (result == null) {
      return {
        bank: null, error: {
          httpStatus: 404,
        }
      }
    }
    const bank = await mappings.toBankResponse(result)
    return { bank, error: null }
  } catch (error) {
    return {
      bank: [], error: { httpStatus: 500, message: 'Failed to delete Bank' },
    }
  }

};

const findPage = async (condition, options) => {
  try {
    const { count, errCount } = await bankRepository.findCountByCriteria(condition);
    if (errCount) {
      return { banks: [], count: 0, errCount }
    }
    const { result: banks, error:error } = await bankRepository.findByCriteria(condition,options.pageIndex, options.pageSize);
    if (error) {
      return { banks: [], count: 0, errCount }
    }
    const bankResponses = await mappings.toBankResponses(banks)
    return { banks: bankResponses, count, error: error };
  } catch (error) {
    return {
      banks: [], count: 0, error: { httpStatus: 500, message: 'Failed to delete Bank' },
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