const Joi = require('joi');
const { authSchema } = require('./base-dto');

// Define the schema for FilterProvinceDto
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, ''),
    countryOid: Joi.string().optional().allow(null, ''),
    provinceName: Joi.string().optional().allow(null, ''),
});

// Define the schema for CreateProvinceDto
const createDto = Joi.object({
    countryOid: Joi.string().required(),
    provinceName: Joi.string().required(),
});

// Define the schema for UpdateProvinceDto
const updateDto = Joi.object({
    countryOid: Joi.string().required(),
    provinceName: Joi.string().required(),
});

const params = Joi.object({
    oid: Joi.string().uuid().required()
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
    sortBy: Joi.string().valid('countryOid', 'provinceName').optional().default('provinceName'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

const filterProvinceDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getProvinceDto = Joi.object({
    headers: authSchema,
    params: params,
});

const deleteProvinceDto = Joi.object({
    headers: authSchema,
    params: params,
});

const updateProvinceDto = Joi.object({
    headers: authSchema,
    params: params,
    body: updateDto
});

const createProvinceDto = Joi.object({
    headers: authSchema,
    body: createDto
});

module.exports = {
    createProvinceDto,
    updateProvinceDto,
    deleteProvinceDto,
    filterProvinceDto,
    getProvinceDto,
};
