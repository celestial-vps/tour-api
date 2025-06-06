const Joi = require('joi');
const { authSchema } = require('./base-dto');

// === Schema untuk membuat HotelRoom ===
const createHotelRoomDto = Joi.object({
  hotelOid: Joi.string().uuid().required(),
  room_type: Joi.string().max(50).required(),
  capacity: Joi.number().integer().min(1).required(),
  price_per_night: Joi.number().precision(2).min(0).required(),
  amenities: Joi.string().optional().allow(null, ''),
  status: Joi.string().valid('available', 'booked', 'maintenance').optional(),
});

// === Schema untuk memperbarui HotelRoom ===
const updateHotelRoomDto = Joi.object({
  hotelOid: Joi.string().uuid().required(),
  room_type: Joi.string().max(50).required(),
  capacity: Joi.number().integer().min(1).required(),
  price_per_night: Joi.number().precision(2).min(0).required(),
  amenities: Joi.string().optional().allow(null, ''),
  status: Joi.string().valid('available', 'booked', 'maintenance').required(),
});

// === Parameter (room_id) untuk GET, DELETE, UPDATE ===
const params = Joi.object({
  room_id: Joi.number().integer().required()
});

// === Query untuk pagination ===
const query = Joi.object({
  pageIndex: Joi.number().integer().min(1).required(),
  pageSize: Joi.number().integer().min(1).max(100).required(),
});

// === Filter body untuk pencarian ===
const filterDto = Joi.object({
  hotelOid: Joi.string().uuid().optional().allow(null, ''),
  room_type: Joi.string().optional().allow(null, ''),
  status: Joi.string().valid('available', 'booked', 'maintenance').optional().allow(null, ''),
  fieldName: Joi.string().optional().allow(null, ''),
  sortOrder: Joi.number().integer().valid(-1, 0, 1).optional().allow(null, 0)
});

// === DTO untuk masing-masing endpoint ===

const createHotelRoomRequestDto = Joi.object({
  headers: authSchema,
  body: createHotelRoomDto
});

const updateHotelRoomRequestDto = Joi.object({
  headers: authSchema,
  params: params,
  body: updateHotelRoomDto
});

const deleteHotelRoomDto = Joi.object({
  headers: authSchema,
  params: params
});

const getHotelRoomDto = Joi.object({
  headers: authSchema,
  params: params
});

const filterHotelRoomDto = Joi.object({
  headers: authSchema,
  query: query,
  body: filterDto
});

module.exports = {
  createHotelRoomRequestDto,
  updateHotelRoomRequestDto,
  deleteHotelRoomDto,
  getHotelRoomDto,
  filterHotelRoomDto
};
