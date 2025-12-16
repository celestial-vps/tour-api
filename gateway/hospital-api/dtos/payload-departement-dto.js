const Joi = require('joi');
const { authSchema } = require('./base-dto');
const { search } = require('../app');

const params = Joi.object({
    oid: Joi.string().uuid().required().example('dept-uuid-123')
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required().default(1),
    pageSize: Joi.number().integer().min(1).max(100).required().default(10),
    sortBy: Joi.string().valid('name').optional().default('name'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

const querySearch = Joi.object({ 
    sortBy: Joi.string().valid('name').optional().default('name'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});


const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, '').example('Cardiology')
});

const createDto = Joi.object({
    name: Joi.string().required().example('Cardiology'),
});

const updateDto = Joi.object({
    name: Joi.string().required().example('Cardiology')
});

const filterDepartementQueryDto = Joi.object({
    headers: authSchema,
    querySearch,
});

const filterDepartementDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getDepartementDto = Joi.object({
    headers: authSchema,
    params
});

const deleteDepartementDto = Joi.object({
    headers: authSchema,
    params
});

const updateDepartementDto = Joi.object({
    headers: authSchema,
    params,
    body: updateDto
}); 
const createDepartementDto = Joi.object({
    headers: authSchema,
    body: createDto
});

 
const departementResponseDto = Joi.object({
    oid: Joi.string().required(),
    departementOid: Joi.string().required().allow(null).example('678e4567-e89b-12d3-a456-426614174abc'),
    name: Joi.string().optional().allow(null, '').example('Cardiology'),
    createdBy: Joi.string().required(),
    updatedAt: Joi.date().iso().required(),
});


module.exports = {
    createDepartementDto, 
    updateDepartementDto,
    deleteDepartementDto,
    filterDepartementDto,filterDepartementQueryDto,
    getDepartementDto,
    departementResponseDto,
    createDto, updateDto, filterDto, params
};
