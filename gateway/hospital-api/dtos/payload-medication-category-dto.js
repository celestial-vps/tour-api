const Joi = require('joi');
const { authSchema } = require('./base-dto');

const params = Joi.object({
    oid: Joi.string().uuid().required().example('category-uuid-123')
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('name').default('name'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

const filterDto = Joi.object({
    name: Joi.string().optional().allow(null, '').example('Painkillers')
});

const createDto = Joi.object({
    name: Joi.string().required().example('Painkillers'),
});

const updateDto = Joi.object({
    name: Joi.string().example('Painkillers Updated'),
});

const filterCategoryDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getCategoryDto = Joi.object({
    headers: authSchema,
    params
});

const deleteCategoryDto = Joi.object({
    headers: authSchema,
    params
});

const updateCategoryDto = Joi.object({
    headers: authSchema,
    params,
    body: updateDto
});

const createCategoryDto = Joi.object({
    headers: authSchema,
    body: createDto
});

const medicationCategoryResponseDto = Joi.object({
    oid: Joi.string().required(),
    name: Joi.string().example('Painkillers Updated'),
    createdBy: Joi.string().required(),
    updatedAt: Joi.date().iso().required(),
});

module.exports = {
    createCategoryDto,
    updateCategoryDto,
    deleteCategoryDto,
    filterCategoryDto,
    getCategoryDto,
    medicationCategoryResponseDto,
    createDto, updateDto, filterDto, params
};
