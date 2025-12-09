const auctionRepository = require('../repositories/auction.repository');
const mappings = require('../mappings/auction.vm');
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
      itemOid: dto.itemOid ?? null,
      startTime: dto.startTime,
      endTime: dto.endTime,
      status: dto.status,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, err } = await auctionRepository.save(data);
    await session.commitTransaction();
    session.endSession();

    if (err) {
      return { auction: null, err };
    }
    if (result) {
      const msgData = {
        value: data._id,
        name: data.description
      }
      const auction = await messageMaps.toMessageResponse(msgData);
      return { auction, err: null };
    } else {
      return {
        auction: {}, err: {
          httpStatus: 500,
        }
      };
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return {
      auction: null, err: {
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

    const { result: resultFind, err: errAuction } = await auctionRepository.findById(oid);
    if (errAuction != null) {
      return { auction: {}, err: errAuction }
    }
    if (resultFind == null) {
      return {
        auction: {}, err: {
          httpStatus: 404,
        }
      }
    }

    resultFind.itemOid = dto.itemOid ?? resultFind.itemOid
    resultFind.startTime = dto.startTime ?? resultFind.startTime
    resultFind.endTime = dto.endTime ?? resultFind.endTime
    resultFind.status = dto.status ?? resultFind.status
    resultFind.lastModifiedBy = userOid ?? resultFind.lastModifiedBy
    resultFind.updatedAt = now

    const { result, err } = await auctionRepository.update(oid, resultFind);
    await session.commitTransaction();
    session.endSession();
    if (err) {
      return { auction: result, err };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.description
      }
      const auction = await messageMaps.toMessageResponse(msgData);
      return { auction, err: null };
    } else {
      return {
        auction: {}, err: {
          httpStatus: 500,
        }
      };
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return {
      auction: null, err: {
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
    const { result: resultFind, err: errAuction } = await auctionRepository.findById(oid);
    if (errAuction != null) {
      return { auction: {}, err: errAuction }
    }
    if (resultFind == null) {
      return {
        auction: {}, err: {
          httpStatus: 404,
        }
      }
    }

    const { result, err } = await auctionRepository.deleted(oid);
    await session.commitTransaction();
    session.endSession();
    if (err) {
      return { result: null, err };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.description
      }
      const auction = await messageMaps.toMessageResponse(msgData);
      return { auction, err: null };
    } else {
      return {
        auction: {}, err: {
          httpStatus: 500,
        }
      };
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return {
      auction: null, err: {
        httpStatus: 500,
      }
    };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await auctionRepository.findAll();
    const auctions = await mappings.toAuctionResponses(result)
    return { auctions, err: null }
  } catch (err) {
    return { auctions: [], err }
  }
};

const findById = async (oid) => {
  try {
    const { result, err } = await auctionRepository.findById(oid);
    if (err != null) {
      return { auction: {}, err }
    }
    if (result == null) {
      return {
        auction: null, err: {
          httpStatus: 404,
        }
      }
    }
    const auction = await mappings.toAuctionResponse(result)
    return { auction, err: null }
  } catch (err) {
    return {
      auction: [], err: {
        httpStatus: 500,
      }
    }
  }

};

const findPage = async (condition, page, pageSize) => {
  try {
    const filterCondition = {
      categoryName: condition.search
    };


    const { count, errCount } = await auctionRepository.findCountByCriteria(filterCondition);
    if (errCount) {
      return { auctions: [], count: 0, errCount }
    }
    const { auctions, err } = await auctionRepository.findByCriteria(filterCondition, page, pageSize);
    if (err) {
      return { auctions: [], count: 0, errCount }
    }
    const auctionResponses = await mappings.toAuctionResponses(auctions)
    return { auctions: auctionResponses, count, err: err };
  } catch (err) {
    return {
      auctions: [], count: 0, err: {
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