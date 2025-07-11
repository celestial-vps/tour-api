const messageRepository = require('../repositories/message.repository');
const mappings = require('../mappings/message.vm');

const messageMaps = require('../mappings/message.vm');
const buildResponse = require('../common/build.response');
const sequelize = require('../config/sequelize');
const moment = require('moment');
const { buildFilterConditions, buildFindOptions } = require('../misc/sequelizeFilterBuilder');
const { MESSAGE_BASIC_FIELDS } = require('../constants/message.fields'); // kamu bisa define sendiri

const create = async (dto, userOid) => {
  // @ts-ignore
  const now = new Date().formatUTC();
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const data = {
      conversationId: dto.conversationId,
      senderId: dto.senderId ?? userOid,
      message: dto.message,
      createdAt: now,
      updatedAt: now,
    };

    const { result, err } = await messageRepository.save(data, { transaction });

    if (err || !result) {
      await transaction.rollback();
      return {
        message: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    await transaction.commit();

    const msgData = { value: result.oid, name: result.message };
    const message = await mappings.toMessageResponse(msgData);

    return { message, err: null };

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Create failed:', error);

    return {
      message: null,
      err: buildResponse.responseInternalServerError(error).data.error,
    };
  }
};

const update = async (oid, dto, userOid, options = {}) => {
  const { transaction = null, useTransaction = false } = options;
  // @ts-ignore
  const now = new Date().formatUTC();
  let localTransaction = null;

  try {
    if (useTransaction && !transaction) {
      localTransaction = await sequelize.transaction();
    }

    const currentTransaction = transaction || localTransaction;

    const findOptions = {
      transaction: currentTransaction,
      include: [], // ubah jika ingin include relasi
    };

    const { result: existingMessage, err: findError } = await messageRepository.findById(oid, findOptions);

    if (findError) {
      if (localTransaction) await localTransaction.rollback();
      return { message: null, err: findError };
    }

    if (!existingMessage) {
      if (localTransaction) await localTransaction.rollback();
      return { message: null, err: { message: "Message not found", status: 404 } };
    }

    const updateData = {
      message: dto.message ?? existingMessage.message,
      deletedBy: dto.deletedBy ?? existingMessage.deletedBy,
      deletedAt: dto.deletedAt ?? existingMessage.deletedAt,
      updatedAt: now,
    };

    const { result: updateResult, err: updateError } = await messageRepository.update(
      oid,
      updateData,
      currentTransaction ? { transaction: currentTransaction } : {}
    );

    if (updateError) {
      if (localTransaction) await localTransaction.rollback();
      return { message: null, err: updateError };
    }

    if (localTransaction) {
      await localTransaction.commit();
    }

    const msgData = { value: existingMessage.oid, name: existingMessage.message };
    const message = await mappings.toMessageResponse(msgData);

    return { message, err: null };

  } catch (err) {
    if (localTransaction) await localTransaction.rollback();
    console.error('Update failed:', err);

    return {
      message: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const deleted = async (oid, deletedBy) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { result: resultFind, err: errFind } = await messageRepository.findById(oid, { transaction });
    if (errFind) {
      await transaction.rollback();
      return { message: null, err: errFind };
    }

    if (!resultFind) {
      await transaction.rollback();
      return {
        message: null,
        err: { message: 'Data Not Found', status: 404 },
      };
    }

    const now = moment.utc().toDate();

    const { result, err } = await messageRepository.deleted(
      oid,
      {
        transaction,
        deletedBy,
        deletedAt: now,
      }
    );

    if (err) {
      await transaction.rollback();
      return { message: null, err };
    }

    await transaction.commit();

    const msgData = { value: resultFind.oid, name: resultFind.message };
    const message = await mappings.toMessageResponse(msgData);

    return { message, err: null };

  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Delete failed:', err);

    return {
      message: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await messageRepository.findAll({
      include: [],
      order: [['createdAt', 'DESC']],
      attributes: MESSAGE_BASIC_FIELDS,
    });

    if (err) return { messages: [], err };

    const messages = await mappings.toMessageResponses(result);
    return { messages, err: null };
  } catch (err) {
    return {
      messages: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findById = async (oid, options = {}) => {
  try {
    const { result, err } = await messageRepository.findById(oid, options);

    if (err) {
      return {
        message: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    if (!result) {
      return { message: null, err: null };
    }

    const message = await mappings.toMessageResponse(result);

    return { message, err: null };
  } catch (err) {
    console.error('Error finding message:', err);
    return {
      message: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findPage = async (filters, options) => {
  try {
    const where = buildFilterConditions(sequelize, filters, false); // case-insensitive
    const findOptions = buildFindOptions(where, options);

    const result = await messageRepository.findAndCountAll(findOptions);

    if (result.err) throw result.err;
    const messages = await mappings.toMessageResponses(result.data);

    return {
      messages,
      count: result.count,
      err: null,
    };
  } catch (error) {
    console.error('MessageService findPage error:', error);
    return {
      messages: [],
      count: 0,
      err: buildResponse.responseInternalServerError(error).data.error,
    };
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
