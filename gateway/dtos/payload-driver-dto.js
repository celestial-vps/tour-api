const Joi = require('joi');
const { authSchema } = require('./base-dto');
 
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, ''),
    userOid: Joi.string().optional().allow(null, ''),
    licenseNumber: Joi.string().optional().allow(null, ''),
    licenseExpiry: Joi.string().optional().allow(null, ''),
    vehicleOid: Joi.string().optional().allow(null, ''),
    status: Joi.string().optional().allow(null, ''),
    hiredAt: Joi.string().optional().allow(null, ''),
    terminatedAt: Joi.string().optional().allow(null, ''),
    ratingAvg: Joi.string().optional().allow(null, ''),
    totalTrips: Joi.string().optional().allow(null, ''),
});
 
const createDto = Joi.object({
    userOid: Joi.string().required(),
    licenseNumber: Joi.string().required(),
    licenseExpiry: Joi.string().required(),
    vehicleOid: Joi.string().required(),
    status: Joi.string().required(),
    hiredAt: Joi.string().required(),
    terminatedAt: Joi.string().required(),
    ratingAvg: Joi.string().required(),
    totalTrips: Joi.string().required(),
});
 
const updateDto = Joi.object({
    userOid: Joi.string().required(),
    licenseNumber: Joi.string().required(),
    licenseExpiry: Joi.string().required(),
    vehicleOid: Joi.string().required(),
    status: Joi.string().required(),
    hiredAt: Joi.string().required(),
    terminatedAt: Joi.string().required(),
    ratingAvg: Joi.string().required(),
    totalTrips: Joi.string().required(),
});

const params = Joi.object({
    oid: Joi.string().uuid().required()
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
    sortBy: Joi.string().valid('userOid', 'licenseNumber', 'licenseExpiry', 'vehicleOid', 'status', 'hiredAt', 'terminatedAt', 'ratingAvg', 'totalTrips').optional().default('licenseNumber'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

const filterDriverDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getDriverDto = Joi.object({
    headers: authSchema,
    params: params,
});

const deleteDriverDto = Joi.object({
    headers: authSchema,
    params: params,
});

const updateDriverDto = Joi.object({
    headers: authSchema,
    params: params,
    body: updateDto
});

const createDriverDto = Joi.object({
    headers: authSchema,
    body: createDto
});

module.exports = {
    createDriverDto,
    updateDriverDto,
    deleteDriverDto,
    filterDriverDto,
    getDriverDto,
};
