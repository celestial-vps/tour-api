const Joi = require('joi');
const { authSchema } = require('./base-dto');

// Params untuk path
const params = Joi.object({
    oid: Joi.string().uuid().required().example('medicationCategory-uuid-123')
});

// Query untuk pagination
const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('name', ).default('name'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

// Filter MedicationCategory DTO untuk pencarian/pagination
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, '').example('Cardiology')
});

// DTO untuk create MedicationCategory
const createDto = Joi.object({
    name: Joi.string().required().example('Diabetes'),
});

// DTO untuk update MedicationCategory
const updateDto = Joi.object({
   name: Joi.string().required().example('Diabetes'),
});

// Full DTOs untuk route validation
const filterMedicationCategoryDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getMedicationCategoryDto = Joi.object({
    headers: authSchema,
    params
});

const deleteMedicationCategoryDto = Joi.object({
    headers: authSchema,
    params
});

const updateMedicationCategoryDto = Joi.object({
    headers: authSchema,
    params,
    body: updateDto
});

const createMedicationCategoryDto = Joi.object({
    headers: authSchema,
    body: createDto
});

const medicationCategoryResponseDto = Joi.object({
    oid: Joi.string().required(),
    name: Joi.string().required().example('Diabetes'),
    createdBy: Joi.string().required(),
    updatedAt: Joi.date().iso().required(),
});

module.exports = {
    createMedicationCategoryDto,
    updateMedicationCategoryDto,
    deleteMedicationCategoryDto,
    filterMedicationCategoryDto,
    getMedicationCategoryDto,
    medicationCategoryResponseDto,
    createDto, updateDto, filterDto, params
};
