const Joi = require('joi');
const { authSchema } = require('./base-dto');

// Filter schema
const filterDto = Joi.object({
  conversationId: Joi.string().uuid().optional().allow(null, ''),
  senderId: Joi.string().uuid().optional().allow(null, ''),
  message: Joi.string().optional().allow(null, ''),
});

// Create schema
const createDto = Joi.object({
  conversationId: Joi.string().uuid().required(),
  senderId: Joi.string().uuid().required(),
  message: Joi.string().required(),
});

// Update schema
const updateDto = Joi.object({
  message: Joi.string().required(),
});

const params = Joi.object({
  oid: Joi.string().uuid().required(),
});

const query = Joi.object({
  pageIndex: Joi.number().integer().min(1).required(),
  pageSize: Joi.number().integer().min(1).max(100).required(),
  sortBy: Joi.string().valid('conversationId', 'senderId', 'message', 'createdAt').optional().default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc'),
});

const filterMessageDto = Joi.object({
  headers: authSchema,
  query,
  body: filterDto,
});

const getMessageDto = Joi.object({
  headers: authSchema,
  params: params,
});

const deleteMessageDto = Joi.object({
  headers: authSchema,
  params: params,
});

const updateMessageDto = Joi.object({
  headers: authSchema,
  params: params,
  body: updateDto,
});

const createMessageDto = Joi.object({
  headers: authSchema,
  body: createDto,
});

module.exports = {
  createMessageDto,
  updateMessageDto,
  deleteMessageDto,
  filterMessageDto,
  getMessageDto,
};
