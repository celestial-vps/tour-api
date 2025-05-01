const Joi = require('joi');

// Define the schema for FilterBankDto
const filterBankDto = Joi.object({
    bankCode: Joi.string().optional().allow(null, ''),
    bankName: Joi.string().optional().allow(null, '')
});

// Define the schema for PageBankDto
const pageBankDto = Joi.object({
    bankCode: Joi.string().optional().allow(null, ''),
    bankName: Joi.string().optional().allow(null, '')
});

// Define the schema for CreateBankDto
const createBankDto = Joi.object({
    bankCode: Joi.string().required(),
    bankName: Joi.string().required(),
    shortName: Joi.string().required()
});

// Define the schema for UpdateBankDto
const updateBankDto = Joi.object({
    bankCode: Joi.string().required(),
    bankName: Joi.string().required(),
    shortName: Joi.string().required()
});

const params = Joi.object({
    oid: Joi.string().uuid().required()
});

const querySchema = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
});

module.exports = {
    filterBankDto,
    pageBankDto,
    createBankDto,
    updateBankDto,
    querySchema,
    params
};
