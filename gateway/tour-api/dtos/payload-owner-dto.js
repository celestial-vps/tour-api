const Joi = require('joi');
const { authSchema } = require('./base-dto');

// === Schema untuk membuat Owner ===
const createOwnerDto = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
  postalCode: Joi.string().required(),
  bankOid: Joi.string().uuid().required(),
  subDistrictOid: Joi.string().uuid().required(),
});

// === Schema untuk memperbarui Owner ===
const updateOwnerDto = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
  postalCode: Joi.string().required(),
  bankOid: Joi.string().uuid().required(),
  subDistrictOid: Joi.string().uuid().required(),
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
  name: Joi.string().optional().allow(null, ''),
  phone: Joi.string().optional().allow(null, ''),
  email: Joi.string().optional().allow(null, ''),
  postalCode: Joi.string().optional().allow(null, ''),
  bankOid: Joi.string().uuid().optional().allow(null, ''),
  subDistrictOid: Joi.string().uuid().optional().allow(null, ''),
  fieldName: Joi.string().optional().allow(null, ''),
  sortOrder: Joi.number().integer().valid(-1, 0, 1).optional().allow(null, 0),
});

// === DTO untuk masing-masing endpoint ===

const createOwnerRequestDto = Joi.object({
  headers: authSchema,
  body: createOwnerDto
});

const updateOwnerRequestDto = Joi.object({
  headers: authSchema,
  params: params,
  body: updateOwnerDto
});

const deleteOwnerDto = Joi.object({
  headers: authSchema,
  params: params
});

const getOwnerDto = Joi.object({
  headers: authSchema,
  params: params
});

const filterOwnerDto = Joi.object({
  headers: authSchema,
  query: query,
  body: filterDto
});

module.exports = {
  createOwnerRequestDto,
  updateOwnerRequestDto,
  deleteOwnerDto,
  getOwnerDto,
  filterOwnerDto
};
