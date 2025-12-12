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
    sortBy: Joi.string().valid('storeName', 'storeDescription', 'phone').optional().default('storeDescription'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

const querySearch = Joi.object({
    search: Joi.string().valid('search').optional().default('123')
});

// Body schemas
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, '').example('BCA'),
    storeName: Joi.string().optional().allow(null, '').example('BCA001'),
    storeDescription: Joi.string().optional().allow(null, '').example('Seller Central Asia')
});

const createDto = Joi.object({
     storeName: Joi.string().required().example('BCA001'),
    storeDescription: Joi.string().required().example('BCA'),
    phone: Joi.string().required().example('Seller Central Asia'),
    nationalId: Joi.string().required().example('Seller Central Asia'),
    bankAccountNumber: Joi.string().required().example('Seller Central Asia'),
    bankAccountName: Joi.string().required().example('Seller Central Asia'),
    sellerStatus: Joi.string().required().example('Seller Central Asia'),
});

const updateDto = Joi.object({
    storeName: Joi.string().required().example('BCA001'),
    storeDescription: Joi.string().required().example('BCA'),
    phone: Joi.string().required().example('Seller Central Asia'),
    nationalId: Joi.string().required().example('Seller Central Asia'),
    bankAccountNumber: Joi.string().required().example('Seller Central Asia'),
    bankAccountName: Joi.string().required().example('Seller Central Asia'),
    sellerStatus: Joi.string().required().example('Seller Central Asia'),
});

// Complete DTOs
const filterSellerDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const filterSellerQueryDto = Joi.object({
    headers: authSchema,
    querySearch,
});

const getSellerDto = Joi.object({
    headers: authSchema,
    params
});

const deleteSellerDto = Joi.object({
    headers: authSchema,
    params
});

const updateSellerDto = Joi.object({
    headers: authSchema,
    params,
    body: updateDto
});

const createSellerDto = Joi.object({
    headers: authSchema,
    body: createDto
});

// Schema data khusus BANK
const sellerResponseDto = Joi.object({
    oid: Joi.string().required(),
    storeName: Joi.string().required().example('BCA001'),
    storeDescription: Joi.string().required().example('BCA'),
    phone: Joi.string().required().example('Seller Central Asia'),
    nationalId: Joi.string().required().example('Seller Central Asia'),
    bankAccountNumber: Joi.string().required().example('Seller Central Asia'),
    bankAccountName: Joi.string().required().example('Seller Central Asia'),
    sellerStatus: Joi.string().required().example('Seller Central Asia'),
    createdBy: Joi.string().required(),
    updatedAt: Joi.date().iso().required(),
});

module.exports = {
    createSellerDto,
    updateSellerDto,
    deleteSellerDto,
    filterSellerDto, filterSellerQueryDto,
    getSellerDto,
    sellerResponseDto,
    createDto, updateDto, filterDto, params
};
