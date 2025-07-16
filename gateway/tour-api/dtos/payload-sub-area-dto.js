const Joi = require('joi');
const { authSchema } = require('./base-dto');
 
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, ''),    
    subAreaName: Joi.string().optional().allow(null, ''),
    
});
 
const createDto = Joi.object({
     cityOid: Joi.string().uuid().required(),
    subAreaName: Joi.string().required(),
    latitude: Joi.number().precision(7).optional(),
    longitude: Joi.number().precision(7).optional(),
    address: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    email: Joi.string().email().required(),
    openingHour: Joi.string().required(),
});
 
const updateDto = Joi.object({
    cityOid: Joi.string().uuid().required(),
    subAreaName: Joi.string().required(),
    latitude: Joi.number().precision(7).optional(),
    longitude: Joi.number().precision(7).optional(),
    address: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    email: Joi.string().email().required(),
    openingHour: Joi.string().required(),
});

const params = Joi.object({
    oid: Joi.string().uuid().required()
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
    sortBy: Joi.string().valid('cityOid', 'subAreaName', 'latitude', 'longitude', 'address', 'phoneNumber', 'email', 'openingHour').optional().default('subAreaName'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

const filterSubAreaDto = Joi.object({
    headers: authSchema, 
    body: filterDto
});

const getSubAreaDto = Joi.object({
    headers: authSchema,
    params: params,
});

const deleteSubAreaDto = Joi.object({
    headers: authSchema,
    params: params,
});

const updateSubAreaDto = Joi.object({
    headers: authSchema,
    params: params,
    body: updateDto
});

const createSubAreaDto = Joi.object({
    headers: authSchema,
    body: createDto
});

module.exports = {
    createSubAreaDto,
    updateSubAreaDto,
    deleteSubAreaDto,
    filterSubAreaDto,
    getSubAreaDto,
};
