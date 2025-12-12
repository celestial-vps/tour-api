const bidderRepository = require('../repositories/bidder.repository');
const mappings = require('../mappings/bidder.vm');
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
      fullName: dto.fullName,
      ktpNumber: dto.ktpNumber,
      address: dto.address ?? null,
      phone: dto.phone ?? null,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, error } = await bidderRepository.save(data);
    await session.commitTransaction();
    session.endSession();

    if (error) {
      return { bidder: null, error };
    }
    if (result) {
      const msgData = {
        value: data._id,
        name: data.ktpNumber
      }
      const bidder = await messageMaps.toMessageResponse(msgData);
      return { bidder, error: null };
    } else {
      return {
        bidder: {}, error: { httpStatus: 500, message: 'Failed to delete Bidde' },
      };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return {
      bidder: null, error: { httpStatus: 500, message: 'Failed to delete Bidde' },
    };
  }
};

const update = async (oid, dto, userOid) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {

    const { result: resultFind, error: errBidder } = await bidderRepository.findById(oid);
    if (errBidder != null) {
      return { bidder: {}, error: errBidder }
    }
    if (resultFind == null) {
      return {
        bidder: {}, error: {
          httpStatus: 404,
        }
      }
    }
    resultFind.userId = userOid ?? resultFind.userId
    resultFind.fullName = dto.fullName ?? resultFind.fullName
    resultFind.ktpNumber = dto.ktpNumber ?? resultFind.ktpNumber
    resultFind.address = dto.address ?? resultFind.address
    resultFind.phone = dto.phone ?? resultFind.phone
    resultFind.lastModifiedBy = userOid ?? resultFind.lastModifiedBy
    resultFind.updatedAt = now

    const { result, error } = await bidderRepository.update(oid, resultFind);
    await session.commitTransaction();
    session.endSession();
    if (error) {
      return { bidder: result, error };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.ktpNumber
      }
      const bidder = await messageMaps.toMessageResponse(msgData);
      return { bidder, error: null };
    } else {
      return {
        bidder: {}, error: { httpStatus: 500, message: 'Failed to delete Bidde' },
      };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return {
      bidder: null, error: { httpStatus: 500, message: 'Failed to delete Bidde' },
    };
  }
};

const deleted = async (oid) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {
    const { result: resultFind, error: errBidder } = await bidderRepository.findById(oid);
    if (errBidder != null) {
      return { bidder: {}, error: errBidder }
    }
    if (resultFind == null) {
      return {
        bidder: {}, error: {
          httpStatus: 404,
        }
      }
    }

    const { result, error } = await bidderRepository.deleted(oid);
    await session.commitTransaction();
    session.endSession();
    if (error) {
      return { result: null, error };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.ktpNumber
      }
      const bidder = await messageMaps.toMessageResponse(msgData);
      return { bidder, error: null };
    } else {
      return {
        bidder: {}, error: { httpStatus: 500, message: 'Failed to delete Bidde' },
      };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return {
      bidder: null, error: { httpStatus: 500, message: 'Failed to delete Bidde' },
    };
  }
};

const findAll = async () => {
  try {
    const { result, error } = await bidderRepository.findAll();
    const bidders = await mappings.toBidderResponses(result)
    return { bidders, error: null }
  } catch (error) {
    return { bidders: [], error }
  }
};

const findById = async (oid) => {
  try {
    const { result, error } = await bidderRepository.findById(oid);
    if (error != null) {
      return { bidder: {}, error }
    }
    if (result == null) {
      return {
        bidder: null, error: {
          httpStatus: 404,
        }
      }
    }
    const bidder = await mappings.toBidderResponse(result)
    return { bidder, error: null }
  } catch (error) {
    return {
      bidder: [], error: { httpStatus: 500, message: 'Failed to delete Bidde' },
    }
  }

};

const findPage = async (condition, page, pageSize) => {
  try {
    const { count, errCount } = await bidderRepository.findCountByCriteria(condition);
    if (errCount) {
      return { bidders: [], count: 0, errCount }
    }
    const { result:bidders, error } = await bidderRepository.findByCriteria(condition, page, pageSize);
    if (error) {
      return { bidders: [], count: 0, errCount }
    }
    const bidderResponses = await mappings.toBidderResponses(bidders)
    return { bidders: bidderResponses, count, error: error };
  } catch (error) {
    return {
      bidders: [], count: 0, error: { httpStatus: 500, message: 'Failed to delete Bidde' },
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