const Joi = require('joi');
const { authSchema } = require('./base-dto');

// Define the schema for FilterCountryDto
const filterDto = Joi.object({
    countryCode: Joi.string().optional().allow(null, ''),
    countryName: Joi.string().optional().allow(null, ''),
    fieldName: Joi.string().optional().allow(null, ''),
    sortOrder: Joi.number().integer().valid(-1, 0, 1).optional().allow(null, 0)
});

// Define the schema for PageCountryDto
const pageCountryDto = Joi.object({
    countryCode: Joi.string().optional().allow(null, ''),
    countryName: Joi.string().optional().allow(null, '')
});

// Define the schema for CreateCountryDto
const createCountryDto = Joi.object({
    countryCode: Joi.string().required(),
    countryName: Joi.string().required(),
    countryCurrency: Joi.string().required()
});

// Define the schema for UpdateCountryDto
const updateCountryDto = Joi.object({
    countryCode: Joi.string().required(),
    countryName: Joi.string().required(),
    countryCurrency: Joi.string().required()
});

const params = Joi.object({
    oid: Joi.string().uuid().required()
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
});

const filterCountryDto = Joi.object({
    headers: authSchema,
    query: query,
    body: filterDto
});



module.exports = {
    filterCountryDto,
    pageCountryDto,
    createCountryDto,
    updateCountryDto,
    query,
    filterDto,
    params
};
