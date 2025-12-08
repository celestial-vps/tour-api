const Joi = require('joi');
const { authSchema } = require('./base-dto');

const params = Joi.object({
    oid: Joi.string().uuid().required().example('dept-uuid-123')
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required().default(1),
    pageSize: Joi.number().integer().min(1).max(100).required().default(10),
    sortBy: Joi.string().valid('name').optional().default('name'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

const filterDto = Joi.object({
    name: Joi.string().optional().allow(null, '').example('Cardiology')
});

const createDto = Joi.object({
    name: Joi.string().required().example('Cardiology'),
});

const updateDto = Joi.object({
    name: Joi.string().required().example('Cardiology')
});

const filterDepartmentDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getDepartmentDto = Joi.object({
    headers: authSchema,
    params
});

const deleteDepartmentDto = Joi.object({
    headers: authSchema,
    params
});

const updateDepartmentDto = Joi.object({
    headers: authSchema,
    params,
    body: updateDto
});

const createDepartmentDto = Joi.object({
    headers: authSchema,
    body: createDto
});

 
const departementResponseDto = Joi.object({
    oid: Joi.string().required(),
    name: Joi.string().optional().allow(null, '').example('Cardiology'),
    createdBy: Joi.string().required(),
    updatedAt: Joi.date().iso().required(),
});


module.exports = {
    createDepartmentDto,
    updateDepartmentDto,
    deleteDepartmentDto,
    filterDepartmentDto,
    getDepartmentDto,
    departementResponseDto,
    createDto, updateDto, filterDto, params
};
