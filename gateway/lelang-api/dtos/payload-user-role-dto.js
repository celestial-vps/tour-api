const Joi = require('joi');

// Validation schema for FilterUserRoleDto
const filterUserRoleDto = Joi.object({
  roleName: Joi.string().required().allow(null, ''), // Role name is required and should be a string
});

// Validation schema for PageUserRoleDto
const pageUserRoleDto = Joi.object({
  roleName: Joi.string().required().allow(null, ''), // Role name is required and should be a string
});

// Validation schema for CreateUserRoleDto
const createUserRoleDto = Joi.object({
  roleName: Joi.string().required(), // Role name is required and should be a string
  targetType: Joi.string().required(), // Target type is required and should be a string
  isAdministrative: Joi.boolean().required(), // Administrative flag is required and should be a boolean
  readState: Joi.boolean().required(), // Read state is required and should be a boolean
  writeState: Joi.boolean().required(), // Write state is required and should be a boolean
  createState: Joi.boolean().required(), // Create state is required and should be a boolean
  deleteState: Joi.boolean().required(), // Delete state is required and should be a boolean
  navigateState: Joi.boolean().required(), // Navigate state is required and should be a boolean
  description: Joi.string().allow('', null).optional()
});

// Validation schema for UpdateUserRoleDto
const updateUserRoleDto = Joi.object({
  roleName: Joi.string().required(), // Role name is required and should be a string
  targetType: Joi.string().required(), // Target type is required and should be a string
  isAdministrative: Joi.boolean().required(), // Administrative flag is required and should be a boolean
  readState: Joi.boolean().required(), // Read state is required and should be a boolean
  writeState: Joi.boolean().required(), // Write state is required and should be a boolean
  createState: Joi.boolean().required(), // Create state is required and should be a boolean
  deleteState: Joi.boolean().required(), // Delete state is required and should be a boolean
  navigateState: Joi.boolean().required(), // Navigate state is required and should be a boolean
  description: Joi.string().allow('', null).optional()
});

const params = Joi.object({
  oid: Joi.string().uuid().required()
});

const query = Joi.object({
  pageIndex: Joi.number().integer().min(1).required(),
  pageSize: Joi.number().integer().min(1).max(100).required(),
});

module.exports = {
  filterUserRoleDto,
  pageUserRoleDto,
  createUserRoleDto,
  updateUserRoleDto,
  query
};