const Joi = require('joi');
const { authSchema } = require('./base-dto');

// Params
const params = Joi.object({
    oid: Joi.string().uuid().required().example('123e4567-e89b-12d3-a456-426614174000')
});

// Query for pagination
const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).required().default(1),
    pageSize: Joi.number().integer().min(1).max(100).required().default(10),
    sortBy: Joi.string().valid('name', 'category', 'stock', 'price').optional().default('name'),
    sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc')
});

// Body schemas
const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, '').example('Cardiology')
});

const createDto = Joi.object({
    name: Joi.string().required().example('Paracetamol'),
    categoryOid: Joi.string().optional().example('123e4567-e89b-12d3-a456-426614174000'), 
    stock: Joi.number().integer().min(0).optional().default(0),
    price: Joi.number().precision(2).min(0).optional().default(0),
    createdBy: Joi.string().uuid().optional()
});

const updateDto = Joi.object({
    name: Joi.string().required().example('Paracetamol'),
    categoryOid: Joi.string().optional().example('123e4567-e89b-12d3-a456-426614174000'),
    description: Joi.string().optional().example('Used to reduce fever and pain'),
    stock: Joi.number().integer().min(0).optional(),
    price: Joi.number().precision(2).min(0).optional(),
    lastModifiedBy: Joi.string().uuid().optional()
});

// Complete DTOs
const filterMedicineDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getMedicineDto = Joi.object({
    headers: authSchema,
    params
});

const deleteMedicineDto = Joi.object({
    headers: authSchema,
    params
});

const updateMedicineDto = Joi.object({
    headers: authSchema,
    params,
    body: updateDto
});

const createMedicineDto = Joi.object({
    headers: authSchema,
    body: createDto
});

// Response DTO matching table
const medicineResponseDto = Joi.object({
    oid: Joi.string().required(),
   name: Joi.string().required().example('Paracetamol'),
    category: Joi.string().optional().example('Painkiller'),
    description: Joi.string().optional().example('Used to reduce fever and pain'),
    stock: Joi.number().integer().min(0).optional().default(0),
    price: Joi.number().precision(2).min(0).optional().default(0),
    createdBy: Joi.string().required(),
    updatedAt: Joi.date().iso().required(),
});

module.exports = {
    createMedicineDto,
    updateMedicineDto,
    deleteMedicineDto,
    filterMedicineDto,
    getMedicineDto,
    medicineResponseDto,
    createDto,
    updateDto,
    filterDto,
    params
};
