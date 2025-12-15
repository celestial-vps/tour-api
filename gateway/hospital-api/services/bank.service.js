const bankRepository = require('../repositories/bank.repository');
const mappings = require('../mappings/bank.vm');
const messageMaps = require('../mappings/message.vm');
const pool = require('../database/database');
const { uuidv7 } = require("uuidv7");
const { withTransaction } = require("../helper/transaction");
const moment = require('moment');

const create = async (dto, userOid) => {
  let connection;
  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {
    connection = await pool.getConnection(); // Get a connection from the pool
    await connection.beginTransaction(); // Start transaction

    const data = {
      oid: uuidv7(),
      bankCode: dto.bankCode,
      bankName: dto.bankName,
      shortName: dto.shortName ?? null,
      description: dto.description ?? null,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const saveFunction = async (connection, data) => {
      // This function is called within the transaction
      return bankRepository.save(data, { transaction: connection });
    };
    const funcs = [
      async (conn) => saveFunction(conn, data) // Order insertion function
    ];
    const { result, err } = await withTransaction(funcs, connection, data);
    if (err) {
      return { bank: null, err };
    }
    if (result) {
      const msgData = {
        value: data.oid,
        name: data.bankName
      }
      const bank = await messageMaps.toMessageResponse(msgData);
      return { bank, err: null };
    } else {
      return { bank: {},err: {
        httpStatus: 500,
      } };
    }
  } catch (err) {
    return {
      bank: null, err: {
        httpStatus: 500,
      }
    };
  }
};

const update = async (oid, dto, userOid) => {
  let connection;
  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {
    connection = await pool.getConnection(); // Get a connection from the pool
    await connection.beginTransaction(); // Start transaction

    const { result: resultFind, err: errBank } = await bankRepository.findById(oid, connection);
    if (errBank != null) {
      return { bank: {}, err: errBank }
    }
    if (resultFind == null) {
      return {
        bank: {}, err: {
          httpStatus: 404,
        }
      }
    }

    resultFind.bankCode = dto.bankCode ?? resultFind.bankCode
    resultFind.bankName = dto.bankName ?? resultFind.bankName
    resultFind.shortName = dto.shortName ?? resultFind.shortName
    resultFind.description = dto.description ?? resultFind.description
    resultFind.lastModifiedBy = userOid ?? resultFind.lastModifiedBy
    resultFind.updatedAt = now

    const updateFunction = async (connection, data) => {
      // This function is called within the transaction
      return bankRepository.update(oid, data, { transaction: connection });
    };
    const funcs = [
      async (conn) => updateFunction(conn, resultFind) // Order insertion function
    ];
    const { result, err } = await withTransaction(funcs, connection, resultFind);

    if (err) {
      return { bank: result, err };
    }
    if (result) {
      const msgData = {
        value: resultFind.oid,
        name: resultFind.bankName
      }
      const bank = await messageMaps.toMessageResponse(msgData);
      return { bank, err: null };
    } else {
      return { bank: {},err: {
        httpStatus: 500,
      } };
    }
  } catch (err) {
    return { bank: null, err: {
      httpStatus: 500,
    } };
  } 
};

const deleted = async (oid) => {
  let connection;
  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {
    connection = await pool.getConnection(); // Get a connection from the pool
    await connection.beginTransaction(); // Start transaction
    const { result: resultFind, err: errBank } = await bankRepository.findById(oid, connection);
    if (errBank != null) {
      return { bank: {}, err: errBank }
    }
    if (resultFind == null) {
      return {
        bank: {}, err: {
          httpStatus: 404,
        }
      }
    }

    const deleteFunction = async (connection) => {
      // This function is called within the transaction
      return bankRepository.deleted(oid, { transaction: connection });
    };
    const funcs = [
      async (conn) => deleteFunction(conn, resultFind) // Order insertion function
    ];
    const { result, err } = await withTransaction(funcs, connection, resultFind);

    if (err) {
      return { result: null, err };
    }
    if (result) {
      const msgData = {
        value: resultFind.oid,
        name: resultFind.bankName
      }
      const bank = await messageMaps.toMessageResponse(msgData);
      return { bank, err: null };
    } else {
      return { bank: {},err: {
        httpStatus: 500,
      } };
    }
  } catch (err) {
    return {
      bank: null, err: {
        httpStatus: 500,
      }
    };
  }
};

const findAll = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await bankRepository.findAll(connection);
    const banks = await mappings.toBankResponses(result)
    return { banks, err: null }
  } catch (err) {
    return { banks: [], err: {
      httpStatus: 500,
    } }
  }
};

const findById = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await bankRepository.findById(oid, connection);
    if (err != null) {
      return { bank: {}, err }
    }
    if (result == null) {
      return {
        bank: null, err: {
          httpStatus: 404,
        }
      }
    }
    const bank = await mappings.toBankResponse(result)
    return { bank, err: null }
  } catch (err) {
    return { bank: [], err: {
      httpStatus: 500,
    } }
  }

};

const findPage = async (condition, page, pageSize) => {
  try {
    connection = await pool.getConnection();
    const { count, errCount } = await bankRepository.findCountByCriteria(condition, connection);
    if (errCount) {
      return { banks: [], count: 0, errCount }
    }
    const { banks, err } = await bankRepository.findByCriteria(condition, page, pageSize, connection);
    if (err) {
      return { banks: [], count: 0, errCount }
    }
    const bankResponses = await mappings.toBankResponses(banks)
    return { banks: bankResponses, count, err: err };
  } catch (err) {
    return {
      banks: [], count: 0, err: {
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

