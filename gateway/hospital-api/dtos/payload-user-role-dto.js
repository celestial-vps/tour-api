const Joi = require('joi');
const { authSchema } = require('./base-dto');

// Params
const params = Joi.object({
    oid: Joi.string().uuid().required().example('123e4567-e89b-12d3-a456-426614174000')
});

// Query for pagination
const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required().default(1).example(1),
    pageSize: Joi.number().integer().min(1).max(100).required().default(10).example(10),
});

// Filter (Body)
const filterDto = Joi.object({
   search: Joi.string().optional().allow(null, '').example('Cardiology')
});

// Page DTO (Body)
const pageUserRoleDto = Joi.object({
    roleName: Joi.string().allow(null, '').required().example('Manager'),
});

// Create DTO
const createDto = Joi.object({
    roleName: Joi.string().required().example('Supervisor'),
    targetType: Joi.string().required().example('SYSTEM'),
    isAdministrative: Joi.boolean().required().example(true),
    readState: Joi.boolean().required().example(true),
    writeState: Joi.boolean().required().example(true),
    createState: Joi.boolean().required().example(true),
    deleteState: Joi.boolean().required().example(false),
    navigateState: Joi.boolean().required().example(true),
    description: Joi.string().allow('', null).optional().example('Role with limited access'),
});

// Update DTO
const updateDto = Joi.object({
    roleName: Joi.string().required().example('Supervisor Updated'),
    targetType: Joi.string().required().example('APP'),
    isAdministrative: Joi.boolean().required().example(false),
    readState: Joi.boolean().required().example(true),
    writeState: Joi.boolean().required().example(false),
    createState: Joi.boolean().required().example(true),
    deleteState: Joi.boolean().required().example(false),
    navigateState: Joi.boolean().required().example(true),
    description: Joi.string().allow('', null).optional().example('Updated description'),
});

// --------------------- COMPLETE DTOs --------------------- //

// Filter User Role
const filterUserRoleDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

// Get User Role by OID
const getUserRoleDto = Joi.object({
    headers: authSchema,
    params
});

// Delete User Role
const deleteUserRoleDto = Joi.object({
    headers: authSchema,
    params
});

// Update User Role
const updateUserRoleDto = Joi.object({
    headers: authSchema,
    params,
    body: updateDto
});

// Create User Role
const createUserRoleDto = Joi.object({
    headers: authSchema,
    body: createDto
});

// Response DTO
const userRoleResponseDto = Joi.object({
    oid: Joi.string().required().example('550e8400-e29b-41d4-a716-446655440000'),
    roleName: Joi.string().required().example('Admin'),
    targetType: Joi.string().required().example('SYSTEM'),
    isAdministrative: Joi.boolean().required().example(true),
    readState: Joi.boolean().required().example(true),
    writeState: Joi.boolean().required().example(true),
    createState: Joi.boolean().required().example(true),
    deleteState: Joi.boolean().required().example(true),
    navigateState: Joi.boolean().required().example(true),
    description: Joi.string().allow(null).example('Full system admin'),
    createdAt: Joi.date().iso().required(),
    updatedAt: Joi.date().iso().required(),
});

module.exports = {
    // Complete DTOs
    filterUserRoleDto,
    getUserRoleDto,
    deleteUserRoleDto,
    updateUserRoleDto,
    createUserRoleDto,

    // Base schemas
    filterDto,
    pageUserRoleDto,
    createDto,
    updateDto,
    params,
    query,

    // Response
    userRoleResponseDto
};
