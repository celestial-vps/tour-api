const Joi = require('joi');
const { authSchema } = require('./base-dto');

// Define the schema for FilterBrandDto
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, ''),
    brandName: Joi.string().optional().allow(null, ''),
});

// Define the schema for CreateBrandDto
const createDto = Joi.object({
    brandName: Joi.string().required(),
    imageOid: Joi.string().required(),
});

// Define the schema for UpdateBrandDto
const updateDto = Joi.object({
    brandName: Joi.string().required(),
});

const params = Joi.object({
    oid: Joi.string().uuid().required()
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
    sortBy: Joi.string().valid('brandName').optional().default('brandName'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

const filterBrandDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getBrandDto = Joi.object({
    headers: authSchema,
    params: params,
});

const deleteBrandDto = Joi.object({
    headers: authSchema,
    params: params,
});

const updateBrandDto = Joi.object({
    headers: authSchema,
    params: params,
    body: updateDto
});

const createBrandDto = Joi.object({
    headers: authSchema,
    body: createDto
});

module.exports = {
    createBrandDto,
    updateBrandDto,
    deleteBrandDto,
    filterBrandDto,
    getBrandDto,
};
