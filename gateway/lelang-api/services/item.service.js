const itemRepository = require('../repositories/item.repository');
const mappings = require('../mappings/item.vm');
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
      itemCategoryOid: dto.itemCategoryOid ?? null,
      itemName: dto.itemName,
      description: dto.description,
      imageOid: dto.imageOid ?? null,
      startingPrice: dto.startingPrice ?? null,
      owner: dto.owner ?? null,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, err } = await itemRepository.save(data);
    await session.commitTransaction();
    session.endSession();

    if (err) {
      return { item: null, err };
    }
    if (result) {
      const msgData = {
        value: data._id,
        name: data.description
      }
      const item = await messageMaps.toMessageResponse(msgData);
      return { item, err: null };
    } else {
      return {
        item: {}, err: {
          httpStatus: 500,
        }
      };
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return {
      item: null, err: {
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

    const { result: resultFind, err: errItem } = await itemRepository.findById(oid);
    if (errItem != null) {
      return { item: {}, err: errItem }
    }
    if (resultFind == null) {
      return {
        item: {}, err: {
          httpStatus: 404,
        }
      }
    }

    resultFind.itemCategoryOid = dto.itemCategoryOid ?? resultFind.itemCategoryOid
    resultFind.itemName = dto.itemName ?? resultFind.itemName
    resultFind.description = dto.description ?? resultFind.description
    resultFind.imageOid = dto.imageOid ?? resultFind.imageOid
    resultFind.startingPrice = dto.startingPrice ?? resultFind.startingPrice
    resultFind.owner = dto.owner ?? resultFind.owner
    resultFind.lastModifiedBy = userOid ?? resultFind.lastModifiedBy
    resultFind.updatedAt = now

    const { result, err } = await itemRepository.update(oid, resultFind);
    await session.commitTransaction();
    session.endSession();
    if (err) {
      return { item: result, err };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.description
      }
      const item = await messageMaps.toMessageResponse(msgData);
      return { item, err: null };
    } else {
      return {
        item: {}, err: {
          httpStatus: 500,
        }
      };
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return {
      item: null, err: {
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
    const { result: resultFind, err: errItem } = await itemRepository.findById(oid);
    if (errItem != null) {
      return { item: {}, err: errItem }
    }
    if (resultFind == null) {
      return {
        item: {}, err: {
          httpStatus: 404,
        }
      }
    }

    const { result, err } = await itemRepository.deleted(oid);
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
      const item = await messageMaps.toMessageResponse(msgData);
      return { item, err: null };
    } else {
      return {
        item: {}, err: {
          httpStatus: 500,
        }
      };
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return {
      item: null, err: {
        httpStatus: 500,
      }
    };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await itemRepository.findAll();
    const items = await mappings.toItemResponses(result)
    return { items, err: null }
  } catch (err) {
    return { items: [], err }
  }
};

const findById = async (oid) => {
  try {
    const { result, err } = await itemRepository.findById(oid);
    if (err != null) {
      return { item: {}, err }
    }
    if (result == null) {
      return {
        item: null, err: {
          httpStatus: 404,
        }
      }
    }
    const item = await mappings.toItemResponse(result)
    return { item, err: null }
  } catch (err) {
    return {
      item: [], err: {
        httpStatus: 500,
      }
    }
  }

};

const findPage = async (condition, page, pageSize) => {
  try {
    const { count, errCount } = await itemRepository.findCountByCriteria(condition);
    if (errCount) {
      return { items: [], count: 0, errCount }
    }
    const { items, err } = await itemRepository.findByCriteria(condition, page, pageSize);
    if (err) {
      return { items: [], count: 0, errCount }
    }
    const itemResponses = await mappings.toItemResponses(items)
    return { items: itemResponses, count, err: err };
  } catch (err) {
    return {
      items: [], count: 0, err: {
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