const countryRepository = require('../repositories/country.repository');
const mappings = require('../mappings/country.vm');
const messageMaps = require('../mappings/message.vm');
const sequelize = require('../config/sequelize');
const moment = require('moment');
const { buildFilterConditions } = require('../misc/sequelizeFilterBuilder')
const attribut = ['oid', 'countryCode', 'countryName','countryCurrency'];


const create = async (dto, userOid) => {
  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {
    const data = {
      countryCode: dto.countryCode,
      countryName: dto.countryName,
      countryCurrency: dto.countryCurrency,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };
    const transaction = await sequelize.transaction();
    const { result, err } = await countryRepository.save(data, { transaction });
    if (err !== null) {
      await transaction.rollback();
      return { result: null, err }
    }
    await transaction.commit();
    if (result) {
      const msgData = {
        value: result.oid,
        name: result.countryName
      }
      const country = await messageMaps.toMessageResponse(msgData);
      return { country, err: null };
    } else {
      return { country: {}, err: { message: "Transaction Failed" } };
    }

    // const country = await mappings.toCountryResponse(result)
    // return { country, err: err }
  } catch (err) {
    await transaction.rollback();
    return { result: null, err }
  }
};

const update = async (oid, dto, userOid) => {
  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const transaction = await sequelize.transaction();
  try {
    const { result: resultFind, err: errCountry } = await countryRepository.findById(oid);

    if (errCountry != null) {
      return { country: {}, err: errCountry }
    }
    if (resultFind == null) {
      return {
        country: {}, err: {
          message: "Data Not Found"
        }
      }
    }
    resultFind.countryCode = dto.countryCode ?? resultFind.countryCode
    resultFind.countryName = dto.countryName ?? resultFind.countryName
    resultFind.countryCurrency = dto.countryCurrency ?? resultFind.countryCurrency
    resultFind.description = dto.description ?? resultFind.description
    resultFind.lastModifiedBy = userOid ?? resultFind.lastModifiedBy
    resultFind.updatedAt = now

    const transaction = await sequelize.transaction();
    const { result: result, err: err } = await countryRepository.update(oid, resultFind, transaction);
    if (err !== null) {
      await transaction.rollback();
      return { result: null, err }
    }
    await transaction.commit();
    if (result) {
      const msgData = {
        value: resultFind.oid,
        name: resultFind.countryName
      }
      const country = await messageMaps.toMessageResponse(msgData);
      return { country, err: null };
    } else {
      return { country: {}, err: { message: "Transaction Failed" } };
    }
    // const country = await mappings.toCountryResponse(result)
    // return { country, err: err }
  } catch (err) {
    await transaction.rollback();
    return { result: null, err }
  }
};

const deleted = async (oid) => {
  try {
    const transaction = await sequelize.transaction();
    const { result: resultFind, err: errCountry } = await countryRepository.findById(oid);
    if (errCountry != null) {
      return { country: {}, err: errCountry }
    }
    if (resultFind == null) {
      return {
        country: {}, err: {
          message: "Data Not Found"
        }
      }
    }
    const { result, err } = await countryRepository.deleted(oid, transaction);
    if (err !== null) {
      await transaction.rollback();
    }
    await transaction.commit();
    if (result) {
      const msgData = {
        value: resultFind.oid,
        name: resultFind.countryName
      }
      const country = await messageMaps.toMessageResponse(msgData);
      return { country, err: null };
    } else {
      return { country: {}, err: { message: "Transaction Failed" } };
    }
    // return err
  } catch (err) {
    await transaction.rollback();
    return { country: null, err }
  }
};

const findAll = async () => {
  try {
    const { result, err } = await countryRepository.findAll();
    const countries = await mappings.toCountryResponses(result)
    return { countries, err: null }
  } catch (err) {
    return { countries: [], err }
  }
};

const findById = async (oid) => {
  try {
    const { result, err } = await countryRepository.findById(oid);
    if (result == null) {
      return {
        country: {}, err: {
          message: "Data Not Found"
        }
      }
    }
    const country = await mappings.toCountryResponse(result)
    return { country, err: err }
  } catch (err) {
    return { country: {}, err }
  }

};

const findPage = async (filters, options) => {
  try {  
    const where = buildFilterConditions(sequelize, filters, false);
    const { countries, count, err } = await countryRepository.findAndCountAll(where, options,attribut);
    const countryResponses = await mappings.toCountryResponses(countries)
    return { countries: countryResponses, count, err: err };
  } catch (err) {
    return { countries: [], count: 0, err }
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

