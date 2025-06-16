const Joi = require('joi');
const { authSchema } = require('./base-dto');

// Define the schema for FilterDistrictDto
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, ''),
    cityOid: Joi.string().optional().allow(null, ''),
    districtName: Joi.string().optional().allow(null, ''),
});

// Define the schema for CreateDistrictDto
const createDto = Joi.object({
    cityOid: Joi.string().required(),
    districtName: Joi.string().required(),
});

// Define the schema for UpdateDistrictDto
const updateDto = Joi.object({
    cityOid: Joi.string().required(),
    districtName: Joi.string().required(),
});

const params = Joi.object({
    oid: Joi.string().uuid().required()
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
    sortBy: Joi.string().valid('cityOid', 'districtName').optional().default('districtName'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

const filterDistrictDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getDistrictDto = Joi.object({
    headers: authSchema,
    params: params,
});

const deleteDistrictDto = Joi.object({
    headers: authSchema,
    params: params,
});

const updateDistrictDto = Joi.object({
    headers: authSchema,
    params: params,
    body: updateDto
});

const createDistrictDto = Joi.object({
    headers: authSchema,
    body: createDto
});

module.exports = {
    createDistrictDto,
    updateDistrictDto,
    deleteDistrictDto,
    filterDistrictDto,
    getDistrictDto,
};
