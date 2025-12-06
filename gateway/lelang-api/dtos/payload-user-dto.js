const Joi = require('joi');

// Validation schema for FilterUserDto
const filterUserDto = Joi.object({
  email: Joi.string().optional().allow(null, ''), // Assuming email is a string
});

// Validation schema for PageUserDto
const pageUserDto = Joi.object({
  email: Joi.string().optional().allow(null, ''), // Assuming email is a string
});

// Validation schema for RegisterDto
const registerDto = Joi.object({
  email: Joi.string().email().required(), // Valid email address
  password: Joi.string().min(6).required() // Password should have at least 6 characters
});

// Validation schema for LoginDto
const loginDto = Joi.object({
  email: Joi.string().email().required(), // Valid email address
  password: Joi.string().min(6).required() // Password should have at least 6 characters
});

// Validation schema for CreateUserDto
const createUserDto = Joi.object({ 
  email: Joi.string().email().required(), // Valid email address
  password: Joi.string().min(6).required(), // Password should have at least 6 characters  
  androidToken: Joi.string().optional(),
  roleOid: Joi.string().required(), // Assuming roleOid is a string
});

// Validation schema for UpdateUserDto
const updateUserDto = Joi.object({  
  email: Joi.string().email().required(), // Valid email address
  password: Joi.string().min(6).required(), // Password should have at least 6 characters   
  androidToken: Joi.string().optional(), 
  roleOid: Joi.string().required(), // Assuming roleOid is a string
});

const params = Joi.object({
  oid: Joi.string().uuid().required()
});

const query = Joi.object({
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
  query
};