const countryRepository = require('../repositories/country.repository');
const mappings = require('../mappings/country.vm');
const messageMaps = require('../mappings/message.vm');
const sequelize = require('../config/sequelize');
const moment = require('moment');
const { buildFilterConditions } = require('../misc/sequelizeFilterBuilder');
const buildResponse = require('../common/build.response');
const { COUNTRY_BASIC_FIELDS } = require('../constants/country.fields');
const attribut = ['oid', 'countryCode', 'countryName', 'countryCurrency'];

const create = async (dto, userOid) => {
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const data = {
      countryCode: dto.countryCode,
      countryName: dto.countryName,
      countryCurrency: dto.countryCurrency,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, err } = await countryRepository.save(data, { transaction });

    if (err || !result) {
      await transaction.rollback();
      return {
        country: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    await transaction.commit();

    const msgData = { value: result.oid, name: result.countryName };
    const country = await messageMaps.toMessageResponse(msgData);

    return { country, err: null };

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Create failed:', error);

    return {
      country: null,
      err: buildResponse.responseInternalServerError(error).data.error,
    };
  }
};

const update = async (oid, dto, userOid, options = {}) => {
  const { transaction = null, useTransaction = false } = options;
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  let localTransaction = null;

  try {
    if (useTransaction && !transaction) {
      localTransaction = await sequelize.transaction();
    }

    const currentTransaction = transaction || localTransaction;

    // Siapkan opsi untuk findById, termasuk transaksi dan include relasi jika diperlukan
    const findOptions = {
      transaction: currentTransaction,
      include: ['provinces'],  // ubah sesuai kebutuhan, bisa [] atau diambil dari dto misal
    };

    // Panggil findById dengan options yang benar
    const { result: existingCountry, err: findError } = await countryRepository.findById(oid, findOptions);

    if (findError) {
      if (localTransaction) await localTransaction.rollback();
      return { country: null, err: findError };
    }

    if (!existingCountry) {
      if (localTransaction) await localTransaction.rollback();
      return { country: null, err: { message: "Country not found", status: 404 } };
    }

    const updateData = {
      countryCode: dto.countryCode ?? existingCountry.countryCode,
      countryName: dto.countryName ?? existingCountry.countryName,
      countryCurrency: dto.countryCurrency ?? existingCountry.countryCurrency,
      lastModifiedBy: userOid ?? existingCountry.lastModifiedBy,
      updatedAt: now,
    };

    // Update data dengan transaksi yang sama
    const { result: updateResult, err: updateError } = await countryRepository.update(
      oid,
      updateData,
      currentTransaction ? { transaction: currentTransaction } : {}
    );

    if (updateError) {
      if (localTransaction) await localTransaction.rollback();
      return { country: null, err: updateError };
    }

    if (localTransaction) {
      await localTransaction.commit();
    }

    // Buat response message dari data yang sudah diupdate
    const msgData = { value: existingCountry.oid, name: existingCountry.countryName };
    const country = await messageMaps.toMessageResponse(msgData);

    return { country, err: null };

  } catch (err) {
    if (localTransaction) await localTransaction.rollback();
    console.error('Update failed:', err);

    return {
      country: null,
      err: {
        message: 'Internal server error',
        details: err.message || 'Unknown error',
        status: 500,
      },
    };
  }
};


const deleted = async (oid) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { result: resultFind, err: errFind } = await countryRepository.findById(oid, { transaction });
    if (errFind) {
      await transaction.rollback();
      return { country: null, err: errFind };
    }

    if (!resultFind) {
      await transaction.rollback();
      return {
        country: null,
        err: { message: 'Data Not Found', status: 404 }
      };
    }

    const { result, err } = await countryRepository.deleted(oid, { transaction });
    if (err) {
      await transaction.rollback();
      return { country: null, err };
    }

    await transaction.commit();

    const msgData = { value: resultFind.oid, name: resultFind.countryName };
    const country = await messageMaps.toMessageResponse(msgData);

    return { country, err: null };

  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Delete failed:', err);

    return {
      country: null,
      err: {
        message: 'Internal server error',
        details: err.message ?? String(err),
        status: 500
      }
    };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await countryRepository.findAll({
      include: [],
      order: [['createdAt', 'DESC']],
      attributes: COUNTRY_BASIC_FIELDS
    });

    if (err) return { countries: [], err };

    const countries = await mappings.toCountryResponses(result);
    return { countries, err: null };
  } catch (err) {
    return {
      countries: [],
      err: {
        message: 'Internal server error',
        details: err.message,
        status: 500,
      },
    };
  }
};

const findById = async (oid, options = {}) => {
  try {
    const { result, err } = await countryRepository.findById(oid, options);

    if (err) {
      return {
        country: null,
        err: {
          message: 'Internal server error',
          details: err.message || 'An error occurred while retrieving the country',
          status: 500,
        },
      };
    }

    if (!result) {
      // Data not found, no error, just empty result
      return { country: null, err: null };
    }

    const country = await mappings.toCountryResponse(result);

    return { country, err: null };
  } catch (err) {
    console.error('Error finding country:', err);
    return {
      country: null,
      err: {
        message: 'Internal server error',
        details: err.message || 'An unexpected error occurred while finding the country',
        status: 500,
      },
    };
  }
};




async function findPage(filters, options) {
  try {
    const where = buildFilterConditions(sequelize, filters, false);

    const { countries, count, err } = await countryRepository.findAndCountAll(where, options);
    if (err) throw err;

    return { countries, count, err: null };
  } catch (error) {
    console.error('Find page failed:', error);
    return {
      countries: [],
      count: 0,
      err: {
        message: 'Internal server error',
        details: error.message,
        status: 500,
      },
    };
  }
}


module.exports = {
  create,
  update,
  deleted,
  findAll,
  findById,
  findPage
};
