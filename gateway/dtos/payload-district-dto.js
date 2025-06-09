const Joi = require('joi');
const { authSchema } = require('./base-dto');

// === Schema untuk membuat District ===
const createDistrictDto = Joi.object({
  cityOid: Joi.string().uuid().required(),
  districtName: Joi.string().required(),
});

// === Schema untuk memperbarui District ===
const updateDistrictDto = Joi.object({
  cityOid: Joi.string().uuid().required(),
  districtName: Joi.string().required(),
});

// === Parameter (misalnya untuk GET/DELETE/UPDATE by OID) ===
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
  cityOid: Joi.string().uuid().optional().allow(null, ''),
  districtName: Joi.string().optional().allow(null, ''),
  fieldName: Joi.string().optional().allow(null, ''),
  sortOrder: Joi.number().integer().valid(-1, 0, 1).optional().allow(null, 0)
});

// === DTO untuk masing-masing endpoint ===

const createDistrictRequestDto = Joi.object({
  headers: authSchema,
  body: createDistrictDto
});

const updateDistrictRequestDto = Joi.object({
  headers: authSchema,
  params: params,
  body: updateDistrictDto
});

const deleteDistrictDto = Joi.object({
  headers: authSchema,
  params: params
});

const getDistrictDto = Joi.object({
  headers: authSchema,
  params: params
});

const filterDistrictDto = Joi.object({
  headers: authSchema,
  query: query,
  body: filterDto
});

module.exports = {
  createDistrictRequestDto,
  updateDistrictRequestDto,
  deleteDistrictDto,
  getDistrictDto,
  filterDistrictDto
};
