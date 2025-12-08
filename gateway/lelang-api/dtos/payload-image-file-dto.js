const Joi = require('joi');

// ---------------- Payload DTO ----------------

// Filter / query image files
const filterImageFileDto = Joi.object({
  fileName: Joi.string().optional().allow(null, ''),
  fileUrl: Joi.string().optional().allow(null, ''),
});

// Pagination DTO
const pageImageFileDto = Joi.object({
  oid: Joi.string().optional(),
  fileName: Joi.string().optional().allow(null, ''),
  fileUrl: Joi.string().optional().allow(null, ''),
});

// Create image file DTO
const createImageFileDto = Joi.object({
  fileName: Joi.string().required(),
  fileUrl: Joi.string().required(),
  filePath: Joi.string().required(),
  fileMime: Joi.string().required(),
  userInserted: Joi.string().required(),
  description: Joi.string().allow('', null).optional(),
});

// Update image file DTO
const updateImageFileDto = Joi.object({
  oid: Joi.string().required(),
  fileName: Joi.string().required(),
  fileUrl: Joi.string().required(),
  filePath: Joi.string().required(),
  fileMime: Joi.string().required(),
  description: Joi.string().allow('', null).optional(),
  lastUserId: Joi.string().required(),
});

// Params (for delete / get by id)
const params = Joi.object({
  oid: Joi.string().uuid().required(),
});

// Query pagination params
const query = Joi.object({
  pageIndex: Joi.number().integer().min(1).required(),
  pageSize: Joi.number().integer().min(1).max(100).required(),
});

// Response DTO
const imageFileResponseDto = Joi.object({
  oid: Joi.string().uuid().required(),
  fileName: Joi.string().required(),
  fileUrl: Joi.string().required(),
  filePath: Joi.string().required(),
  fileMime: Joi.string().required(),
  description: Joi.string().allow('', null).optional(),
  createdAt: Joi.date().iso().required(),
  updatedAt: Joi.date().iso().required(),
  userInserted: Joi.string().required(),
  lastUserId: Joi.string().optional()
});

module.exports = {
  filterImageFileDto,
  pageImageFileDto,
  createImageFileDto,
  updateImageFileDto,
  params,
  query,
  imageFileResponseDto
};
