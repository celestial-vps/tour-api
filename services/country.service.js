const countryRepository = require('../repositories/country.repository');
const mappings = require('../mappings/country.vm');
const messageMaps = require('../mappings/message.vm');
const sequelize = require('../config/sequelize');
const moment = require('moment');
const { buildFilterConditions } = require('../misc/sequelizeFilterBuilder');

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

    if (err) {
      await transaction.rollback();
      return { country: null, err };
    }

    if (!result) {
      await transaction.rollback();
      return {
        country: null,
        err: {
          message: 'Internal server error',
          details: 'Transaction Failed',
          status: 500,
        },
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
      err: {
        message: 'Internal server error',
        details: error.message || 'Unknown error',
        status: 500,
      },
    };
  }
};


const update = async (oid, dto, userOid, options = {}) => {
  const { transaction = null, useTransaction = false } = options;
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  let localTransaction = null;

  try {
    // If transaction is required but not passed, create a new transaction
    if (useTransaction && !transaction) {
      localTransaction = await sequelize.transaction();
    }

    const currentTransaction = transaction || localTransaction;

    // Find the existing country by ID
    const { result: existingCountry, err: findError } = await countryRepository.findById(
      oid,
      currentTransaction ? { transaction: currentTransaction } : {}
    );

    // Handle error when finding the country
    if (findError) {
      if (localTransaction) await localTransaction.rollback();
      return { country: null, err: findError };
    }

    // Handle the case where country is not found
    if (!existingCountry) {
      if (localTransaction) await localTransaction.rollback();
      return { country: null, err: { message: "Country not found", status: 404 } };
    }

    // Prepare the update data, falling back to existing country data if not provided
    const updateData = {
      countryCode: dto.countryCode ?? existingCountry.countryCode,
      countryName: dto.countryName ?? existingCountry.countryName,
      countryCurrency: dto.countryCurrency ?? existingCountry.countryCurrency,
      lastModifiedBy: userOid ?? existingCountry.lastModifiedBy,
      updatedAt: now,
    };

    // Perform the update operation
    const { result: updateResult, err: updateError } = await countryRepository.update(
      oid,
      updateData,
      currentTransaction ? { transaction: currentTransaction } : {}
    );

    // Handle error during update
    if (updateError) {
      if (localTransaction) await localTransaction.rollback();
      return { country: null, err: updateError };
    }

    // Commit transaction if using a local transaction
    if (localTransaction) {
      await localTransaction.commit();
    }

    // Prepare response message
    const msgData = { value: existingCountry.oid, name: existingCountry.countryName };
    const country = await messageMaps.toMessageResponse(msgData);

    return { country, err: null };

  } catch (err) {
    // Rollback transaction if there's any error
    if (localTransaction) await localTransaction.rollback();

    // Log the error
    console.error('Update failed:', err);

    // Return error response
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
    const { result: resultFind, err: errCountry } = await countryRepository.findById(oid);
    if (errCountry) return { country: null, err: errCountry };
    if (!resultFind) return { country: null, err: { message: 'Data Not Found', status: 404 } };

    const { result, err } = await countryRepository.deleted(oid, transaction);
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
        details: err.message || 'Transaction Failed',
        status: 500
      }
    };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await countryRepository.findAll();
    const countries = await mappings.toCountryResponses(result);
    return { countries, err: null };
  } catch (err) {
    return { countries: [], err: { message: 'Internal server error', details: err.message, status: 500 } };

  }
};

const findById = async (oid) => {
  try {
    // Try to find the country by its ID
    const { result, err } = await countryRepository.findById(oid);

    // If there is an error when fetching the country, return that error
    if (err) {
      return {
        country: null,
        err: {
          message: 'Internal server error',
          details: err.message || 'An error occurred while retrieving the country',
          status: 500
        }
      };
    }

    // If no country is found, return a 'not found' error
    if (!result) {
      return {
        country: null,
        err: {
          message: 'Data Not Found',
          details: `No country found with ID: ${oid}`,
          status: 404
        }
      };
    }

    // Successfully found the country, map it to the response format
    const country = await mappings.toCountryResponse(result);

    return { country, err: null };

  } catch (err) {
    // Handle unexpected errors and return them
    console.error('Error finding country:', err);
    return {
      country: null,
      err: {
        message: 'Internal server error',
        details: err.message || 'An unexpected error occurred while finding the country',
        status: 500
      }
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
