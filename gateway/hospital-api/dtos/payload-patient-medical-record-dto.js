const Joi = require('joi');
const { authSchema } = require('./base-dto');

// ----------------------------------------------------
// PARAMS
// ----------------------------------------------------
const params = Joi.object({
    oid: Joi.string().uuid().required().example('pmr-uuid-123')
});

// ----------------------------------------------------
// QUERY (Pagination + Sorting)
// ----------------------------------------------------
const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).default(1).example(1),
    pageSize: Joi.number().integer().min(1).max(100).default(10).example(10),
    sortBy: Joi.string()
        .valid('recordDate', 'patientOid', 'doctorOid')
        .default('recordDate')
        .example('recordDate'),
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
    patientOid: Joi.string().uuid().optional().example('patient-uuid-123'),
    doctorOid: Joi.string().uuid().optional().example('doctor-uuid-123'),
    diagnosis: Joi.string().optional().example('Flu'),
    search: Joi.string().optional().example('fever')
});

// ----------------------------------------------------
// CREATE DTO
// ----------------------------------------------------
const createDto = Joi.object({
    patientOid: Joi.string().uuid().required().example('patient-uuid-123'),
    doctorOid: Joi.string().uuid().optional().example('doctor-uuid-123'),
    diagnosis: Joi.string().required().example('Typhoid Fever'),
    notes: Joi.string().optional().allow(null).example('Patient needs rest'),
    recordDate: Joi.date().required().example('2025-12-06T08:00:00Z')
});

// ----------------------------------------------------
// UPDATE DTO
// ----------------------------------------------------
const updateDto = Joi.object({
    doctorOid: Joi.string().uuid().optional().example('doctor-uuid-456'),
    diagnosis: Joi.string().optional().example('Recovered from Typhoid'),
    notes: Joi.string().optional().allow(null).example('Follow-up schedule recommended'),
    recordDate: Joi.date().optional().example('2025-12-07T10:00:00Z')
});

// ----------------------------------------------------
// WRAPPER DTOs (headers + body/query/params)
// ----------------------------------------------------

// For GET all + POST /q
const filterPatientMedicalRecordDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

// For GET by ID
const getPatientMedicalRecordDto = Joi.object({
    headers: authSchema,
    params
});

// For DELETE
const deletePatientMedicalRecordDto = Joi.object({
    headers: authSchema,
    params
});

// For PUT update
const updatePatientMedicalRecordDto = Joi.object({
    headers: authSchema,
    params,
    body: updateDto
});

// For POST create
const createPatientMedicalRecordDto = Joi.object({
    headers: authSchema,
    body: createDto
});

// Schema data khusus BANK
const patientMedicalRecordResponseDto = Joi.object({
    oid: Joi.string().required(),
    doctorOid: Joi.string().uuid().optional().example('doctor-uuid-456'),
    diagnosis: Joi.string().optional().example('Recovered from Typhoid'),
    notes: Joi.string().optional().allow(null).example('Follow-up schedule recommended'),
    recordDate: Joi.date().optional().example('2025-12-07T10:00:00Z'),
    createdBy: Joi.string().required(),
    updatedAt: Joi.date().iso().required(),
});

module.exports = {
    createPatientMedicalRecordDto,
    updatePatientMedicalRecordDto,
    deletePatientMedicalRecordDto,
    filterPatientMedicalRecordDto,
    getPatientMedicalRecordDto,
    patientMedicalRecordResponseDto,
    createDto, updateDto, filterDto, params
};
