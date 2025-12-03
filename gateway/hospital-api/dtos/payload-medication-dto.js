const Joi = require('joi');
const { authSchema } = require('./base-dto');

const params = Joi.object({
    oid: Joi.string().uuid().required().example('medication-uuid-123')
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('name','stock','price').default('name'),
    sortOrder: Joi.string().valid('asc','desc').insensitive().default('asc')
});

const filterDto = Joi.object({
    name: Joi.string().optional().allow(null,'').example('Paracetamol'),
    categoryOid: Joi.string().uuid().optional().example('category-uuid-123')
});

const createDto = Joi.object({
    name: Joi.string().required().example('Paracetamol'),
    categoryOid: Joi.string().uuid().optional().example('category-uuid-123'),
    description: Joi.string().optional().example('Pain reliever'),
    stock: Joi.number().integer().default(0).example(100),
    price: Joi.number().precision(2).default(0).example(5000)
});

const updateDto = Joi.object({
    name: Joi.string().example('Paracetamol Extra'),
    categoryOid: Joi.string().uuid().example('category-uuid-456'),
    description: Joi.string().example('Pain reliever updated'),
    stock: Joi.number().integer().example(200),
    price: Joi.number().precision(2).example(5500)
});

const filterMedicationDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getMedicationDto = Joi.object({
    headers: authSchema,
    params
});

const deleteMedicationDto = Joi.object({
    headers: authSchema,
    params
});

const updateMedicationDto = Joi.object({
    headers: authSchema,
    params,
    body: updateDto
});

const createMedicationDto = Joi.object({
    headers: authSchema,
    body: createDto
});

module.exports = {
    createMedicationDto,
    updateMedicationDto,
    deleteMedicationDto,
    filterMedicationDto,
    getMedicationDto
};
