const Joi = require('joi');
const { authSchema } = require('./base-dto');
const { successResponse, errorResponse } = require("./response-dto");

// Params
// const params = Joi.object({
//     oid: Joi.string().length(24).hex().required().example('507f1f77bcf86cd799439011')
// });
// Params
const params = Joi.object({
    oid: Joi.string().uuid().required().example('123e4567-e89b-12d3-a456-426614174000')
});
// Query for pagination
const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).optional().default(1),
    pageSize: Joi.number().integer().min(1).max(100).optional().default(10),
    sortBy: Joi.string().valid('bankCode', 'bankName', 'shortName').optional().default('bankName'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

// Body schemas
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, '').example('BCA'),
    bankCode: Joi.string().optional().allow(null, '').example('BCA001'),
    bankName: Joi.string().optional().allow(null, '').example('Bank Central Asia')
});

const createDto = Joi.object({
    bankCode: Joi.string().required().example('BCA001'),
    bankName: Joi.string().required().example('Bank Central Asia'),
    shortName: Joi.string().optional().example('BCA'),
    description: Joi.string().optional().example('Bank description')
});

const updateDto = Joi.object({
    bankCode: Joi.string().required().example('BCA001'),
    bankName: Joi.string().required().example('Bank Central Asia'),
    shortName: Joi.string().optional().example('BCA'),
    description: Joi.string().optional().example('Bank description')
});

// Complete DTOs
const filterBankDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getBankDto = Joi.object({
    headers: authSchema,
    params
});

const deleteBankDto = Joi.object({
    headers: authSchema,
    params
});

const updateBankDto = Joi.object({
    headers: authSchema,
    params,
    body: updateDto
});

const createBankDto = Joi.object({
    headers: authSchema,
    body: createDto
});

// Schema data khusus BANK
const bankResponseDto = Joi.object({
    oid: Joi.string().required(),
    bankCode: Joi.string().required().example('BCA001'),
    bankName: Joi.string().required().example('BCA'),
    shortName: Joi.string().required().example('Bank Central Asia'),
    createdBy: Joi.string().required(),
    updatedAt: Joi.date().iso().required(),
});

module.exports = {
    createBankDto,
    updateBankDto,
    deleteBankDto,
    filterBankDto,
    getBankDto,
    bankResponseDto,
    createDto, updateDto, filterDto, params
};
