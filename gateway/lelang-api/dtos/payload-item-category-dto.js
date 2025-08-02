const Joi = require('joi');

// Validation schema for FilterItemDto
const filterItemDto = Joi.object({
    categoryName: Joi.string().optional().allow(null, ''),    
});

// Validation schema for PageItemDto
const pageItemDto = Joi.object({
    categoryName: Joi.string().optional().allow(null, ''),    
});

// Validation schema for CreateItemDto
const createItemDto = Joi.object({
    categoryName: Joi.string().required(),    
});

// Validation schema for UpdateItemDto
const updateItemDto = Joi.object({
    categoryName: Joi.string().required(),    
});

const params = Joi.object({
    oid: Joi.string().required()
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
});

module.exports = {
    params,
    filterItemDto,
    pageItemDto,
    createItemDto,
    updateItemDto,
    query
};