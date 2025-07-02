const Joi = require('joi');
const { authSchema } = require('./base-dto');
 
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, ''),
    roleName: Joi.string().optional().allow(null, ''),
    targetType: Joi.string().optional().allow(null, ''),
    isAdministrative: Joi.string().optional().allow(null, ''),
    readState: Joi.string().optional().allow(null, ''),
    writeState: Joi.string().optional().allow(null, ''),
    createState: Joi.string().optional().allow(null, ''),
    deleteState: Joi.string().optional().allow(null, ''),
    navigateState: Joi.string().optional().allow(null, ''),
});
 
const createDto = Joi.object({
    roleName: Joi.string().required(),
    targetType: Joi.string().required(),
    isAdministrative: Joi.boolean().required(),
    readState: Joi.boolean().required(),
    writeState: Joi.boolean().required(),
    createState: Joi.boolean().required(),
    deleteState: Joi.boolean().required(),
    navigateState: Joi.boolean().required(),
});
 
const updateDto = Joi.object({
    roleName: Joi.string().required(),
    targetType: Joi.string().required(),
    isAdministrative: Joi.boolean().required(),
    readState: Joi.boolean().required(),
    writeState: Joi.boolean().required(),
    createState: Joi.boolean().required(),
    deleteState: Joi.boolean().required(),
    navigateState: Joi.boolean().required(),
});

const params = Joi.object({
    oid: Joi.string().uuid().required()
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
    sortBy: Joi.string().valid('roleName', 'targetType', 'isAdministrative', 'readState', 'writeState', 'createState', 'deleteState', 'navigateState').optional().default('targetType'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

const filterUserRoleDto = Joi.object({
    headers: authSchema,
    body: filterDto
});

const getUserRoleDto = Joi.object({
    headers: authSchema,
    params: params,
});

const deleteUserRoleDto = Joi.object({
    headers: authSchema,
    params: params,
});

const updateUserRoleDto = Joi.object({
    headers: authSchema,
    params: params,
    body: updateDto
});

const createUserRoleDto = Joi.object({
    headers: authSchema,
    body: createDto
});

module.exports = {
    createUserRoleDto,
    updateUserRoleDto,
    deleteUserRoleDto,
    filterUserRoleDto,
    getUserRoleDto,
};
