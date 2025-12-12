const itemRepository = require('../repositories/item.repository');
const mappings = require('../mappings/item.vm');
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
      itemCategoryOid: dto.itemCategoryOid ?? null,
      itemName: dto.itemName, 
      imageOid: dto.imageOid ?? null,
      startingPrice: dto.startingPrice ?? null,
      seller: dto.seller ?? null,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, error } = await itemRepository.save(data);
    await session.commitTransaction();
    session.endSession();

    if (error) {
      return { item: null, error };
    }
    if (result) {
      const msgData = {
        value: data._id,
        name: data.description
      }
      const item = await messageMaps.toMessageResponse(msgData);
      return { item, error: null };
    } else {
      return {
        item: {}, error: { httpStatus: 500, message: 'Failed to delete Immage File' },
      };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return {
      item: null, error: { httpStatus: 500, message: 'Failed to delete Immage File' },
    };
  }
};

const update = async (oid, dto, userOid) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {

    const { result: resultFind, error: errItem } = await itemRepository.findById(oid);
    if (errItem != null) {
      return { item: {}, error: errItem }
    }
    if (resultFind == null) {
      return {
        item: {}, error: {
          httpStatus: 404,
        }
      }
    }

    resultFind.itemCategoryOid = dto.itemCategoryOid ?? resultFind.itemCategoryOid
    resultFind.itemName = dto.itemName ?? resultFind.itemName 
    resultFind.imageOid = dto.imageOid ?? resultFind.imageOid
    resultFind.startingPrice = dto.startingPrice ?? resultFind.startingPrice
    resultFind.seller = dto.seller ?? resultFind.seller
    resultFind.lastModifiedBy = userOid ?? resultFind.lastModifiedBy
    resultFind.updatedAt = now

    const { result, error } = await itemRepository.update(oid, resultFind);
    await session.commitTransaction();
    session.endSession();
    if (error) {
      return { item: result, error };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.description
      }
      const item = await messageMaps.toMessageResponse(msgData);
      return { item, error: null };
    } else {
      return {
        item: {}, error: { httpStatus: 500, message: 'Failed to delete Immage File' },
      };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return {
      item: null, error: { httpStatus: 500, message: 'Failed to delete Immage File' },
    };
  }
};

const deleted = async (oid) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {
    const { result: resultFind, error: errItem } = await itemRepository.findById(oid);
    if (errItem != null) {
      return { item: {}, error: errItem }
    }
    if (resultFind == null) {
      return {
        item: {}, error: {
          httpStatus: 404,
        }
      }
    }

    const { result, error } = await itemRepository.deleted(oid);
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
      const item = await messageMaps.toMessageResponse(msgData);
      return { item, error: null };
    } else {
      return {
        item: {}, error: { httpStatus: 500, message: 'Failed to delete Immage File' },
      };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return {
      item: null, error: { httpStatus: 500, message: 'Failed to delete Immage File' },
    };
  }
};

const findAll = async () => {
  try {
    const { result, error } = await itemRepository.findAll();
    const items = await mappings.toItemResponses(result)
    return { items, error: null }
  } catch (error) {
    return { items: [], error }
  }
};

const findById = async (oid) => {
  try {
    const { result, error } = await itemRepository.findById(oid);
    if (error != null) {
      return { item: {}, error }
    }
    if (result == null) {
      return {
        item: null, error: {
          httpStatus: 404,
        }
      }
    }
    const item = await mappings.toItemResponse(result)
    return { item, error: null }
  } catch (error) {
    return {
      item: [], error: { httpStatus: 500, message: 'Failed to delete Immage File' },
    }
  }

};

const findPage = async (condition, page, pageSize) => {
  try {
    const filterCondition = {
      itemName: condition.search
    };
    const { count, errCount } = await itemRepository.findCountByCriteria(filterCondition);
    if (errCount) {
      return { items: [], count: 0, errCount }
    }
    const { items, error } = await itemRepository.findByCriteria(filterCondition, page, pageSize);
    if (error) {
      return { items: [], count: 0, errCount }
    }
    const itemResponses = await mappings.toItemResponses(items)
    return { items: itemResponses, count, error: error };
  } catch (error) {
    return {
      items: [], count: 0, error: { httpStatus: 500, message: 'Failed to delete Immage File' },
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