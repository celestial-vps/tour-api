const Joi = require('joi');
const { authSchema } = require('./base-dto');

// Define the schema for FilterHotelDto
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, ''),
    hotelName: Joi.string().optional().allow(null, ''),
    address: Joi.string().optional().allow(null, ''),
    phone: Joi.string().optional().allow(null, ''),
    star_rating: Joi.string().optional().allow(null, ''),
});

// Define the schema for CreateHotelDto
const createDto = Joi.object({
    hotelName: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    star_rating: Joi.string().required(),
});

// Define the schema for UpdateHotelDto
const updateDto = Joi.object({
    hotelName: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    star_rating: Joi.string().required(),
});

const params = Joi.object({
    oid: Joi.string().uuid().required()
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
    sortBy: Joi.string().valid('hotelName', 'address', 'phone', 'star_rating').optional().default('address'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

const filterHotelDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getHotelDto = Joi.object({
    headers: authSchema,
    params: params,
});

const deleteHotelDto = Joi.object({
    headers: authSchema,
    params: params,
});

const updateHotelDto = Joi.object({
    headers: authSchema,
    params: params,
    body: updateDto
});

const createHotelDto = Joi.object({
    headers: authSchema,
    body: createDto
});

module.exports = {
    createHotelDto,
    updateHotelDto,
    deleteHotelDto,
    filterHotelDto,
    getHotelDto,
};
