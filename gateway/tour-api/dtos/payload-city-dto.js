const Joi = require('joi');
const { authSchema } = require('./base-dto');

// Define the schema for FilterCityDto
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, ''),
    provinceOid: Joi.string().optional().allow(null, ''),
    cityName: Joi.string().optional().allow(null, ''),
});

// Define the schema for CreateCityDto
const createDto = Joi.object({
    provinceOid: Joi.string().required(),
    cityName: Joi.string().required(),
});

// Define the schema for UpdateCityDto
const updateDto = Joi.object({
    provinceOid: Joi.string().required(),
    cityName: Joi.string().required(),
});

const params = Joi.object({
    oid: Joi.string().uuid().required()
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
    sortBy: Joi.string().valid('provinceOid', 'cityName').optional().default('cityName'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

const filterCityDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getCityDto = Joi.object({
    headers: authSchema,
    params: params,
});

const deleteCityDto = Joi.object({
    headers: authSchema,
    params: params,
});

const updateCityDto = Joi.object({
    headers: authSchema,
    params: params,
    body: updateDto
});

const createCityDto = Joi.object({
    headers: authSchema,
    body: createDto
});

module.exports = {
    createCityDto,
    updateCityDto,
    deleteCityDto,
    filterCityDto,
    getCityDto,
};
