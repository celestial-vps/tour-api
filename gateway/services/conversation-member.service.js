const conversationMemberRepository = require('../repositories/conversation-member.repository');
const mappings = require('../mappings/conversation-member.vm');
const buildResponse = require('../../common/build.response');
const sequelize = require('../../config/sequelize');
const messageMaps = require('../mappings/message.vm');
const moment = require('moment');
const { buildFilterConditions, buildFindOptions } = require('../misc/sequelizeFilterBuilder');
const { CONVERSATION_MEMBER_BASIC_FIELDS } = require('../../constants/conversation-member.fields');

const create = async (dto) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const data = {
      conversationOid: dto.conversationOid,
      userOid: dto.userOid,
    };

    const { result, err } = await conversationMemberRepository.save(data, { transaction });

    if (err || !result) {
      await transaction.rollback();
      return {
        conversationMember: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    await transaction.commit();

    const msgData = { conversationOid: result.conversationOid, userOid: result.userOid };
    const conversationMember = await mappings.toConversationMemberResponse(msgData);

    return { conversationMember, err: null };

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Create failed:', error);

    return {
      conversationMember: null,
      err: buildResponse.responseInternalServerError(error).data.error,
    };
  }
};

const deleted = async (oid) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { result: resultFind, err: errFind } = await conversationMemberRepository.findById(oid, { transaction });
    if (errFind) {
      await transaction.rollback();
      return { conversationmember: null, err: errFind };
    }

    if (!resultFind) {
      await transaction.rollback();
      return {
        conversationmember: null,
        err: { message: 'Data Not Found', status: 404 }
      };
    }

    const { result, err } = await conversationMemberRepository.deleted(oid, { transaction });
    if (err) {
      await transaction.rollback();
      return { conversationmember: null, err };
    }

    await transaction.commit();

    const msgData = { value: resultFind.oid, name: resultFind.conversationmemberName };
    const conversationmember = await messageMaps.toMessageResponse(msgData);

    return { conversationmember, err: null };

  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Delete failed:', err);

    return {
      conversationmember: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findAll = async (filters = {}, options = {}) => {
  try {
    const where = buildFilterConditions(sequelize, filters, false); // case-insensitive
    const findOptions = buildFindOptions(where, options);

    const { result, err } = await conversationMemberRepository.findAll(findOptions);

    if (err) return { conversationMembers: [], err };

    const conversationMembers = await mappings.toConversationMemberResponses(result);
    return { conversationMembers, err: null };
  } catch (err) {
    return {
      conversationMembers: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findById = async (oid, options = {}) => {
  try {
    const { result, err } = await conversationMemberRepository.findById(oid, options);

    if (err) {
      return {
        conversationmember: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    if (!result) {
      // Data not found, no error, just empty result
      return { conversationmember: null, err: null };
    }

    const conversationmember = await mappings.toConversationMemberResponse(result);

    return { conversationmember, err: null };
  } catch (err) {
    console.error('Error finding conversationmember:', err);
    return {
      conversationmember: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};



const findPage = async (filters, options) => {
  try {
    const where = buildFilterConditions(sequelize, filters, false); // case-insensitive
    const findOptions = buildFindOptions(where, options);

    const result = await conversationMemberRepository.findAndCountAll(findOptions);

    if (result.err) throw result.err;

    return {
      conversationMembers: result.data,
      count: result.count,
      err: null,
    };
  } catch (error) {
    console.error('conversationMemberService findPage error:', error);
    return {
      countries: [],
      count: 0,
      err: buildResponse.responseInternalServerError(error).data.error,
    };
  }
};


module.exports = {
  create,
  deleted,
  findAll,
  findById,findPage,
};
