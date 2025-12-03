const Joi = require('joi');
const { authSchema } = require('./base-dto');

const params = Joi.object({
    oid: Joi.string().uuid().required().example('medicalrecord-uuid-123')
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(10)
});

const filterDto = Joi.object({
    patientOid: Joi.string().uuid().optional().example('patient-uuid-123'),
    doctorOid: Joi.string().uuid().optional().example('doctor-uuid-123'),
    diseaseOid: Joi.string().uuid().optional().example('disease-uuid-123'),
    treatmentOid: Joi.string().uuid().optional().example('treatment-uuid-123')
});

const createDto = Joi.object({
    patientOid: Joi.string().uuid().required().example('patient-uuid-123'),
    doctorOid: Joi.string().uuid().optional().example('doctor-uuid-123'),
    diseaseOid: Joi.string().uuid().optional().example('disease-uuid-123'),
    treatmentOid: Joi.string().uuid().optional().example('treatment-uuid-123'),
    recordDate: Joi.date().default(() => new Date(), 'current date'),
    notes: Joi.string().optional().example('Patient shows improvement')
});

const updateDto = Joi.object({
    doctorOid: Joi.string().uuid().example('doctor-uuid-456'),
    diseaseOid: Joi.string().uuid().example('disease-uuid-456'),
    treatmentOid: Joi.string().uuid().example('treatment-uuid-456'),
    recordDate: Joi.date().example('2025-12-05T09:00:00Z'),
    notes: Joi.string().example('Updated notes')
});

const filterMedicalRecordDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getMedicalRecordDto = Joi.object({
    headers: authSchema,
    params
});

const deleteMedicalRecordDto = Joi.object({
    headers: authSchema,
    params
});

const updateMedicalRecordDto = Joi.object({
    headers: authSchema,
    params,
    body: updateDto
});

const createMedicalRecordDto = Joi.object({
    headers: authSchema,
    body: createDto
});

module.exports = {
    createMedicalRecordDto,
    updateMedicalRecordDto,
    deleteMedicalRecordDto,
    filterMedicalRecordDto,
    getMedicalRecordDto
};
