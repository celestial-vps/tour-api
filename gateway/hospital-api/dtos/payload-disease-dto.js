const Joi = require('joi');
const { authSchema } = require('./base-dto');

const params = Joi.object({
    oid: Joi.string().uuid().required().example('disease-uuid-123')
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('name').default('name'),
    sortOrder: Joi.string().valid('asc','desc').insensitive().default('asc')
});

const filterDto = Joi.object({
    name: Joi.string().optional().allow(null,'').example('Diabetes')
});

const createDto = Joi.object({
    name: Joi.string().required().example('Diabetes'),
    description: Joi.string().optional().example('Chronic disease affecting blood sugar')
});

const updateDto = Joi.object({
    name: Joi.string().example('Diabetes Type 2'),
    description: Joi.string().example('Updated description')
});

const filterDiseaseDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getDiseaseDto = Joi.object({
    headers: authSchema,
    params
});

const deleteDiseaseDto = Joi.object({
    headers: authSchema,
    params
});

const updateDiseaseDto = Joi.object({
    headers: authSchema,
    params,
    body: updateDto
});

const createDiseaseDto = Joi.object({
    headers: authSchema,
    body: createDto
});

module.exports = {
    createDiseaseDto,
    updateDiseaseDto,
    deleteDiseaseDto,
    filterDiseaseDto,
    getDiseaseDto
};
