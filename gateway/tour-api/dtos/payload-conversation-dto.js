const Joi = require('joi');
const { authSchema } = require('./base-dto');

// Filter schema
const filterDto = Joi.object({
  isGroup: Joi.boolean().optional(),
  name: Joi.string().optional().allow(null, ''),
});

// Create schema
const createDto = Joi.object({
  isGroup: Joi.boolean().required(),
  name: Joi.string().optional().allow(null, ''),
});

// Update schema
const updateDto = Joi.object({
  isGroup: Joi.boolean().required(),
  name: Joi.string().optional().allow(null, ''),
});

const params = Joi.object({
  oid: Joi.string().uuid().required(),
});

const query = Joi.object({
  pageIndex: Joi.number().integer().min(1).required(),
  pageSize: Joi.number().integer().min(1).max(100).required(),
  sortBy: Joi.string().valid('isGroup', 'name', 'createdAt').optional().default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc'),
});

const filterConversationDto = Joi.object({
  headers: authSchema,
  query,
  body: filterDto,
});

const getConversationDto = Joi.object({
  headers: authSchema,
  params: params,
});

const deleteConversationDto = Joi.object({
  headers: authSchema,
  params: params,
});

const updateConversationDto = Joi.object({
  headers: authSchema,
  params: params,
  body: updateDto,
});

const createConversationDto = Joi.object({
  headers: authSchema,
  body: createDto,
});

module.exports = {
  createConversationDto,
  updateConversationDto,
  deleteConversationDto,
  filterConversationDto,
  getConversationDto,
};
