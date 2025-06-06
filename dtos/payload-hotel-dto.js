const Joi = require('joi');
const { authSchema } = require('./base-dto');

// === Schema untuk membuat Hotel ===
const createHotelDto = Joi.object({
  hotelName: Joi.string().max(100).required(),
  address: Joi.string().required(),
  phone: Joi.string().max(20).optional().allow(null, ''),
  star_rating: Joi.number().integer().min(1).max(5).required(),
});

// === Schema untuk memperbarui Hotel ===
const updateHotelDto = Joi.object({
  hotelName: Joi.string().max(100).required(),
  address: Joi.string().required(),
  phone: Joi.string().max(20).optional().allow(null, ''),
  star_rating: Joi.number().integer().min(1).max(5).required(),
});

// === Parameter (misalnya untuk GET, DELETE, atau UPDATE by OID) ===
const params = Joi.object({
  oid: Joi.string().uuid().required()
});

// === Query untuk pagination ===
const query = Joi.object({
  pageIndex: Joi.number().integer().min(1).required(),
  pageSize: Joi.number().integer().min(1).max(100).required(),
});

// === Body untuk filtering/search ===
const filterDto = Joi.object({
  hotelName: Joi.string().optional().allow(null, ''),
  star_rating: Joi.number().integer().min(1).max(5).optional().allow(null),
  fieldName: Joi.string().optional().allow(null, ''),
  sortOrder: Joi.number().integer().valid(-1, 0, 1).optional().allow(null, 0)
});

// === DTO untuk masing-masing endpoint ===

const createHotelRequestDto = Joi.object({
  headers: authSchema,
  body: createHotelDto
});

const updateHotelRequestDto = Joi.object({
  headers: authSchema,
  params: params,
  body: updateHotelDto
});

const deleteHotelDto = Joi.object({
  headers: authSchema,
  params: params
});

const getHotelDto = Joi.object({
  headers: authSchema,
  params: params
});

const filterHotelDto = Joi.object({
  headers: authSchema,
  query: query,
  body: filterDto
});

module.exports = {
  createHotelRequestDto,
  updateHotelRequestDto,
  deleteHotelDto,
  getHotelDto,
  filterHotelDto
};
