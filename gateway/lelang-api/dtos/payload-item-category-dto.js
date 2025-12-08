const Joi = require('joi');
const { authSchema } = require('./base-dto');
const { successResponse, errorResponse } = require("./response-dto");

// Params
const params = Joi.object({
    oid: Joi.string().uuid().required().example('123e4567-e89b-12d3-a456-426614174000')
});

// Query for pagination
const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required().default(1),
    pageSize: Joi.number().integer().min(1).max(100).required().default(10),
    sortBy: Joi.string().valid( 'categoryName').optional().default('categoryName'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

// Body schemas
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, '').example('BCA'), 
    categoryName: Joi.string().optional().allow(null, '').example('ItemCategory Central Asia')
});

const createDto = Joi.object({ 
    categoryName: Joi.string().required().example('ItemCategory Central Asia'), 
});

const updateDto = Joi.object({ 
    categoryName: Joi.string().required().example('ItemCategory Central Asia'), 
});

// Complete DTOs
const filterItemCategoryDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getItemCategoryDto = Joi.object({
    headers: authSchema,
    params
});

const deleteItemCategoryDto = Joi.object({
    headers: authSchema,
    params
});

const updateItemCategoryDto = Joi.object({
    headers: authSchema,
    params,
    body: updateDto
});

const createItemCategoryDto = Joi.object({
    headers: authSchema,
    body: createDto
});

// Schema data khusus BANK
const itemCategoryResponseDto = Joi.object({
    oid: Joi.string().required(), 
    categoryName: Joi.string().required().example('BCA'), 
    createdBy: Joi.string().required(),
    updatedAt: Joi.date().iso().required(),
});

module.exports = {
    createItemCategoryDto,
    updateItemCategoryDto,
    deleteItemCategoryDto,
    filterItemCategoryDto,
    getItemCategoryDto,
    itemCategoryResponseDto,
    createDto, updateDto, filterDto, params
};
