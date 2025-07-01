const Joi = require('joi');
const { authSchema } = require('./base-dto');
 
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, ''),
    originSubAreaOid: Joi.string().optional().allow(null, ''),
    destinationSubAreaOid: Joi.string().optional().allow(null, ''),
    estimatedTime: Joi.string().optional().allow(null, ''),
});
 
const createDto = Joi.object({
    originSubAreaOid: Joi.string().required(),
    destinationSubAreaOid: Joi.string().required(),
    distanceKm: Joi.string().required(),
    estimatedTime: Joi.string().required(),
});
 
const updateDto = Joi.object({
    originSubAreaOid: Joi.string().required(),
    destinationSubAreaOid: Joi.string().required(),
    distanceKm: Joi.string().required(),
    estimatedTime: Joi.string().required(),
});

const params = Joi.object({
    oid: Joi.string().uuid().required()
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
    sortBy: Joi.string().valid('originOid', 'destinationOid', 'estimatedTime').optional().default('destinationOid'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

const filterTravelRouteDto = Joi.object({
    headers: authSchema,
    body: filterDto
});

const getTravelRouteDto = Joi.object({
    headers: authSchema,
    params: params,
});

const deleteTravelRouteDto = Joi.object({
    headers: authSchema,
    params: params,
});

const updateTravelRouteDto = Joi.object({
    headers: authSchema,
    params: params,
    body: updateDto
});

const createTravelRouteDto = Joi.object({
    headers: authSchema,
    body: createDto
});

module.exports = {
    createTravelRouteDto,
    updateTravelRouteDto,
    deleteTravelRouteDto,
    filterTravelRouteDto,
    getTravelRouteDto,
};
