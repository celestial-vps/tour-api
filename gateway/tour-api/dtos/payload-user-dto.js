const Joi = require('joi');

// FilterUserDto
const filterUserDto = Joi.object({
  customerOid: Joi.string().required().allow(null, '')
});

// PageUserDto
const pageUserDto = Joi.object({
  customerOid: Joi.string().required().allow(null, '')
});

// RegisterDto
const registerDto = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required() // Adjust password rules as needed
});

// LoginDto
const loginDto = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required() // Adjust password rules as needed
});

// CreateUserDto
const createUserDto = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(), // Adjust password rules as needed
  age: Joi.number().integer().min(0).max(255).required(),  
  androidToken: Joi.string().optional().allow(''),
  isActive: Joi.boolean().required(),
  roleOid: Joi.string().required(),
  activatedAt: Joi.date().iso().optional().allow(null)
});

// UpdateUserDto
const updateUserDto = Joi.object({
  name: Joi.string().optional().allow(''),
  email: Joi.string().email().optional().allow(''),
  password: Joi.string().min(6).optional().allow(''), // Adjust password rules as needed
  age: Joi.number().integer().min(0).max(255).optional(),  
  androidToken: Joi.string().optional().allow(''),
  isActive: Joi.boolean().optional(),
  roleOid: Joi.string().optional().allow(''),
  activatedAt: Joi.date().iso().optional().allow(null)
});

const params = Joi.object({
  oid: Joi.string().uuid().required()
});

const querySchema = Joi.object({
  pageIndex: Joi.number().integer().min(1).required(),
  pageSize: Joi.number().integer().min(1).max(100).required(),
});

module.exports = {
  filterUserDto,
  pageUserDto,
  registerDto,
  loginDto,
  createUserDto,
  updateUserDto,
  querySchema,
  params
};
