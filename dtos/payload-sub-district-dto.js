const Joi = require('joi');
const { authSchema } = require('./base-dto');

// Schema untuk CreateSubdistrictDto
const createSubdistrictDto = Joi.object({
  districtOid: Joi.string().uuid().required(),
  subDistrictName: Joi.string().required(),
  postalCode: Joi.string().required(),
});

// Schema untuk UpdateSubdistrictDto
const updateSubdistrictDto = Joi.object({
  districtOid: Joi.string().uuid().required(),
  subDistrictName: Joi.string().required(),
  postalCode: Joi.string().required(),
});

// Params schema untuk operasi berdasarkan OID
const params = Joi.object({
  oid: Joi.string().uuid().required(),
});

// Query schema untuk pagination
const query = Joi.object({
  pageIndex: Joi.number().integer().min(1).required(),
  pageSize: Joi.number().integer().min(1).max(100).required(),
});

// Filter schema untuk pencarian
const filterDto = Joi.object({
  districtOid: Joi.string().uuid().optional().allow(null, ''),
  subDistrictName: Joi.string().optional().allow(null, ''),
  postalCode: Joi.string().optional().allow(null, ''),
  fieldName: Joi.string().optional().allow(null, ''),
  sortOrder: Joi.number().integer().valid(-1, 0, 1).optional().allow(null, 0),
});

// DTO lengkap per endpoint

const createSubdistrictRequestDto = Joi.object({
  headers: authSchema,
  body: createSubdistrictDto,
});

const updateSubdistrictRequestDto = Joi.object({
  headers: authSchema,
  params,
  body: updateSubdistrictDto,
});

const deleteSubdistrictDto = Joi.object({
  headers: authSchema,
  params,
});

const getSubdistrictDto = Joi.object({
  headers: authSchema,
  params,
});

const filterSubdistrictDto = Joi.object({
  headers: authSchema,
  query,
  body: filterDto,
});

module.exports = {
  createSubdistrictRequestDto,
  updateSubdistrictRequestDto,
  deleteSubdistrictDto,
  getSubdistrictDto,
  filterSubdistrictDto,
};
