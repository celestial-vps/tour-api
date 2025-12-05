const Joi = require('joi');
const { authSchema } = require('./base-dto');

// ==============================
// Body Schemas
// ==============================

// FilterUserDto
const filterDto = Joi.object({
  email: Joi.string().optional().allow(null, '')
});

// PageUserDto (bisa digabung ke filter kalau sama)
const pageDto = Joi.object({
  email: Joi.string().optional().allow(null, '')
});

// RegisterDto
const registerDtoBody = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// LoginDto
const loginDtoBody = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// CreateUserDto
const createDto = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  androidToken: Joi.string().optional().allow(''),
  roleOid: Joi.string().required(),
});

// UpdateUserDto
const updateDto = Joi.object({
  email: Joi.string().email().optional().allow(''),
  password: Joi.string().min(6).optional().allow(''),
  androidToken: Joi.string().optional().allow(''),
  roleOid: Joi.string().optional().allow(''),
});

// ==============================
// Params & Query
// ==============================

const params = Joi.object({
  oid: Joi.string().uuid().required()
});

const query = Joi.object({
  pageIndex: Joi.number().integer().min(1).required(),
  pageSize: Joi.number().integer().min(1).max(100).required(),
});

// ==============================
// Final DTO Structures
// ==============================

const filterUserDto = Joi.object({
  headers: authSchema,
  query,
  body: filterDto
});

const pageUserDto = Joi.object({
  headers: authSchema,
  query,
  body: pageDto
});

const createUserDto = Joi.object({
  headers: authSchema,
  body: createDto
});

const updateUserDto = Joi.object({
  headers: authSchema,
  params,
  body: updateDto
});

const getUserDto = Joi.object({
  headers: authSchema,
  params
});

const deleteUserDto = Joi.object({
  headers: authSchema,
  params
});

const registerDto = Joi.object({
  body: registerDtoBody
});

const loginDto = Joi.object({
  body: loginDtoBody
});

// ==============================
// Export
// ==============================

module.exports = {
  filterUserDto,
  pageUserDto,
  registerDto,
  loginDto,
  createUserDto,
  updateUserDto,
  getUserDto,
  deleteUserDto,
  query,
  params
};
