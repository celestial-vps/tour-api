const Joi = require('joi');
const { authSchema } = require('./base-dto');

// Define the schema for FilterVehicleDto
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, ''),
    vehicleTypeOid: Joi.string().optional().allow(null, ''),
    year: Joi.string().optional().allow(null, ''),
    color: Joi.string().optional().allow(null, ''),
    status: Joi.string().optional().allow(null, ''),
    price_per_day: Joi.string().optional().allow(null, ''),
});

// Define the schema for CreateVehicleDto
const createDto = Joi.object({
    vehicleTypeOid: Joi.string().required(),
    year: Joi.string().required(),
    color: Joi.string().required(),
    status: Joi.string().required(),
    price_per_day: Joi.string().required(),
});

// Define the schema for UpdateVehicleDto
const updateDto = Joi.object({
    vehicleTypeOid: Joi.string().required(),
    year: Joi.string().required(),
    color: Joi.string().required(),
    status: Joi.string().required(),
    price_per_day: Joi.string().required(),
});

const params = Joi.object({
    oid: Joi.string().uuid().required()
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
    sortBy: Joi.string().valid('vehicleTypeOid', 'year', 'color', 'status', 'price_per_day').optional().default('year'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

const filterVehicleDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getVehicleDto = Joi.object({
    headers: authSchema,
    params: params,
});

const deleteVehicleDto = Joi.object({
    headers: authSchema,
    params: params,
});

const updateVehicleDto = Joi.object({
    headers: authSchema,
    params: params,
    body: updateDto
});

const createVehicleDto = Joi.object({
    headers: authSchema,
    body: createDto
});

module.exports = {
    createVehicleDto,
    updateVehicleDto,
    deleteVehicleDto,
    filterVehicleDto,
    getVehicleDto,
};
