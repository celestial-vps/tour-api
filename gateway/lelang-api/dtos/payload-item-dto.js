const Joi = require('joi');

// Validation schema for FilterItemDto
const filterItemDto = Joi.object({
    itemName: Joi.string().optional().allow(null, ''),
    description: Joi.string().optional().allow(null, '')
});

// Validation schema for PageItemDto
const pageItemDto = Joi.object({
    itemName: Joi.string().optional().allow(null, ''),
    description: Joi.string().optional().allow(null, '')
});

// Validation schema for CreateItemDto
const createItemDto = Joi.object({
    itemName: Joi.string().required(),
    description: Joi.string().required(),
    imageOid: Joi.string().required(),
    startingPrice: Joi.number().required(),
    owner: Joi.string().required(),

});

// Validation schema for UpdateItemDto
const updateItemDto = Joi.object({
    itemName: Joi.string().required(),
    description: Joi.string().required(),
    imageOid: Joi.string().required(),
    startingPrice: Joi.number().required(),
    owner: Joi.string().required(),
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