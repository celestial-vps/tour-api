const Joi = require('joi');
const { authSchema } = require('./base-dto');
 
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, ''),
    levelName: Joi.string().optional().allow(null, ''),
    type: Joi.string().optional().allow(null, ''),
});
 
const createDto = Joi.object({
    levelName: Joi.string().required(),
    type: Joi.string().required(),
});
 
const updateDto = Joi.object({
    levelName: Joi.string().required(),
    type: Joi.string().required(),
});

const params = Joi.object({
    oid: Joi.string().uuid().required()
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).required(),
    sortBy: Joi.string().valid('levelName', 'type').optional().default('type'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

const filterLearningLevelDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getLearningLevelDto = Joi.object({
    headers: authSchema,
    params: params,
});

const deleteLearningLevelDto = Joi.object({
    headers: authSchema,
    params: params,
});

const updateLearningLevelDto = Joi.object({
    headers: authSchema,
    params: params,
    body: updateDto
});

const createLearningLevelDto = Joi.object({
    headers: authSchema,
    body: createDto
});

module.exports = {
    createLearningLevelDto,
    updateLearningLevelDto,
    deleteLearningLevelDto,
    filterLearningLevelDto,
    getLearningLevelDto,
};
