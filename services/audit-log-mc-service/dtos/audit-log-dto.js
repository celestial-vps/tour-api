const Joi = require('joi');
const { authSchema } = require('./base-dto');

// Define the schema for FilterUserDto
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, ''),
    username: Joi.string().optional().allow(null, ''),
});

// Define the schema for CreateUserDto
const createDto = Joi.object({
    username: Joi.string().required(),
    createdBy: Joi.string().optional().allow(null, ''),
});

// Define the schema for UpdateUserDto
const updateDto = Joi.object({
    username: Joi.string().required(),
    updatedBy: Joi.string().optional().allow(null, ''),
});

const params = Joi.object({
    id: Joi.string().uuid().required()
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
    sortBy: Joi.string().valid('username', 'createdAt', 'updatedAt').optional().default('username'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

const filterUserDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getUserDto = Joi.object({
    headers: authSchema,
    params: params,
});

const deleteUserDto = Joi.object({
    headers: authSchema,
    params: params,
});

const updateUserDto = Joi.object({
    headers: authSchema,
    params: params,
    body: updateDto
});

const createUserDto = Joi.object({
    headers: authSchema,
    body: createDto
});

module.exports = {
    createUserDto,
    updateUserDto,
    deleteUserDto,
    filterUserDto,
    getUserDto,
};