const Joi = require('joi');
const { authSchema } = require('./base-dto');
const { search } = require('../app');

// Define the schema for FilterBankDto
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, ''),
    bankCode: Joi.string().optional().allow(null, ''),  
    bankName: Joi.string().optional().allow(null, ''),  
});

// Define the schema for CreateBankDto
const createDto = Joi.object({
    bankCode: Joi.string().required(),
    bankName: Joi.string().required(), 
});

// Define the schema for UpdateBankDto
const updateDto = Joi.object({
    bankCode: Joi.string().required(),
    bankName: Joi.string().required(), 
});

const params = Joi.object({
    oid: Joi.string().uuid().required()
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
    sortBy: Joi.string().valid('bankCode', 'bankName', 'bankCurrency').optional().default('bankName'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

const filterBankDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getBankDto = Joi.object({
    headers: authSchema,
    params: params,
});

const deleteBankDto = Joi.object({
    headers: authSchema,
    params: params,
});

const updateBankDto = Joi.object({
    headers: authSchema,
    params: params,
    body: updateDto
});

const createBankDto = Joi.object({
    headers: authSchema,
    body: createDto
});

module.exports = {
    createBankDto,
    updateBankDto,
    deleteBankDto,
    filterBankDto,
    getBankDto,
};