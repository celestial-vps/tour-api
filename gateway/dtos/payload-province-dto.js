const Joi = require('joi');
const { authSchema } = require('./base-dto');

// === Schema untuk membuat Province ===
const createProvinceDto = Joi.object({
  countryOid: Joi.string().uuid().required(),
  provinceName: Joi.string().required(),
});

// === Schema untuk memperbarui Province ===
const updateProvinceDto = Joi.object({
  countryOid: Joi.string().uuid().required(),
  provinceName: Joi.string().required(),
});

// === Parameter untuk operasi berdasarkan OID ===
const params = Joi.object({
  oid: Joi.string().uuid().required()
});

// === Query untuk pagination ===
const query = Joi.object({
  pageIndex: Joi.number().integer().min(1).required(),
  pageSize: Joi.number().integer().min(1).max(100).required(),
});

// === Body untuk filter pencarian ===
const filterDto = Joi.object({
  countryOid: Joi.string().uuid().optional().allow(null, ''),
  provinceName: Joi.string().optional().allow(null, ''),
  fieldName: Joi.string().optional().allow(null, ''),
  sortOrder: Joi.number().integer().valid(-1, 0, 1).optional().allow(null, 0),
});

// === DTO untuk masing-masing endpoint ===

const createProvinceRequestDto = Joi.object({
  headers: authSchema,
  body: createProvinceDto
});

const updateProvinceRequestDto = Joi.object({
  headers: authSchema,
  params: params,
  body: updateProvinceDto
});

const deleteProvinceDto = Joi.object({
  headers: authSchema,
  params: params
});

const getProvinceDto = Joi.object({
  headers: authSchema,
  params: params
});

const filterProvinceDto = Joi.object({
  headers: authSchema,
  query: query,
  body: filterDto
});

module.exports = {
  createProvinceRequestDto,
  updateProvinceRequestDto,
  deleteProvinceDto,
  getProvinceDto,
  filterProvinceDto
};
