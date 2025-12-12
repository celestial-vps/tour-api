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

    const { result, error } = await auctionRepository.save(data);
    await session.commitTransaction();
    session.endSession();

    if (error) {
      return { auction: null, error };
    }
    if (result) {
      const msgData = {
        value: data._id,
        name: data.description
      }
      const auction = await messageMaps.toMessageResponse(msgData);
      return { auction, error: null };
    } else {
      return {
        auction: {},  error: { httpStatus: 500, message: 'Failed to delete Auction' },
      };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return {
      auction: null, error: { httpStatus: 500, message: 'Failed to delete Auction' },
    };
  }
};

const update = async (oid, dto, userOid) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {

    const { result: resultFind, error: errAuction } = await auctionRepository.findById(oid);
    if (errAuction != null) {
      return { auction: {}, error: errAuction }
    }
    if (resultFind == null) {
      return {
        auction: {}, error: {
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

    const { result, error } = await auctionRepository.update(oid, resultFind);
    await session.commitTransaction();
    session.endSession();
    if (error) {
      return { auction: result, error };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.description
      }
      const auction = await messageMaps.toMessageResponse(msgData);
      return { auction, error: null };
    } else {
      return {
        auction: {}, eerror: { httpStatus: 500, message: 'Failed to delete Auction' },
      };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return {
      auction: null, error: { httpStatus: 500, message: 'Failed to delete Auction' },
    };
  }
};

const deleted = async (oid) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {
    const { result: resultFind, error: errAuction } = await auctionRepository.findById(oid);
    if (errAuction != null) {
      return { auction: {}, error: errAuction }
    }
    if (resultFind == null) {
      return {
        auction: {}, error: {
          httpStatus: 404,
        }
      }
    }

    const { result, error } = await auctionRepository.deleted(oid);
    await session.commitTransaction();
    session.endSession();
    if (error) {
      return { result: null, error };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.description
      }
      const auction = await messageMaps.toMessageResponse(msgData);
      return { auction, error: null };
    } else {
      return {
        auction: {}, error: { httpStatus: 500, message: 'Failed to delete Auction' },
      };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return {
      auction: null, error: { httpStatus: 500, message: 'Failed to delete Auction' },
    };
  }
};

const findAll = async () => {
  try {
    const { result, error } = await auctionRepository.findAll();
    const auctions = await mappings.toAuctionResponses(result)
    return { auctions, error: null }
  } catch (error) {
    return { auctions: [], error }
  }
};

const findById = async (oid) => {
  try {
    const { result, error } = await auctionRepository.findById(oid);
    if (error != null) {
      return { auction: {}, error }
    }
    if (result == null) {
      return {
        auction: null, error: {
          httpStatus: 404,
        }
      }
    }
    const auction = await mappings.toAuctionResponse(result)
    return { auction, error: null }
  } catch (error) {
    return {
      auction: [],error: { httpStatus: 500, message: 'Failed to delete Auction' },
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
    const { auctions, error } = await auctionRepository.findByCriteria(filterCondition, page, pageSize);
    if (error) {
      return { auctions: [], count: 0, errCount }
    }
    const auctionResponses = await mappings.toAuctionResponses(auctions)
    return { auctions: auctionResponses, count, error: error };
  } catch (error) {
    return {
      auctions: [], count: 0, error: { httpStatus: 500, message: 'Failed to delete Auction' },
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