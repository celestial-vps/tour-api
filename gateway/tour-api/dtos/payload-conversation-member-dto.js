const Joi = require('joi');
const { authSchema } = require('./base-dto');

// Filter schema
const filterDto = Joi.object({
  conversationOid: Joi.string().uuid().optional(),
  userOid: Joi.string().uuid().optional(),
});

// Create schema
const createDto = Joi.object({
  conversationOid: Joi.string().uuid().required(),
  userOid: Joi.string().uuid().required(),
});

// No update schema (usually no update for pivot table)

const params = Joi.object({
  conversationOid: Joi.string().uuid().required(),
  userOid: Joi.string().uuid().required(),
});

const query = Joi.object({
  pageIndex: Joi.number().integer().min(1).required(),
  pageSize: Joi.number().integer().min(1).max(100).required(),
  sortBy: Joi.string().valid('conversationOid', 'userOid').optional().default('conversationOid'),
  sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc'),
});

const filterConversationMemberDto = Joi.object({
  headers: authSchema,
  query,
  body: filterDto,
});

const getConversationMemberDto = Joi.object({
  headers: authSchema,
  params: params,
});

const deleteConversationMemberDto = Joi.object({
  headers: authSchema,
  params: params,
});

const createConversationMemberDto = Joi.object({
  headers: authSchema,
  body: createDto,
});

module.exports = {
  createConversationMemberDto,
  deleteConversationMemberDto,
  filterConversationMemberDto,
  getConversationMemberDto,
};
