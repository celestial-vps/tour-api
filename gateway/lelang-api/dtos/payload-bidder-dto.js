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
    sortBy: Joi.string().valid('userId', 'fullName', 'ktpNumber').optional().default('fullName'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

// Body schemas
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, '').example('BCA'),
    userId: Joi.string().optional().allow(null, '').example('BCA001'),
    fullName: Joi.string().optional().allow(null, '').example('Bidder Central Asia')
});

const createDto = Joi.object({
    userId: Joi.string().required().example('BCA001'),
    fullName: Joi.string().required().example('Bidder Central Asia'),
    ktpNumber: Joi.string().optional().example('BCA'),
    address: Joi.string().optional().example('BCA'),
    phone: Joi.string().optional().example('BCA'),
    birthDate: Joi.string().optional().example('Bidder description')
});

const updateDto = Joi.object({
    userId: Joi.string().required().example('BCA001'),
    fullName: Joi.string().required().example('Bidder Central Asia'),
    ktpNumber: Joi.string().optional().example('BCA'),
    address: Joi.string().optional().example('BCA'),
    phone: Joi.string().optional().example('BCA'),
    birthDate: Joi.string().optional().example('Bidder description')
});

// Complete DTOs
const filterBidderDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getBidderDto = Joi.object({
    headers: authSchema,
    params
});

const deleteBidderDto = Joi.object({
    headers: authSchema,
    params
});

const updateBidderDto = Joi.object({
    headers: authSchema,
    params,
    body: updateDto
});

const createBidderDto = Joi.object({
    headers: authSchema,
    body: createDto
});

// Schema data khusus BANK
const bidderResponseDto = Joi.object({
    oid: Joi.string().required(),
    userId: Joi.string().required().example('BCA001'),
    fullName: Joi.string().required().example('BCA'),
    ktpNumber: Joi.string().required().example('Bidder Central Asia'),
    address: Joi.string().optional().example('BCA'),
    phone: Joi.string().optional().example('BCA'),
    createdBy: Joi.string().required(),
    updatedAt: Joi.date().iso().required(),
});

module.exports = {
    createBidderDto,
    updateBidderDto,
    deleteBidderDto,
    filterBidderDto,
    getBidderDto,
    bidderResponseDto,
    createDto, updateDto, filterDto, params
};
