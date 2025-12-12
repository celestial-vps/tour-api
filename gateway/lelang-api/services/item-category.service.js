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

    const { result, error } = await itemCategoryRepository.save(data);
    await session.commitTransaction();
    session.endSession();

    if (error) {
      return { itemCategory: null, error };
    }
    if (result) {
      const msgData = {
        value: data._id,
        name: data.categoryName
      }
      const itemCategory = await messageMaps.toMessageResponse(msgData);
      return { itemCategory, error: null };
    } else {
      return {
        itemCategory: {}, error: { httpStatus: 500, message: 'Failed to delete Immage File' },
      };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return {
      itemCategory: null, error: { httpStatus: 500, message: 'Failed to delete Immage File' },
    };
  }
};

const update = async (oid, dto, userOid) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {

    const { result: resultFind, error: errItemCategory } = await itemCategoryRepository.findById(oid);
    if (errItemCategory != null) {
      return { itemCategory: {}, error: errItemCategory }
    }
    if (resultFind == null) {
      return {
        itemCategory: {}, error: {
          httpStatus: 404,
        }
      }
    }

    resultFind.categoryName = dto.categoryName ?? resultFind.categoryName
    resultFind.lastModifiedBy = userOid ?? resultFind.lastModifiedBy
    resultFind.updatedAt = now

    const { result, error } = await itemCategoryRepository.update(oid, resultFind);
    await session.commitTransaction();
    session.endSession();
    if (error) {
      return { itemCategory: result, error };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.categoryName
      }
      const itemCategory = await messageMaps.toMessageResponse(msgData);
      return { itemCategory, error: null };
    } else {
      return {
        itemCategory: {}, error: { httpStatus: 500, message: 'Failed to delete Immage File' },
      };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return {
      itemCategory: null, error: { httpStatus: 500, message: 'Failed to delete Immage File' },
    };
  }
};

const deleted = async (oid) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {
    const { result: resultFind, error: errItemCategory } = await itemCategoryRepository.findById(oid);
    if (errItemCategory != null) {
      return { itemCategory: {}, error: errItemCategory }
    }
    if (resultFind == null) {
      return {
        itemCategory: {}, error: {
          httpStatus: 404,
        }
      }
    }

    const { result, error } = await itemCategoryRepository.deleted(oid);
    await session.commitTransaction();
    session.endSession();
    if (error) {
      return { result: null, error };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.categoryName
      }
      const itemCategory = await messageMaps.toMessageResponse(msgData);
      return { itemCategory, error: null };
    } else {
      return {
        itemCategory: {},error: { httpStatus: 500, message: 'Failed to delete Immage File' },
      };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return {
      itemCategory: null,error: { httpStatus: 500, message: 'Failed to delete Immage File' },
    };
  }
};

const findAll = async () => {
  try {
    const { result, error } = await itemCategoryRepository.findAll();
    const itemCategorys = await mappings.toItemCategoryResponses(result)
    return { itemCategorys, error: null }
  } catch (error) {
    return { itemCategorys: [], error }
  }
};

const findById = async (oid) => {
  try {
    const { result, error } = await itemCategoryRepository.findById(oid);
    if (error != null) {
      return { itemCategory: {}, error }
    }
    if (result == null) {
      return {
        itemCategory: null, error: {
          httpStatus: 404,
        }
      }
    }
    const itemCategory = await mappings.toItemCategoryResponse(result)
    return { itemCategory, error: null }
  } catch (error) {
    return {
      itemCategory: [], error: { httpStatus: 500, message: 'Failed to delete Immage File' },
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
    const { result, error } = await itemCategoryRepository.findByCriteria(filterCondition, page, pageSize);
    if (error) {
      return { itemCategorys: [], count: 0, errCount }
    }
    const itemCategoryResponses = await mappings.toItemCategoryResponses(result)
    return { itemCategorys: itemCategoryResponses, count, error: error };
  } catch (error) {
    return {
      itemCategorys: [], count: 0,error: { httpStatus: 500, message: 'Failed to delete Immage File' },
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