const bidRepository = require('../repositories/bid.repository');
const mappings = require('../mappings/bid.vm');
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
      auctionId: dto.auctionId,
      userId: dto.userId,
      bidAmount: dto.bidAmount ?? null,
      bidTime: dto.bidTime ?? null,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, error } = await bidRepository.save(data);
    await session.commitTransaction();
    session.endSession();

    if (error) {
      return { bid: null, error };
    }
    if (result) {
      const msgData = {
        value: data._id,
        name: data.userId
      }
      const bid = await messageMaps.toMessageResponse(msgData);
      return { bid, error: null };
    } else {
      return {
        bid: {}, error: { httpStatus: 500, message: 'Failed to delete Bid' },
      };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return {
      bid: null,error: { httpStatus: 500, message: 'Failed to delete Bid' },
    };
  }
};

const update = async (oid, dto, userOid) => {  
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {

    const { result: resultFind, error: errBid } = await bidRepository.findById(oid);
    if (errBid != null) {
      return { bid: {}, error: errBid }
    }
    if (resultFind == null) {
      return {
        bid: {}, error: {
          httpStatus: 404,
        }
      }
    }

    resultFind.auctionId = dto.auctionId ?? resultFind.auctionId
    resultFind.userId = dto.userId ?? resultFind.userId
    resultFind.bidAmount = dto.bidAmount ?? resultFind.bidAmount
    resultFind.bidTime = dto.bidTime ?? resultFind.bidTime
    resultFind.lastModifiedBy = userOid ?? resultFind.lastModifiedBy
    resultFind.updatedAt = now

    const { result, error } = await bidRepository.update(oid, resultFind);
    await session.commitTransaction();
    session.endSession();
    if (error) {
      return { bid: result, error };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.userId
      }
      const bid = await messageMaps.toMessageResponse(msgData);
      return { bid, error: null };
    } else {
      return {
        bid: {}, error: { httpStatus: 500, message: 'Failed to delete Bid' },
      };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return {
      bid: null, error: { httpStatus: 500, message: 'Failed to delete Bid' },
    };
  }
};

const deleted = async (oid) => {  
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {
    const { result: resultFind, error: errBid } = await bidRepository.findById(oid);
    if (errBid != null) {
      return { bid: {}, error: errBid }
    }
    if (resultFind == null) {
      return {
        bid: {}, error: {
          httpStatus: 404,
        }
      }
    }

    const { result, error } = await bidRepository.deleted(oid);
    await session.commitTransaction();
    session.endSession();
    if (error) {
      return { result: null, error };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.userId
      }
      const bid = await messageMaps.toMessageResponse(msgData);
      return { bid, error: null };
    } else {
      return {
        bid: {}, error: { httpStatus: 500, message: 'Failed to delete Bid' },
      };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return {
      bid: null,error: { httpStatus: 500, message: 'Failed to delete Bid' },
    };
  }
};

const findAll = async () => {  
  try {
    const { result, error } = await bidRepository.findAll();
    const bids = await mappings.toBidResponses(result)
    return { bids, error: null }
  } catch (error) {
    return { bids: [], error }
  }
};

const findById = async (oid) => {  
  try {
    const { result, error } = await bidRepository.findById(oid);
    if (error != null) {
      return { bid: {}, error }
    }
    if (result == null) {
      return {
        bid: null, error: {
          httpStatus: 404,
        }
      }
    }
    const bid = await mappings.toBidResponse(result)
    return { bid, error: null }
  } catch (error) {
    return {
      bid: [], error: { httpStatus: 500, message: 'Failed to delete Bid' },
    }
  }

};

const findPage = async (condition, page, pageSize) => {
  try {
    const { count, errCount } = await bidRepository.findCountByCriteria(condition);
    if (errCount) {
      return { bids: [], count: 0, errCount }
    }
    const { bids, error } = await bidRepository.findByCriteria(condition, page, pageSize);
    if (error) {
      return { bids: [], count: 0, errCount }
    }
    const bidResponses = await mappings.toBidResponses(bids)
    return { bids: bidResponses, count, error: error };
  } catch (error) {
    return {
      bids: [], count: 0,error: { httpStatus: 500, message: 'Failed to delete Bid' },
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