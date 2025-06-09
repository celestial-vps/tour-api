const Joi = require('joi');

// FilterUserRoleDto
const filterUserRoleDto = Joi.object({
  roleName: Joi.string().required().allow(null, '')
});

// PageUserRoleDto
const pageUserRoleDto = Joi.object({
  roleName: Joi.string().required().allow(null, '')
});

// CreateUserRoleDto
const createUserRoleDto = Joi.object({
  roleName: Joi.string().required(),
  targetType: Joi.string().required(),
  isAdministrative: Joi.boolean().required(),
  readState: Joi.boolean().required(),
  writeState: Joi.boolean().required(),
  createState: Joi.boolean().required(),
  deleteState: Joi.boolean().required(),
  navigateState: Joi.boolean().required()
});

// UpdateUserRoleDto
const updateUserRoleDto = Joi.object({
  roleName: Joi.string().required(),
  targetType: Joi.string().required(),
  isAdministrative: Joi.boolean().required(),
  readState: Joi.boolean().required(),
  writeState: Joi.boolean().required(),
  createState: Joi.boolean().required(),
  deleteState: Joi.boolean().required(),
  navigateState: Joi.boolean().required()
});

const params = Joi.object({
  oid: Joi.string().uuid().required()
});

const querySchema = Joi.object({
  pageIndex: Joi.number().integer().min(1).required(),
  pageSize: Joi.number().integer().min(1).max(100).required(),
});

module.exports = {
  filterUserRoleDto,
  pageUserRoleDto,
  createUserRoleDto,
  updateUserRoleDto,
  querySchema,
  params
};
