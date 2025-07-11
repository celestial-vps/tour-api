const Joi = require('joi');
const { authSchema } = require('./base-dto');
 
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, ''),
    routeOid: Joi.string().optional().allow(null, ''),
    vehicleOid: Joi.string().optional().allow(null, ''),
    driverOid: Joi.string().optional().allow(null, ''),
    departureTime: Joi.string().optional().allow(null, ''),
    arrivalTime: Joi.string().optional().allow(null, ''),
    status: Joi.string().optional().allow(null, ''),
});
 
const createDto = Joi.object({
    routeOid: Joi.string().required(),
    vehicleOid: Joi.string().required(),
    driverOid: Joi.string().required(),
    departureTime: Joi.string().required(),
    arrivalTime: Joi.string().required(),
    status: Joi.string().required(),
});
 
const updateDto = Joi.object({
    routeOid: Joi.string().required(),
    vehicleOid: Joi.string().required(),
    driverOid: Joi.string().required(),
    departureTime: Joi.string().required(),
    arrivalTime: Joi.string().required(),
    status: Joi.string().required(),
});

const params = Joi.object({
    oid: Joi.string().uuid().required()
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
    sortBy: Joi.string().valid('routeOid', 'vehicleOid', 'driverOid', 'departureTime', 'arrivalTime', 'status').optional().default('vehicleOid'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

const filterTravelScheduleDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getTravelScheduleDto = Joi.object({
    headers: authSchema,
    params: params,
});

const deleteTravelScheduleDto = Joi.object({
    headers: authSchema,
    params: params,
});

const updateTravelScheduleDto = Joi.object({
    headers: authSchema,
    params: params,
    body: updateDto
});

const createTravelScheduleDto = Joi.object({
    headers: authSchema,
    body: createDto
});

module.exports = {
    createTravelScheduleDto,
    updateTravelScheduleDto,
    deleteTravelScheduleDto,
    filterTravelScheduleDto,
    getTravelScheduleDto,
};
