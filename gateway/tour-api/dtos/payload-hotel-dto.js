const Joi = require('joi');
const { authSchema } = require('./base-dto');

// Define the schema for FilterHotelDto
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, ''),
    hotelName: Joi.string().optional().allow(null, ''),
    address: Joi.string().optional().allow(null, ''),
    phone: Joi.string().optional().allow(null, ''),
    starRating: Joi.string().optional().allow(null, ''),
});

const hotelRoomAmenitiesSchema = Joi.object({
    hotelRoomOid: Joi.string().required(),
    amenityName: Joi.string().required(),
})

// const hotelmenitiesSchema = Joi.object({
//     hotelOid: Joi.string().required(),
//     hotelAmenityName: Joi.string().required(),
// })

const hotelmenitiesSchema = Joi.string().valid(
    'pool',
    'gym',
    'parking',
    'spa',
    'restaurant',
    'bar',
    'business_center',
    'conference_room',
    'laundry',
    'room_service',
    'pet_friendly',
    'accessible'
);


const hotelRoomSchema = Joi.object({
    // hotelOid: Joi.string().required(),
    roomType: Joi.string().required(),
    capacity: Joi.number().required(),
    pricePerNight: Joi.number().required(),
    status: Joi.string().required(),
    amenities: Joi.array().items(Joi.string()).optional().default([]),
    // amenities: Joi.array().items(hotelRoomAmenitiesSchema).optional(),
})

// Define the schema for CreateHotelDto
const createDto = Joi.object({
    hotelName: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    starRating: Joi.number().required(),
    hotelmenities: Joi.array().items(hotelmenitiesSchema).optional(),
    hotelRooms: Joi.array().items(hotelRoomSchema).optional(),
});

// Define the schema for UpdateHotelDto
const updateDto = Joi.object({
    hotelName: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    starRating: Joi.number().required(),
    hotelRooms: Joi.array().items(hotelRoomSchema).optional(),
});

const params = Joi.object({
    oid: Joi.string().uuid().required()
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
    sortBy: Joi.string().valid('hotelName', 'address', 'phone', 'starRating').optional().default('address'),
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
