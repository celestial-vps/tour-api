const itemCategoryRepository = require('../repositories/item-category.repository');
const mappings = require('../mappings/item-category.vm');
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
      _id: uuidv4(),//new mongoose.Types.ObjectId(),
      categoryName: dto.categoryName,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, err } = await itemCategoryRepository.save(data);
    await session.commitTransaction();
    session.endSession();

    if (err) {
      return { itemCategory: null, err };
    }
    if (result) {
      const msgData = {
        value: data._id,
        name: data.categoryName
      }
      const itemCategory = await messageMaps.toMessageResponse(msgData);
      return { itemCategory, err: null };
    } else {
      return {
        itemCategory: {}, err: {
          httpStatus: 500,
        }
      };
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return {
      itemCategory: null, err: {
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

    const { result: resultFind, err: errItemCategory } = await itemCategoryRepository.findById(oid);
    if (errItemCategory != null) {
      return { itemCategory: {}, err: errItemCategory }
    }
    if (resultFind == null) {
      return {
        itemCategory: {}, err: {
          httpStatus: 404,
        }
      }
    }

    resultFind.categoryName = dto.categoryName ?? resultFind.categoryName
    resultFind.lastModifiedBy = userOid ?? resultFind.lastModifiedBy
    resultFind.updatedAt = now

    const { result, err } = await itemCategoryRepository.update(oid, resultFind);
    await session.commitTransaction();
    session.endSession();
    if (err) {
      return { itemCategory: result, err };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.categoryName
      }
      const itemCategory = await messageMaps.toMessageResponse(msgData);
      return { itemCategory, err: null };
    } else {
      return {
        itemCategory: {}, err: {
          httpStatus: 500,
        }
      };
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return {
      itemCategory: null, err: {
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
    const { result: resultFind, err: errItemCategory } = await itemCategoryRepository.findById(oid);
    if (errItemCategory != null) {
      return { itemCategory: {}, err: errItemCategory }
    }
    if (resultFind == null) {
      return {
        itemCategory: {}, err: {
          httpStatus: 404,
        }
      }
    }

    const { result, err } = await itemCategoryRepository.deleted(oid);
    await session.commitTransaction();
    session.endSession();
    if (err) {
      return { result: null, err };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.categoryName
      }
      const itemCategory = await messageMaps.toMessageResponse(msgData);
      return { itemCategory, err: null };
    } else {
      return {
        itemCategory: {}, err: {
          httpStatus: 500,
        }
      };
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return {
      itemCategory: null, err: {
        httpStatus: 500,
      }
    };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await itemCategoryRepository.findAll();
    const itemCategorys = await mappings.toItemCategoryResponses(result)
    return { itemCategorys, err: null }
  } catch (err) {
    return { itemCategorys: [], err }
  }
};

const findById = async (oid) => {
  try {
    const { result, err } = await itemCategoryRepository.findById(oid);
    if (err != null) {
      return { itemCategory: {}, err }
    }
    if (result == null) {
      return {
        itemCategory: null, err: {
          httpStatus: 404,
        }
      }
    }
    const itemCategory = await mappings.toItemCategoryResponse(result)
    return { itemCategory, err: null }
  } catch (err) {
    return {
      itemCategory: [], err: {
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


    const { count, errCount } = await itemCategoryRepository.findCountByCriteria(filterCondition);
    if (errCount) {
      return { itemCategorys: [], count: 0, errCount }
    }
    const { result, err } = await itemCategoryRepository.findByCriteria(filterCondition, page, pageSize);
    if (err) {
      return { itemCategorys: [], count: 0, errCount }
    }
    const itemCategoryResponses = await mappings.toItemCategoryResponses(result)
    return { itemCategorys: itemCategoryResponses, count, err: err };
  } catch (err) {
    return {
      itemCategorys: [], count: 0, err: {
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