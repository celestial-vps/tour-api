const Joi = require('joi');
const { authSchema } = require('./base-dto');

// --------------------
// Params
// --------------------
// Params
const params = Joi.object({
    oid: Joi.string().uuid().required().example('123e4567-e89b-12d3-a456-426614174000')
});

// --------------------
// Query for pagination
// --------------------
const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required().default(1),
    pageSize: Joi.number().integer().min(1).max(100).required().default(10),
    sortBy: Joi.string()
        .valid('startTime', 'endTime', 'status')
        .optional()
        .default('startTime'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

// --------------------
// Body Schemas
// --------------------
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, '').example('auction 01'),
    status: Joi.string()
        .valid('pending', 'active', 'ended', 'cancelled')
        .optional()
        .allow(null, ''),
    itemOid: Joi.string().optional().allow(null, '').example('678e4567-e89b-12d3-a456-426614174abc')
});

const createDto = Joi.object({
    itemOid: Joi.string().optional().allow(null).example('678e4567-e89b-12d3-a456-426614174abc'),
    startTime: Joi.date().required().example('2025-01-10T10:00:00Z'),
    endTime: Joi.date().required().example('2025-01-11T10:00:00Z'),
    status: Joi.string()
        .valid('pending', 'active', 'ended', 'cancelled')
        .optional()
        .default('pending')
});

const updateDto = Joi.object({
    itemOid: Joi.string().optional().allow(null).example('678e4567-e89b-12d3-a456-426614174abc'),
    startTime: Joi.date().optional().example('2025-01-10T10:00:00Z'),
    endTime: Joi.date().optional().example('2025-01-11T10:00:00Z'),
    status: Joi.string()
        .valid('pending', 'active', 'ended', 'cancelled')
        .optional()
});

// --------------------
// Complete DTOs
// --------------------
const filterAuctionDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getAuctionDto = Joi.object({
    headers: authSchema,
    params
});

const deleteAuctionDto = Joi.object({
    headers: authSchema,
    params
});

const updateAuctionDto = Joi.object({
    headers: authSchema,
    params,
    body: updateDto
});

const createAuctionDto = Joi.object({
    headers: authSchema,
    body: createDto
});

const auctionResponseDto = Joi.object({
    oid: Joi.string().required(),
    itemOid: Joi.string().optional().allow(null).example('678e4567-e89b-12d3-a456-426614174abc'),
    startTime: Joi.date().required().example('2025-01-10T10:00:00Z'),
    endTime: Joi.date().required().example('2025-01-11T10:00:00Z'),
    status: Joi.string().example('active'),
    createdBy: Joi.string().required(),
    updatedAt: Joi.date().iso().required(),
});

// --------------------
// Export
// --------------------
module.exports = {
    createAuctionDto,
    updateAuctionDto,
    deleteAuctionDto,
    filterAuctionDto,
    getAuctionDto,
    auctionResponseDto,
    createDto,updateDto, filterDto, params
};
