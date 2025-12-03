const Joi = require('joi');
const { authSchema } = require('./base-dto');

const params = Joi.object({
    oid: Joi.string().uuid().required().example('labtest-uuid-123')
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(10)
});

const filterDto = Joi.object({
    name: Joi.string().optional().allow(null,'').example('Blood Test')
});

const createDto = Joi.object({
    name: Joi.string().required().example('Blood Test'),
    description: Joi.string().optional().example('Complete blood count'),
    cost: Joi.number().precision(2).default(0).example(50000)
});

const updateDto = Joi.object({
    name: Joi.string().example('Blood Test Updated'),
    description: Joi.string().example('Updated description'),
    cost: Joi.number().precision(2).example(55000)
});

const filterLabTestDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getLabTestDto = Joi.object({
    headers: authSchema,
    params
});

const deleteLabTestDto = Joi.object({
    headers: authSchema,
    params
});

const updateLabTestDto = Joi.object({
    headers: authSchema,
    params,
    body: updateDto
});

const createLabTestDto = Joi.object({
    headers: authSchema,
    body: createDto
});

module.exports = {
    createLabTestDto,
    updateLabTestDto,
    deleteLabTestDto,
    filterLabTestDto,
    getLabTestDto
};
