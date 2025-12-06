const Joi = require('joi');
const { authSchema } = require('./base-dto');

// --------------------
// Params
// --------------------
const params = Joi.object({
    oid: Joi.string().uuid().required().example("123e4567-e89b-12d3-a456-426614174000")
});

// --------------------
// Query for pagination
// --------------------
const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required().default(1),
    pageSize: Joi.number().integer().min(1).max(100).required().default(10),
    sortBy: Joi.string()
        .valid("fullName", "ktpNumber", "createdAt")
        .optional()
        .default("fullName"),
    sortOrder: Joi.string().valid("asc", "desc").insensitive().default("asc")
});

// --------------------
// Body Schemas
// --------------------
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, '').example("Budi"),
    ktpNumber: Joi.string().optional().allow(null, '').example("3275010101010001"),
    phone: Joi.string().optional().allow(null, '').example("08123456789"),
    fullName: Joi.string().optional().allow(null, '').example("Budi Santoso")
});

const createDto = Joi.object({
    userId: Joi.string().required().example("USR-123456"),
    fullName: Joi.string().max(100).required().example("Budi Santoso"),
    ktpNumber: Joi.string().max(50).required().example("3275010101010001"),
    address: Joi.string().optional().allow(null, "").example("Jl. Merdeka No. 10"),
    phone: Joi.string().max(20).optional().allow(null, "").example("08123456789"),
    birthDate: Joi.date().optional().allow(null).example("1990-01-01"),
});

const updateDto = Joi.object({
    fullName: Joi.string().max(100).optional().example("Budi Santoso Updated"),
    ktpNumber: Joi.string().max(50).optional().example("3275010101010001"),
    address: Joi.string().optional().allow(null, "").example("Jl. Sudirman No. 5"),
    phone: Joi.string().max(20).optional().allow(null, "").example("08129876543"),
    birthDate: Joi.date().optional().allow(null).example("1991-05-10")
});

// --------------------
// Complete DTOs
// --------------------
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

// --------------------
// Export
// --------------------
module.exports = {
    createBidderDto,
    updateBidderDto,
    deleteBidderDto,
    filterBidderDto,
    getBidderDto,
};
