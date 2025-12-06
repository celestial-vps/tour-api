const bidderRepository = require('../repositories/bidder.repository');
const mappings = require('../mappings/bidder.vm');
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
      bidderCode: dto.bidderCode,
      bidderName: dto.bidderName,
      shortName: dto.shortName ?? null,
      description: dto.description ?? null,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, err } = await bidderRepository.save(data);
    await session.commitTransaction();
    session.endSession();

    if (err) {
      return { bidder: null, err };
    }
    if (result) {
      const msgData = {
        value: data._id,
        name: data.bidderName
      }
      const bidder = await messageMaps.toMessageResponse(msgData);
      return { bidder, err: null };
    } else {
      return {
        bidder: {}, err: {
          httpStatus: 500,
        }
      };
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return {
      bidder: null, err: {
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

    const { result: resultFind, err: errBidder } = await bidderRepository.findById(oid);
    if (errBidder != null) {
      return { bidder: {}, err: errBidder }
    }
    if (resultFind == null) {
      return {
        bidder: {}, err: {
          httpStatus: 404,
        }
      }
    }

    resultFind.bidderCode = dto.bidderCode ?? resultFind.bidderCode
    resultFind.bidderName = dto.bidderName ?? resultFind.bidderName
    resultFind.shortName = dto.shortName ?? resultFind.shortName
    resultFind.description = dto.description ?? resultFind.description
    resultFind.lastModifiedBy = userOid ?? resultFind.lastModifiedBy
    resultFind.updatedAt = now

    const { result, err } = await bidderRepository.update(oid, resultFind);
    await session.commitTransaction();
    session.endSession();
    if (err) {
      return { bidder: result, err };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.bidderName
      }
      const bidder = await messageMaps.toMessageResponse(msgData);
      return { bidder, err: null };
    } else {
      return {
        bidder: {}, err: {
          httpStatus: 500,
        }
      };
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return {
      bidder: null, err: {
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
    const { result: resultFind, err: errBidder } = await bidderRepository.findById(oid);
    if (errBidder != null) {
      return { bidder: {}, err: errBidder }
    }
    if (resultFind == null) {
      return {
        bidder: {}, err: {
          httpStatus: 404,
        }
      }
    }

    const { result, err } = await bidderRepository.deleted(oid);
    await session.commitTransaction();
    session.endSession();
    if (err) {
      return { result: null, err };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.bidderName
      }
      const bidder = await messageMaps.toMessageResponse(msgData);
      return { bidder, err: null };
    } else {
      return {
        bidder: {}, err: {
          httpStatus: 500,
        }
      };
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return {
      bidder: null, err: {
        httpStatus: 500,
      }
    };
  }
};

const findAll = async () => {  
  try {
    const { result, err } = await bidderRepository.findAll();
    const bidders = await mappings.toBidderResponses(result)
    return { bidders, err: null }
  } catch (err) {
    return { bidders: [], err }
  }
};

const findById = async (oid) => {  
  try {
    const { result, err } = await bidderRepository.findById(oid);
    if (err != null) {
      return { bidder: {}, err }
    }
    if (result == null) {
      return {
        bidder: null, err: {
          httpStatus: 404,
        }
      }
    }
    const bidder = await mappings.toBidderResponse(result)
    return { bidder, err: null }
  } catch (err) {
    return {
      bidder: [], err: {
        httpStatus: 500,
      }
    }
  }

};

const findPage = async (condition, page, pageSize) => {
  try {
    const { count, errCount } = await bidderRepository.findCountByCriteria(condition);
    if (errCount) {
      return { bidders: [], count: 0, errCount }
    }
    const { bidders, err } = await bidderRepository.findByCriteria(condition, page, pageSize);
    if (err) {
      return { bidders: [], count: 0, errCount }
    }
    const bidderResponses = await mappings.toBidderResponses(bidders)
    return { bidders: bidderResponses, count, err: err };
  } catch (err) {
    return {
      bidders: [], count: 0, err: {
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