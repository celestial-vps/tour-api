const Joi = require('joi');
const { authSchema } = require('./base-dto');

// Define the schema for FilterVehicleTypeDto
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, ''),
    vehicleType: Joi.string().optional().allow(null, ''),
});

// Define the schema for CreateVehicleTypeDto
const createDto = Joi.object({
    vehicleType: Joi.string().required(),
});

// Define the schema for UpdateVehicleTypeDto
const updateDto = Joi.object({
    vehicleType: Joi.string().required(),
});

const params = Joi.object({
    oid: Joi.string().uuid().required()
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
    sortBy: Joi.string().valid('vehicleType').optional().default('vehicleType'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

const filterVehicleTypeDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getVehicleTypeDto = Joi.object({
    headers: authSchema,
    params: params,
});

const deleteVehicleTypeDto = Joi.object({
    headers: authSchema,
    params: params,
});

const updateVehicleTypeDto = Joi.object({
    headers: authSchema,
    params: params,
    body: updateDto
});

const createVehicleTypeDto = Joi.object({
    headers: authSchema,
    body: createDto
});

module.exports = {
    createVehicleTypeDto,
    updateVehicleTypeDto,
    deleteVehicleTypeDto,
    filterVehicleTypeDto,
    getVehicleTypeDto,
};
