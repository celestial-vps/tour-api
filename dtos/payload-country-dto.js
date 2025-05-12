const Joi = require('joi');
const { authSchema } = require('./base-dto');
const { param } = require('../routes/country.route');

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
const createDto = Joi.object({
    countryCode: Joi.string().required(),
    countryName: Joi.string().required(),
    countryCurrency: Joi.string().required()
});

// Define the schema for UpdateCountryDto
const updateDto = Joi.object({
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

const getCountryDto = Joi.object({
    headers: authSchema,
    params:params,        
});

const deleteCountryDto = Joi.object({
    headers: authSchema,
    params:params,        
});


const updateCountryDto = Joi.object({
    headers: authSchema,
    params:params,        
    body: updateDto
});

const createCountryDto = Joi.object({
    headers: authSchema,   
    body: createDto
});



module.exports = {
    createCountryDto,
    updateCountryDto,
    deleteCountryDto,
    filterCountryDto,
    getCountryDto, 
};
