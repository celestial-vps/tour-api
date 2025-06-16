const Joi = require('joi');
const { authSchema } = require('./base-dto');

// Define the schema for FilterSubDistrictDto
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, ''),
    districtOid: Joi.string().optional().allow(null, ''),
    subDistrictName: Joi.string().optional().allow(null, ''),
});

// Define the schema for CreateSubDistrictDto
const createDto = Joi.object({
    districtOid: Joi.string().required(),
    subDistrictName: Joi.string().required(),
});

// Define the schema for UpdateSubDistrictDto
const updateDto = Joi.object({
    districtOid: Joi.string().required(),
    subDistrictName: Joi.string().required(),
});

const params = Joi.object({
    oid: Joi.string().uuid().required()
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
    sortBy: Joi.string().valid('districtOid', 'subDistrictName').optional().default('subDistrictName'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

const filterSubDistrictDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getSubDistrictDto = Joi.object({
    headers: authSchema,
    params: params,
});

const deleteSubDistrictDto = Joi.object({
    headers: authSchema,
    params: params,
});

const updateSubDistrictDto = Joi.object({
    headers: authSchema,
    params: params,
    body: updateDto
});

const createSubDistrictDto = Joi.object({
    headers: authSchema,
    body: createDto
});

module.exports = {
    createSubDistrictDto,
    updateSubDistrictDto,
    deleteSubDistrictDto,
    filterSubDistrictDto,
    getSubDistrictDto,
};
