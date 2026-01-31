const Joi = require('joi');
const { authSchema } = require('./base-dto');

// Define the schema for FilterVehicleDto
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, ''),
    // vehicleTypeOid: Joi.string().optional().allow(null, ''),
    // year: Joi.string().optional().allow(null, ''),
    // color: Joi.string().optional().allow(null, ''),
    // seatCapacity: Joi.number().integer().min(1).max(99).required(),
    // licensePlate: Joi.string().min(1).max(10).pattern(/^[A-Z0-9]+$/i).required(),
    // status: Joi.string().optional().allow(null, ''),
    // pricePerDay: Joi.number().optional().allow(null, ''),
});

// Define the schema for CreateVehicleDto
const createDto = Joi.object({
    vehicleTypeOid: Joi.string().required(),
    year: Joi.string().pattern(/^\d{4}$/).required(),
    color: Joi.string().required(),
    seatCapacity: Joi.number().integer().min(1).max(99).required(),
    licensePlate: Joi.string().min(1).max(10).pattern(/^[A-Z0-9]+$/i).required(),
    status: Joi.string().valid('available', 'rented', 'service').required(),
    pricePerDay: Joi.number().required(),
});

// Define the schema for UpdateVehicleDto
const updateDto = Joi.object({
    vehicleTypeOid: Joi.string().required(),
    year: Joi.string().pattern(/^\d{4}$/).required(),
    color: Joi.string().required(),
    status: Joi.string().valid('available', 'rented', 'service').required(),
    pricePerDay: Joi.number().required(),
});

const params = Joi.object({
    oid: Joi.string().uuid().required()
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
    sortBy: Joi.string().valid('vehicleTypeOid', 'year', 'color', 'status', 'pricePerDay').optional().default('year'),
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
