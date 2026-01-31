const Joi = require('joi');
const { authSchema } = require('./base-dto');
const { successResponse, errorResponse } = require("./response-dto");

// Params
const params = Joi.object({
    oid: Joi.string().uuid().required().example('123e4567-e89b-12d3-a456-426614174000')
});

// Query for pagination
const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required().default(1),
    pageSize: Joi.number().integer().min(1).max(100).required().default(10),
    sortBy: Joi.string().valid('auctionOid', 'userId', 'bidAmount').optional().default('userId'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

const querySearch = Joi.object({ 
    search: Joi.string().valid('search').optional().default('123')
});

// Body schemas
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, '').example('Bank Central Asia'),
  auctionOid:  Joi.string().required().example('123'),
});

const createDto = Joi.object({
    auctionOid:  Joi.string().required().example('123'),
    bidAmount: Joi.number().required().example(2500000), 
});

const updateDto = Joi.object({
    auctionOid:  Joi.string().required().example('123'),
    bidAmount: Joi.number().optional().example(3000000), 
});

// Complete DTOs
const filterBidDto = Joi.object({
    headers: authSchema,
    query,
    // body: filterDto
});

const filterBidQueryDto = Joi.object({
    headers: authSchema,
    querySearch,
});

const getBidDto = Joi.object({
    headers: authSchema,
    params
});

const deleteBidDto = Joi.object({
    headers: authSchema,
    params
});

const updateBidDto = Joi.object({
    headers: authSchema,
    params,
    body: updateDto
});

const createBidDto = Joi.object({
    headers: authSchema,
    body: createDto
});

// Schema data khusus BANK
const bidResponseDto = Joi.object({
    _id: Joi.string()
        .hex()
        .length(24)
        .required()
        .example('64b7f8c5a1d2f9b123456789'),
    auctionOid: Joi.string()
        .hex()
        .length(24)
        .required()
        .example('64b7f8c5a1d2f9b123456780'),
    userId: Joi.string()
        .hex()
        .length(24)
        .required()
        .example('64b7f8c5a1d2f9b123456781'),
    bidAmount: Joi.number()
        .required()
        .example(1500000),
    bidTime: Joi.date()
        .iso()
        .required()
        .example('2025-12-08T10:30:00.000Z'),
    createdBy: Joi.string()
        .required()
        .example('admin_user'),
    updatedAt: Joi.date()
        .iso()
        .required()
        .example('2025-12-08T10:45:00.000Z')
});

module.exports = {
    createBidDto,
    updateBidDto,
    deleteBidDto,
    filterBidDto,filterBidQueryDto,
    getBidDto,
    bidResponseDto,
    createDto, updateDto, filterDto, params
};
