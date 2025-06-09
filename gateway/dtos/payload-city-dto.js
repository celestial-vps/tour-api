const Joi = require('joi');
const { authSchema } = require('./base-dto');

// === Schema untuk operasi create ===
const createCityDto = Joi.object({
    provinceOid: Joi.string().uuid().required(),
    cityName: Joi.string().required(),
});

// === Schema untuk operasi update ===
const updateCityDto = Joi.object({
    provinceOid: Joi.string().uuid().required(),
    cityName: Joi.string().required(),
});

// === Parameter (misalnya untuk get, delete, update by oid) ===
const params = Joi.object({
    oid: Joi.string().uuid().required()
});

// === Query untuk pagination ===
const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
});

// === Body untuk filter/search ===
const filterDto = Joi.object({
    provinceOid: Joi.string().uuid().optional().allow(null, ''),
    cityName: Joi.string().optional().allow(null, ''),
    fieldName: Joi.string().optional().allow(null, ''),
    sortOrder: Joi.number().integer().valid(-1, 0, 1).optional().allow(null, 0)
});

// === DTO Wrapper untuk masing-masing endpoint ===

// Create City
const createCityRequestDto = Joi.object({
    headers: authSchema,
    body: createCityDto
});

// Update City
const updateCityRequestDto = Joi.object({
    headers: authSchema,
    params: params,
    body: updateCityDto
});

// Delete City
const deleteCityDto = Joi.object({
    headers: authSchema,
    params: params
});

// Get City by ID
const getCityDto = Joi.object({
    headers: authSchema,
    params: params
});

// Filter + Pagination
const filterCityDto = Joi.object({
    headers: authSchema,
    query: query,
    body: filterDto
});

module.exports = {
    createCityRequestDto,
    updateCityRequestDto,
    deleteCityDto,
    getCityDto,
    filterCityDto,
};
