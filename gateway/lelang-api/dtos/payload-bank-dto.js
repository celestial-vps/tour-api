const Joi = require('joi');

// Validation schema for FilterBankDto
const filterBankDto = Joi.object({
  bankCode: Joi.string().optional().allow(null, ''),
  bankName: Joi.string().optional().allow(null, '')
});

// Validation schema for PageBankDto
const pageBankDto = Joi.object({
  bankCode: Joi.string().optional().allow(null, ''),
  bankName: Joi.string().optional().allow(null, '')
});

// Validation schema for CreateBankDto
const createBankDto = Joi.object({
  bankCode: Joi.string().required(),
  bankName: Joi.string().required(),
  shortName: Joi.string().required(),
  description: Joi.string().allow('', null).optional()
});

// Validation schema for UpdateBankDto
const updateBankDto = Joi.object({
  bankCode: Joi.string().required(),
  bankName: Joi.string().required(),
  shortName: Joi.string().required(),
  description: Joi.string().allow('', null).optional()
});

const params = Joi.object({
  oid: Joi.string().required()
});

const query = Joi.object({
  pageIndex: Joi.number().integer().min(1).required(),
  pageSize: Joi.number().integer().min(1).max(100).required(),
});

module.exports = {
  params,
  filterBankDto,
  pageBankDto,
  createBankDto,
  updateBankDto,
  query
};