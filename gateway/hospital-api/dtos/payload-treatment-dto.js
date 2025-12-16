const Joi = require('joi');
const { authSchema } = require('./base-dto');

// ----------------------------------------------------
// PARAMS
// ----------------------------------------------------
const params = Joi.object({
    oid: Joi.string().uuid().required().example('treatment-uuid-123')
});

// ----------------------------------------------------
// QUERY (Pagination + Sorting)
// ----------------------------------------------------
const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).default(1).example(1),
    pageSize: Joi.number().integer().min(1).max(100).default(10).example(10),
    sortBy: Joi.string()
        .valid('name')
        .default('name')
        .example('name'),
    sortOrder: Joi.string()
        .valid('asc', 'desc')
        .insensitive()
        .default('asc')
        .example('asc')
});

// ----------------------------------------------------
// FILTER DTO (body for POST /q)
// ----------------------------------------------------
const filterDto = Joi.object({
   search: Joi.string().optional().allow(null, '').example('Cardiology')
});

// ----------------------------------------------------
// CREATE DTO
// ----------------------------------------------------
const createDto = Joi.object({
    name: Joi.string().required().example('Physiotherapy'),  
    price: Joi.number().required().example(150000)
});

// ----------------------------------------------------
// UPDATE DTO
// ----------------------------------------------------
const updateDto = Joi.object({
    name: Joi.string().optional().example('Advanced Physiotherapy'),  
    price: Joi.number().optional().example(175000)
});

// ----------------------------------------------------
// WRAPPER DTOs (headers + body/query/params)
// ----------------------------------------------------

// For GET all + POST /q
const filterTreatmentDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

// For GET by ID
const getTreatmentDto = Joi.object({
    headers: authSchema,
    params
});

// For DELETE
const deleteTreatmentDto = Joi.object({
    headers: authSchema,
    params
});

// For PUT update
const updateTreatmentDto = Joi.object({
    headers: authSchema,
    params,
    body: updateDto
});

// For POST create
const createTreatmentDto = Joi.object({
    headers: authSchema,
    body: createDto
});

const treatmentResponseDto = Joi.object({
    oid: Joi.string().required(),
    name: Joi.string().required().example('Physiotherapy'),   
    price: Joi.number().required().example(150000),
    createdBy: Joi.string().required(),
    updatedAt: Joi.date().iso().required(),
});


module.exports = {
    createTreatmentDto,
    updateTreatmentDto,
    deleteTreatmentDto,
    filterTreatmentDto,
    getTreatmentDto,
    treatmentResponseDto,
    createDto, updateDto, filterDto, params
};
