const Joi = require('joi');
const { authSchema } = require('./base-dto');
 
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, ''),
    categoryName: Joi.string().optional().allow(null, ''),
});
 
const createDto = Joi.object({
    categoryName: Joi.string().required(),
});
 
const updateDto = Joi.object({
    categoryName: Joi.string().required(),
});

const params = Joi.object({
    oid: Joi.string().uuid().required()
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
    sortBy: Joi.string().valid('categoryName').optional().default('categoryName'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

const filterSubjectCategoryDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getSubjectCategoryDto = Joi.object({
    headers: authSchema,
    params: params,
});

const deleteSubjectCategoryDto = Joi.object({
    headers: authSchema,
    params: params,
});

const updateSubjectCategoryDto = Joi.object({
    headers: authSchema,
    params: params,
    body: updateDto
});

const createSubjectCategoryDto = Joi.object({
    headers: authSchema,
    body: createDto
});

module.exports = {
    createSubjectCategoryDto,
    updateSubjectCategoryDto,
    deleteSubjectCategoryDto,
    filterSubjectCategoryDto,
    getSubjectCategoryDto,
};
