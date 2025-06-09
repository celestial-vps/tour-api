const Joi = require('joi');
const { authSchema } = require('./base-dto');

// === Schema untuk membuat Customer ===
const createCustomerDto = Joi.object({
  customerName: Joi.string().required(),
  customerPhone: Joi.string().required(),
  customerEmail: Joi.string().email().required(),
  customerPostalCode: Joi.string().required(),
  bankOid: Joi.string().uuid().required(),
  subDistrictOid: Joi.string().uuid().required(), // Pastikan ini ditambahkan di model juga
});

// === Schema untuk memperbarui Customer ===
const updateCustomerDto = Joi.object({
  customerName: Joi.string().required(),
  customerPhone: Joi.string().required(),
  customerEmail: Joi.string().email().required(),
  customerPostalCode: Joi.string().required(),
  bankOid: Joi.string().uuid().required(),
  subDistrictOid: Joi.string().uuid().required(),
});

// === Parameter OID untuk endpoint spesifik ===
const params = Joi.object({
  oid: Joi.string().uuid().required()
});

// === Query untuk pagination ===
const query = Joi.object({
  pageIndex: Joi.number().integer().min(1).required(),
  pageSize: Joi.number().integer().min(1).max(100).required(),
});

// === Filter body (untuk pencarian) ===
const filterDto = Joi.object({
  customerName: Joi.string().optional().allow(null, ''),
  customerPhone: Joi.string().optional().allow(null, ''),
  customerEmail: Joi.string().optional().allow(null, ''),
  customerPostalCode: Joi.string().optional().allow(null, ''),
  bankOid: Joi.string().uuid().optional().allow(null, ''),
  subDistrictOid: Joi.string().uuid().optional().allow(null, ''),
  fieldName: Joi.string().optional().allow(null, ''),
  sortOrder: Joi.number().integer().valid(-1, 0, 1).optional().allow(null, 0)
});

// === DTO untuk masing-masing endpoint ===

const createCustomerRequestDto = Joi.object({
  headers: authSchema,
  body: createCustomerDto
});

const updateCustomerRequestDto = Joi.object({
  headers: authSchema,
  params: params,
  body: updateCustomerDto
});

const deleteCustomerDto = Joi.object({
  headers: authSchema,
  params: params
});

const getCustomerDto = Joi.object({
  headers: authSchema,
  params: params
});

const filterCustomerDto = Joi.object({
  headers: authSchema,
  query: query,
  body: filterDto
});

module.exports = {
  createCustomerRequestDto,
  updateCustomerRequestDto,
  deleteCustomerDto,
  getCustomerDto,
  filterCustomerDto
};
