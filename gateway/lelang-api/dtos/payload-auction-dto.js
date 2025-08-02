const Joi = require('joi');

// Validation schema for FilterItemDto
const filterItemDto = Joi.object({
    startTime: Joi.string().optional().allow(null, ''),
    endTime: Joi.string().optional().allow(null, '')
});

// Validation schema for PageItemDto
const pageItemDto = Joi.object({
    startTime: Joi.string().optional().allow(null, ''),
    endTime: Joi.string().optional().allow(null, '')
});

// Validation schema for CreateItemDto
const createItemDto = Joi.object({
    itemOid: Joi.string().required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
    status: Joi.number().required(),

});

// Validation schema for UpdateItemDto
const updateItemDto = Joi.object({
    itemOid: Joi.string().required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
    status: Joi.number().required(),
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