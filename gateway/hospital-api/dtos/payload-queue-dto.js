const Joi = require('joi');
const { authSchema } = require('./base-dto'); // pastikan base-dto.js ada dan export authSchema

// --------------------
// Params DTO
// --------------------
const params = Joi.object({
  oid: Joi.string().uuid({ version: 'uuidv4' }).required().example('queue-uuid-123')
});

// --------------------
// Query DTO untuk pagination / filtering
// --------------------
const query = Joi.object({
  pageIndex: Joi.number().integer().min(1).default(1).example(1),
  pageSize: Joi.number().integer().min(1).max(100).default(10).example(10),
  sortBy: Joi.string().valid('queueDate', 'status').default('queueDate').example('queueDate'),
  sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc').example('asc')
});

// --------------------
// Filter DTO
// --------------------
const filterDto = Joi.object({
  patientOid: Joi.string().uuid({ version: 'uuidv4' }).optional().example('patient-uuid-123'),
  doctorOid: Joi.string().uuid({ version: 'uuidv4' }).optional().example('doctor-uuid-123'),
  status: Joi.string().valid('Scheduled', 'Completed', 'Cancelled').optional().example('Scheduled')
});

// --------------------
// Create DTO
// --------------------
const createDto = Joi.object({
  patientOid: Joi.string().uuid({ version: 'uuidv4' }).required().example('patient-uuid-123'),
  doctorOid: Joi.string().uuid({ version: 'uuidv4' }).required().example('doctor-uuid-123'),
  departmentOid: Joi.string().uuid({ version: 'uuidv4' }).optional().example('dept-uuid-123'),
  queueDate: Joi.date().iso().required().example('2025-12-05T09:00:00Z'),
  status: Joi.string().valid('Scheduled', 'Completed', 'Cancelled').default('Scheduled')
});

// --------------------
// Update DTO
// --------------------
const updateDto = Joi.object({
  doctorOid: Joi.string().uuid({ version: 'uuidv4' }).optional().example('doctor-uuid-456'),
  departmentOid: Joi.string().uuid({ version: 'uuidv4' }).optional().example('dept-uuid-456'),
  queueDate: Joi.date().iso().optional().example('2025-12-06T10:00:00Z'),
  status: Joi.string().valid('Scheduled', 'Completed', 'Cancelled').optional().example('Completed')
});

// --------------------
// Full DTOs for middleware
// --------------------
const filterQueueDto = Joi.object({
  headers: authSchema,
  query,
  body: filterDto
});

const getQueueDto = Joi.object({
  headers: authSchema,
  params
});

const deleteQueueDto = Joi.object({
  headers: authSchema,
  params
});

const updateQueueDto = Joi.object({
  headers: authSchema,
  params,
  body: updateDto
});

const createQueueDto = Joi.object({
  headers: authSchema,
  body: createDto
});

const queueResponseDto = Joi.object({
  oid: Joi.string().required(),
  doctorOid: Joi.string().uuid({ version: 'uuidv4' }).optional().example('doctor-uuid-456'),
  departmentOid: Joi.string().uuid({ version: 'uuidv4' }).optional().example('dept-uuid-456'),
  queueDate: Joi.date().iso().optional().example('2025-12-06T10:00:00Z'),
  status: Joi.string().valid('Scheduled', 'Completed', 'Cancelled').optional().example('Completed'),
  createdBy: Joi.string().required(),
  updatedAt: Joi.date().iso().required(),
});

// --------------------
// Export semua DTO
// --------------------
module.exports = {
  createQueueDto,
  updateQueueDto,
  deleteQueueDto,
  filterQueueDto,
  getQueueDto,
  queueResponseDto,
  createDto, updateDto, filterDto, params
};
