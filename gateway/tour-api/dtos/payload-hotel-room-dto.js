const Joi = require('joi');
const { authSchema } = require('./base-dto');

// Define the schema for FilterHotelRoomDto
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, ''),
    hotelOid: Joi.string().optional().allow(null, ''),
    roomType: Joi.string().optional().allow(null, ''),
    capacity: Joi.string().optional().allow(null, ''),
    pricePerNight: Joi.string().optional().allow(null, ''),
    amenities: Joi.string().optional().allow(null, ''),
    status: Joi.string().optional().allow(null, ''),
});

// Define the schema for CreateHotelRoomDto
const createDto = Joi.object({
    hotelOid: Joi.string().required(),
    roomType: Joi.string().required(),
    capacity: Joi.string().required(),
    pricePerNight: Joi.string().required(),
    amenities: Joi.string().required(),
    status: Joi.string().required(),
});

// Define the schema for UpdateHotelRoomDto
const updateDto = Joi.object({
    hotelOid: Joi.string().required(),
    roomType: Joi.string().required(),
    capacity: Joi.string().required(),
    pricePerNight: Joi.string().required(),
    amenities: Joi.string().required(),
    status: Joi.string().required(),
});

const params = Joi.object({
    oid: Joi.string().uuid().required()
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
    sortBy: Joi.string().valid('hotelOid', 'roomType', 'capacity', 'pricePerNight', 'amenities', 'status').optional().default('roomType'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

const filterHotelRoomDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getHotelRoomDto = Joi.object({
    headers: authSchema,
    params: params,
});

const deleteHotelRoomDto = Joi.object({
    headers: authSchema,
    params: params,
});

const updateHotelRoomDto = Joi.object({
    headers: authSchema,
    params: params,
    body: updateDto
});

const createHotelRoomDto = Joi.object({
    headers: authSchema,
    body: createDto
});

module.exports = {
    createHotelRoomDto,
    updateHotelRoomDto,
    deleteHotelRoomDto,
    filterHotelRoomDto,
    getHotelRoomDto,
};
