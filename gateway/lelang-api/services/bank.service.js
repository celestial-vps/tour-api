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

    const { result, err } = await bankRepository.save(data);
    await session.commitTransaction();
    session.endSession();

    if (err) {
      return { bank: null, err };
    }
    if (result) {
      const msgData = {
        value: data._id,
        name: data.bankName
      }
      const bank = await messageMaps.toMessageResponse(msgData);
      return { bank, err: null };
    } else {
      return {
        bank: {}, err: {
          httpStatus: 500,
        }
      };
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return {
      bank: null, err: {
        httpStatus: 500,
      }
    };
  }
};

const update = async (oid, dto, userOid) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {

    const { result: resultFind, err: errBank } = await bankRepository.findById(oid);
    if (errBank != null) {
      return { bank: {}, err: errBank }
    }
    if (resultFind == null) {
      return {
        bank: {}, err: {
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

    const { result, err } = await bankRepository.update(oid, resultFind);
    await session.commitTransaction();
    session.endSession();
    if (err) {
      return { bank: result, err };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.bankName
      }
      const bank = await messageMaps.toMessageResponse(msgData);
      return { bank, err: null };
    } else {
      return {
        bank: {}, err: {
          httpStatus: 500,
        }
      };
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return {
      bank: null, err: {
        httpStatus: 500,
      }
    };
  }
};

const deleted = async (oid) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {
    const { result: resultFind, err: errBank } = await bankRepository.findById(oid);
    if (errBank != null) {
      return { bank: {}, err: errBank }
    }
    if (resultFind == null) {
      return {
        bank: {}, err: {
          httpStatus: 404,
        }
      }
    }

    const { result, err } = await bankRepository.deleted(oid);
    await session.commitTransaction();
    session.endSession();
    if (err) {
      return { result: null, err };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.bankName
      }
      const bank = await messageMaps.toMessageResponse(msgData);
      return { bank, err: null };
    } else {
      return {
        bank: {}, err: {
          httpStatus: 500,
        }
      };
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return {
      bank: null, err: {
        httpStatus: 500,
      }
    };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await bankRepository.findAll();
    const banks = await mappings.toBankResponses(result)
    return { banks, err: null }
  } catch (err) {
    return { banks: [], err }
  }
};

const findById = async (oid) => {
  try {
    const { result, err } = await bankRepository.findById(oid);
    if (err != null) {
      return { bank: {}, err }
    }
    if (result == null) {
      return {
        bank: null, err: {
          httpStatus: 404,
        }
      }
    }
    const bank = await mappings.toBankResponse(result)
    return { bank, err: null }
  } catch (err) {
    return {
      bank: [], err: {
        httpStatus: 500,
      }
    }
  }

};

const findPage = async (condition, page, pageSize) => {
  try {
    const { count, errCount } = await bankRepository.findCountByCriteria(condition);
    if (errCount) {
      return { banks: [], count: 0, errCount }
    }
    const { result: banks, error:err } = await bankRepository.findByCriteria(condition, page, pageSize);
    if (err) {
      return { banks: [], count: 0, errCount }
    }
    const bankResponses = await mappings.toBankResponses(banks)
    return { banks: bankResponses, count, err: err };
  } catch (err) {
    return {
      banks: [], count: 0, err: {
        httpStatus: 500,
      }
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