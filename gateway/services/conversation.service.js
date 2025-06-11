// const conversationRepository = require('../repositories/conversation.repository');
// const mappings = require('../mappings/conversation.vm');
// const buildResponse = require('../common/build.response');
// const sequelize = require('../config/sequelize');
// const moment = require('moment');
// const { buildFilterConditions, buildFindOptions } = require('../misc/sequelizeFilterBuilder');
// const { CONVERSATION_BASIC_FIELDS } = require('../constants/conversation.fields');

// const create = async (dto, userOid) => {
//   const now = moment.utc().format('YYYY-MM-DD HH:mm:ss');
//   let transaction;

//   try {
//     transaction = await sequelize.transaction();

//     const data = {
//       isGroup: dto.isGroup ?? false,
//       name: dto.name ?? null,
//       createdAt: now,
//       updatedAt: now,
//     };

//     const { result, err } = await conversationRepository.save(data, { transaction });

//     if (err || !result) {
//       await transaction.rollback();
//       return {
//         conversation: null,
//         err: buildResponse.responseInternalServerError(err).data.error,
//       };
//     }

//     await transaction.commit();

//     const msgData = { value: result.oid, name: result.name };
//     const conversation = await mappings.toConversationResponse(msgData);

//     return { conversation, err: null };

//   } catch (error) {
//     if (transaction) await transaction.rollback();
//     console.error('Create failed:', error);

//     return {
//       conversation: null,
//       err: buildResponse.responseInternalServerError(error).data.error,
//     };
//   }
// };

// const update = async (oid, dto, userOid, options = {}) => {
//   const { transaction = null, useTransaction = false } = options;
//   const now = moment.utc().format('YYYY-MM-DD HH:mm:ss');
//   let localTransaction = null;

//   try {
//     if (useTransaction && !transaction) {
//       localTransaction = await sequelize.transaction();
//     }

//     const currentTransaction = transaction || localTransaction;

//     const findOptions = {
//       transaction: currentTransaction,
//       include: [], // Add includes if needed
//     };

//     const { result: existingConversation, err: findError } = await conversationRepository.findById(oid, findOptions);

//     if (findError) {
//       if (localTransaction) await localTransaction.rollback();
//       return { conversation: null, err: findError };
//     }

//     if (!existingConversation) {
//       if (localTransaction) await localTransaction.rollback();
//       return { conversation: null, err: { message: "Conversation not found", status: 404 } };
//     }

//     const updateData = {
//       isGroup: dto.isGroup ?? existingConversation.isGroup,
//       name: dto.name ?? existingConversation.name,
//       deletedBy: dto.deletedBy ?? existingConversation.deletedBy,
//       deletedAt: dto.deletedAt ?? existingConversation.deletedAt,
//       updatedAt: now,
//     };

//     const { result: updateResult, err: updateError } = await conversationRepository.update(
//       oid,
//       updateData,
//       currentTransaction ? { transaction: currentTransaction } : {}
//     );

//     if (updateError) {
//       if (localTransaction) await localTransaction.rollback();
//       return { conversation: null, err: updateError };
//     }

//     if (localTransaction) {
//       await localTransaction.commit();
//     }

//     const msgData = { value: existingConversation.oid, name: existingConversation.name };
//     const conversation = await mappings.toConversationResponse(msgData);

//     return { conversation, err: null };

//   } catch (err) {
//     if (localTransaction) await localTransaction.rollback();
//     console.error('Update failed:', err);

//     return {
//       conversation: null,
//       err: buildResponse.responseInternalServerError(err).data.error,
//     };
//   }
// };

// const deleted = async (oid, deletedBy) => {
//   let transaction;

//   try {
//     transaction = await sequelize.transaction();

//     const { result: resultFind, err: errFind } = await conversationRepository.findById(oid, { transaction });
//     if (errFind) {
//       await transaction.rollback();
//       return { conversation: null, err: errFind };
//     }

//     if (!resultFind) {
//       await transaction.rollback();
//       return {
//         conversation: null,
//         err: { message: 'Data Not Found', status: 404 },
//       };
//     }

//     const now = moment.utc().toDate();

//     const { result, err } = await conversationRepository.deleted(
//       oid,
//       {
//         transaction,
//         deletedBy,
//         deletedAt: now,
//       }
//     );

//     if (err) {
//       await transaction.rollback();
//       return { conversation: null, err };
//     }

//     await transaction.commit();

//     const msgData = { value: resultFind.oid, name: resultFind.name };
//     const conversation = await mappings.toConversationResponse(msgData);

//     return { conversation, err: null };

//   } catch (err) {
//     if (transaction) await transaction.rollback();
//     console.error('Delete failed:', err);

//     return {
//       conversation: null,
//       err: buildResponse.responseInternalServerError(err).data.error,
//     };
//   }
// };

// const findAll = async () => {
//   try {
//     const { result, err } = await conversationRepository.findAll({
//       include: [],
//       order: [['createdAt', 'DESC']],
//       attributes: CONVERSATION_BASIC_FIELDS,
//     });

//     if (err) return { conversations: [], err };

//     const conversations = await mappings.toConversationResponses(result);
//     return { conversations, err: null };
//   } catch (err) {
//     return {
//       conversations: [],
//       err: buildResponse.responseInternalServerError(err).data.error,
//     };
//   }
// };

// const findById = async (oid, options = {}) => {
//   try {
//     const { result, err } = await conversationRepository.findById(oid, options);

//     if (err) {
//       return {
//         conversation: null,
//         err: buildResponse.responseInternalServerError(err).data.error,
//       };
//     }

//     if (!result) {
//       return { conversation: null, err: null };
//     }

//     const conversation = await mappings.toConversationResponse(result);

//     return { conversation, err: null };
//   } catch (err) {
//     console.error('Error finding conversation:', err);
//     return {
//       conversation: null,
//       err: buildResponse.responseInternalServerError(err).data.error,
//     };
//   }
// };

// const findPage = async (filters, options) => {
//   try {
//     const where = buildFilterConditions(sequelize, filters, false); // case-insensitive
//     const findOptions = buildFindOptions(where, options);

//     const result = await conversationRepository.findAndCountAll(findOptions);

//     if (result.err) throw result.err;

//     return {
//       conversations: result.data,
//       count: result.count,
//       err: null,
//     };
//   } catch (error) {
//     console.error('ConversationService findPage error:', error);
//     return {
//       conversations: [],
//       count: 0,
//       err: buildResponse.responseInternalServerError(error).data.error,
//     };
//   }
// };

// module.exports = {
//   create,
//   update,
//   deleted,
//   findAll,
//   findById,
//   findPage,
// };
