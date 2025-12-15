const Joi = require('joi');
const { authSchema } = require('./base-dto');

// Params untuk path
const params = Joi.object({
    oid: Joi.string().uuid().required().example('bed-uuid-123')
});

// Query untuk pagination
const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('bedNumber', 'room', 'status').default('bedNumber'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

// Filter Bed DTO untuk pencarian/pagination
const filterDto = Joi.object({
    roomOid: Joi.string().uuid().optional().example('room-uuid-123'),
    status: Joi.string().valid('Available', 'Occupied', 'Maintenance').optional().example('Available'),
    bedNumber: Joi.string().optional().example('B-101')
});

// DTO untuk create Bed
const createDto = Joi.object({
    roomOid: Joi.string().uuid().required().example('room-uuid-123'),
    bedNumber: Joi.string().required().example('B-101'),
    status: Joi.string().valid('Available', 'Occupied', 'Maintenance').default('Available'),
    description: Joi.string().optional().example('Near window')
});

// DTO untuk update Bed
const updateDto = Joi.object({
    roomOid: Joi.string().uuid().example('room-uuid-456'),
    bedNumber: Joi.string().example('B-102'),
    status: Joi.string().valid('Available', 'Occupied', 'Maintenance').example('Occupied'),
    description: Joi.string().example('Next to nurse station')
});

// Full DTOs untuk route validation
const filterBedDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getBedDto = Joi.object({
    headers: authSchema,
    params
});

const deleteBedDto = Joi.object({
    headers: authSchema,
    params
});

const updateBedDto = Joi.object({
    headers: authSchema,
    params,
    body: updateDto
});

const createBedDto = Joi.object({
    headers: authSchema,
    body: createDto
});

const bedResponseDto = Joi.object({
    oid: Joi.string().required(),
    roomOid: Joi.string().uuid().required().example('room-uuid-123'),
    bedNumber: Joi.string().required().example('B-101'),
    status: Joi.string().valid('Available', 'Occupied', 'Maintenance').default('Available'),
    description: Joi.string().optional().example('Near window'),
        createdBy: Joi.string().required(),
        updatedAt: Joi.date().iso().required(),
});

module.exports = {
    createBedDto,
    updateBedDto,
    deleteBedDto,
    filterBedDto,
    getBedDto,
    bedResponseDto,
    createDto, updateDto, filterDto, params
};
