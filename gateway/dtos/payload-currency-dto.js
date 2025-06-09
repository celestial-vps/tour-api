const Joi = require('joi');
const { authSchema } = require('./base-dto');

// === Schema untuk membuat Currency ===
const createCurrencyDto = Joi.object({
  currencyName: Joi.string().required(),
  currencySymbol: Joi.string().required(),
});

// === Schema untuk memperbarui Currency ===
const updateCurrencyDto = Joi.object({
  currencyName: Joi.string().required(),
  currencySymbol: Joi.string().required(),
});

// === Parameter (misalnya untuk get/delete/update by oid) ===
const params = Joi.object({
  oid: Joi.string().uuid().required()
});

// === Query untuk pagination ===
const query = Joi.object({
  pageIndex: Joi.number().integer().min(1).required(),
  pageSize: Joi.number().integer().min(1).max(100).required(),
});

// === Body untuk filtering (opsional) ===
const filterDto = Joi.object({
  currencyName: Joi.string().optional().allow(null, ''),
  currencySymbol: Joi.string().optional().allow(null, ''),
  fieldName: Joi.string().optional().allow(null, ''),
  sortOrder: Joi.number().integer().valid(-1, 0, 1).optional().allow(null, 0)
});

// === DTO untuk masing-masing endpoint ===

// Create
const createCurrencyRequestDto = Joi.object({
  headers: authSchema,
  body: createCurrencyDto
});

// Update
const updateCurrencyRequestDto = Joi.object({
  headers: authSchema,
  params: params,
  body: updateCurrencyDto
});

// Delete
const deleteCurrencyDto = Joi.object({
  headers: authSchema,
  params: params
});

// Get by ID
const getCurrencyDto = Joi.object({
  headers: authSchema,
  params: params
});

// Filter + Pagination
const filterCurrencyDto = Joi.object({
  headers: authSchema,
  query: query,
  body: filterDto
});

module.exports = {
  createCurrencyRequestDto,
  updateCurrencyRequestDto,
  deleteCurrencyDto,
  getCurrencyDto,
  filterCurrencyDto
};
