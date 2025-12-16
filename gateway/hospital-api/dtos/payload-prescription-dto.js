const Joi = require('joi');
const { authSchema } = require('./base-dto');

const params = Joi.object({
    oid: Joi.string().uuid().required().example('prescription-uuid-123')
});

const query = Joi.object({
    pageIndex: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(10)
});

const filterDto = Joi.object({
    search: Joi.string().optional().allow(null, '').example('Cardiology')
});

const createDto = Joi.object({
    medicalRecordOid: Joi.string().uuid().required().example('medicalrecord-uuid-123'),
    medicineOid: Joi.string().uuid().optional().example('medication-uuid-123'),
    dosage: Joi.string().optional().example('500mg'),
    frequency: Joi.string().optional().example('Twice a day'),
    duration: Joi.string().optional().example('5 days'),
    notes: Joi.string().optional().example('Take after meal')
});

const updateDto = Joi.object({
    medicineOid: Joi.string().uuid().example('medication-uuid-456'),
    dosage: Joi.string().example('750mg'),
    frequency: Joi.string().example('Three times a day'),
    duration: Joi.string().example('7 days'),
    notes: Joi.string().example('Take before meal')
});

const filterPrescriptionDto = Joi.object({
    headers: authSchema,
    query,
    body: filterDto
});

const getPrescriptionDto = Joi.object({
    headers: authSchema,
    params
});

const deletePrescriptionDto = Joi.object({
    headers: authSchema,
    params
});

const updatePrescriptionDto = Joi.object({
    headers: authSchema,
    params,
    body: updateDto
});

const createPrescriptionDto = Joi.object({
    headers: authSchema,
    body: createDto
});

// Schema data khusus BANK
const prescriptionResponseDto = Joi.object({
    oid: Joi.string().required(),
    medicalRecordOid: Joi.string().uuid().optional().example('medicalrecord-uuid-123'),
    medicineOid: Joi.string().uuid().optional().example('medication-uuid-123'),
    createdBy: Joi.string().required(),
    updatedAt: Joi.date().iso().required(),
});

module.exports = {
    createPrescriptionDto,
    updatePrescriptionDto,
    deletePrescriptionDto,
    filterPrescriptionDto,
    getPrescriptionDto,
    prescriptionResponseDto,
    createDto, updateDto, filterDto, params
};
