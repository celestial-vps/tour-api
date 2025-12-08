const Joi = require('joi');
const { authSchema } = require('./base-dto');
const { successResponse, errorResponse } = require("./response.dto");

// Params
const params = Joi.object({
    oid: Joi.string().uuid().required().example('123e4567-e89b-12d3-a456-426614174000')
});

// Query for pagination
const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required().default(1),
    pageSize: Joi.number().integer().min(1).max(100).required().default(10),
    sortBy: Joi.string().valid('itemName').optional().default('itemName'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

// Body schemas
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, '').example('BCA'), 
    itemName: Joi.string().optional().allow(null, '').example('Item Central Asia')
});

const createDto = Joi.object({ 
    itemName: Joi.string().required().example('Item Central Asia'),  
});

const updateDto = Joi.object({ 
    itemName: Joi.string().required().example('Item Central Asia'),  
});

// Complete DTOs
const filterItemDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getItemDto = Joi.object({
    headers: authSchema,
    params
});

const deleteItemDto = Joi.object({
    headers: authSchema,
    params
});

const updateItemDto = Joi.object({
    headers: authSchema,
    params,
    body: updateDto
});

const createItemDto = Joi.object({
    headers: authSchema,
    body: createDto
});

// Schema data khusus BANK
const itemResponseDto = Joi.object({
    oid: Joi.string().required(), 
    itemName: Joi.string().required().example('BCA'), 
    createdBy: Joi.string().required(),
    updatedAt: Joi.date().iso().required(),
});

module.exports = {
    createItemDto,
    updateItemDto,
    deleteItemDto,
    filterItemDto,
    getItemDto,
    itemResponseDto,
    createDto, updateDto, filterDto, params
};
