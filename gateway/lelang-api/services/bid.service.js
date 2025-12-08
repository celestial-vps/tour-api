const bidRepository = require('../repositories/bid.repository');
const mappings = require('../mappings/bid.vm');
const moment = require('moment');
const messageMaps = require('../mappings/message.vm');
const mongoose = require('mongoose');
const buildBesponse = require('../common/build.response');

const create = async (dto, userOid) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {

    const data = {
      _id: new mongoose.Types.ObjectId(),
      auctionId: dto.auctionId,
      userId: dto.userId,
      bidAmount: dto.bidAmount ?? null,
      bidTime: dto.bidTime ?? null,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, err } = await bidRepository.save(data);
    await session.commitTransaction();
    session.endSession();

    if (err) {
      return { bid: null, err };
    }
    if (result) {
      const msgData = {
        value: data._id,
        name: data.userId
      }
      const bid = await messageMaps.toMessageResponse(msgData);
      return { bid, err: null };
    } else {
      return {
        bid: {}, err: {
          httpStatus: 500,
        }
      };
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return {
      bid: null, err: {
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

    const { result: resultFind, err: errBid } = await bidRepository.findById(oid);
    if (errBid != null) {
      return { bid: {}, err: errBid }
    }
    if (resultFind == null) {
      return {
        bid: {}, err: {
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

    const { result, err } = await bidRepository.update(oid, resultFind);
    await session.commitTransaction();
    session.endSession();
    if (err) {
      return { bid: result, err };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.userId
      }
      const bid = await messageMaps.toMessageResponse(msgData);
      return { bid, err: null };
    } else {
      return {
        bid: {}, err: {
          httpStatus: 500,
        }
      };
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return {
      bid: null, err: {
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
    const { result: resultFind, err: errBid } = await bidRepository.findById(oid);
    if (errBid != null) {
      return { bid: {}, err: errBid }
    }
    if (resultFind == null) {
      return {
        bid: {}, err: {
          httpStatus: 404,
        }
      }
    }

    const { result, err } = await bidRepository.deleted(oid);
    await session.commitTransaction();
    session.endSession();
    if (err) {
      return { result: null, err };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.userId
      }
      const bid = await messageMaps.toMessageResponse(msgData);
      return { bid, err: null };
    } else {
      return {
        bid: {}, err: {
          httpStatus: 500,
        }
      };
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return {
      bid: null, err: {
        httpStatus: 500,
      }
    };
  }
};

const findAll = async () => {  
  try {
    const { result, err } = await bidRepository.findAll();
    const bids = await mappings.toBidResponses(result)
    return { bids, err: null }
  } catch (err) {
    return { bids: [], err }
  }
};

const findById = async (oid) => {  
  try {
    const { result, err } = await bidRepository.findById(oid);
    if (err != null) {
      return { bid: {}, err }
    }
    if (result == null) {
      return {
        bid: null, err: {
          httpStatus: 404,
        }
      }
    }
    const bid = await mappings.toBidResponse(result)
    return { bid, err: null }
  } catch (err) {
    return {
      bid: [], err: {
        httpStatus: 500,
      }
    }
  }

};

const findPage = async (condition, page, pageSize) => {
  try {
    const { count, errCount } = await bidRepository.findCountByCriteria(condition);
    if (errCount) {
      return { bids: [], count: 0, errCount }
    }
    const { bids, err } = await bidRepository.findByCriteria(condition, page, pageSize);
    if (err) {
      return { bids: [], count: 0, errCount }
    }
    const bidResponses = await mappings.toBidResponses(bids)
    return { bids: bidResponses, count, err: err };
  } catch (err) {
    return {
      bids: [], count: 0, err: {
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