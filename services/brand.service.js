const brandRepository = require('../repositories/brand.repository');
const mappings = require('../mappings/brand.vm');
const messageMaps = require('../mappings/message.vm');
const sequelize = require('../config/sequelize');
const moment = require('moment');

const create = async (dto, userOid) => {
  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {
    const data = {      
      brandName: dto.brandName,      
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };
    const transaction = await sequelize.transaction();
    const { result, err } = await brandRepository.save(data, { transaction });
    if (err !== null) {
      await transaction.rollback();
      return { result: null, err }
    }
    await transaction.commit();
    if (result) {
      const msgData = {
        value: result.oid,
        name: result.brandName
      }
      const brand = await messageMaps.toMessageResponse(msgData);
      return { brand, err: null };
    } else {
      return { brand: {}, err: { message: "Transaction Failed" } };
    }
  } catch (err) {
    await transaction.rollback();
    return { result: null, err }
  }
};

const update = async (oid, dto, userOid) => {
  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const transaction = await sequelize.transaction();
  try {
    const { result: resultFind, err: errBrand } = await brandRepository.findById(oid);

    if (errBrand != null) {
      return { brand: {}, err: errBrand }
    }
    if (resultFind == null) {
      return {
        brand: {}, err: {
          message: "Data Not Found"
        }
      }
    }    
    resultFind.brandName = dto.brandName ?? resultFind.brandName
    resultFind.lastModifiedBy = userOid ?? resultFind.lastModifiedBy
    resultFind.updatedAt = now

    const transaction = await sequelize.transaction();
    const { result: result, err: err } = await brandRepository.update(oid, resultFind,transaction);
    if (err !== null) {
      await transaction.rollback();
      return { result: null, err }
    }
    await transaction.commit();
    if (result) {
      const msgData = {
        value: resultFind.oid,
        name: resultFind.brandName
      }
      const brand = await messageMaps.toMessageResponse(msgData);
      return { brand, err: null };
    } else {
      return { brand: {}, err: { message: "Transaction Failed" } };
    }
  } catch (err) {
    await transaction.rollback();
    return { result: null, err }
  }
};

const deleted = async (oid) => {
  try {
    const transaction = await sequelize.transaction();
    const { result: resultFind, err: errBrand } = await brandRepository.findById(oid);
    if (errBrand != null) {
      return { brand: {}, err: errBrand }
    }
    if (resultFind == null) {
      return {
        brand: {}, err: {
          message: "Data Not Found"
        }
      }
    }
    const { result, err } = await brandRepository.deleted(oid, transaction);
    if (err !== null) {
      await transaction.rollback();
    }
    await transaction.commit();
    if (result) {
      const msgData = {
        value: resultFind.oid,
        name: resultFind.brandName
      }
      const brand = await messageMaps.toMessageResponse(msgData);
      return { brand, err: null };
    } else {
      return { brand: {}, err: { message: "Transaction Failed" } };
    }    
  } catch (err) {
    await transaction.rollback();
    return { brand: null, err }
  }
};

const findAll = async () => {
  try {
    const { result, err } = await brandRepository.findAll();
    const brands = await mappings.toBrandResponses(result)
    return { brands, err: null }
  } catch (err) {
    return { brands: [], err }
  }
};


const findById = async (oid) => {
  try {
    const { result, err } = await brandRepository.findById(oid);
    if (result == null) {
      return {
        brand: {}, err: {
          message: "Data Not Found"
        }
      }
    }
    const brand = await mappings.toBrandResponse(result)
    return { brand, err: err }
  } catch (err) {
    return { brand: {}, err }
  }

};


const findPage = async (condition, page, pageSize) => {
  try {
    const { count, errCount } = await brandRepository.findCountByCriteria(condition);
    if (errCount) {
      return { brands: [], count: 0, errCount }
    }
    const { brands, err } = await brandRepository.findByCriteria(condition, page, pageSize);
    const brandResponses = await mappings.toBrandResponses(brands)
    return { brands: brandResponses, count, err: err };
  } catch (err) {
    return { brands: [], count: 0, err }
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

