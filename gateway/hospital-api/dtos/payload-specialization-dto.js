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
    name: Joi.string().optional().allow(null,'').example('Cardiology')
});

const createDto = Joi.object({
    name: Joi.string().required().example('Cardiology'),
    description: Joi.string().optional().example('Heart specialist')
});

const updateDto = Joi.object({
    name: Joi.string().example('Neurology'),
    description: Joi.string().example('Brain specialist')
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

module.exports = {
    createSpecializationDto,
    updateSpecializationDto,
    deleteSpecializationDto,
    filterSpecializationDto,
    getSpecializationDto
};
