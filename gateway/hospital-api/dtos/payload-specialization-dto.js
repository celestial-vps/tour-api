const Joi = require('joi');
const { authSchema } = require('./base-dto');

const params = Joi.object({
    oid: Joi.string().uuid().required().example('specialization-uuid-123')
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(10)
});

const filterDto = Joi.object({
    name: Joi.string().optional().allow(null, '').example('Cardiology')
});

const createDto = Joi.object({
    name: Joi.string().required().example('Cardiology'),
});

const updateDto = Joi.object({
    name: Joi.string().example('Neurology'),
});

const filterSpecializationDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getSpecializationDto = Joi.object({
    headers: authSchema,
    params
});

const deleteSpecializationDto = Joi.object({
    headers: authSchema,
    params
});

const updateSpecializationDto = Joi.object({
    headers: authSchema,
    params,
    body: updateDto
});

const createSpecializationDto = Joi.object({
    headers: authSchema,
    body: createDto
});

const specializationResponseDto = Joi.object({
    oid: Joi.string().required(),
    name: Joi.string().required().example('Cardiology'),
    createdBy: Joi.string().required(),
    updatedAt: Joi.date().iso().required(),
});


module.exports = {
    createSpecializationDto,
    updateSpecializationDto,
    deleteSpecializationDto,
    filterSpecializationDto,
    getSpecializationDto,
    specializationResponseDto,
    createDto, updateDto, filterDto, params
};
