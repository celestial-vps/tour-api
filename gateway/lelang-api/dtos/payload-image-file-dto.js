const Joi = require('joi');

// Validation schema for FilterImageFileDto
const filterImageFileDto = Joi.object({
  fileName: Joi.string().optional().allow(null, ''),
  fileUrl: Joi.string().optional().allow(null, ''),
});

// Validation schema for PageImageFileDto
const pageImageFileDto = Joi.object({
  oid: Joi.string().optional(),
  fileName: Joi.string().optional().allow(null, ''),
  fileUrl: Joi.string().optional().allow(null, ''),
});

// Validation schema for CreateImageFileDto
const createImageFileDto = Joi.object({
  fileName: Joi.string().required(),
  fileUrl: Joi.string().required(),
  filePath: Joi.string().required(),
  fileMime: Joi.string().required(),
  userInserted: Joi.string().required(),
  description: Joi.string().allow('', null).optional()
});

// Validation schema for UpdateImageFileDto
const updateImageFileDto = Joi.object({
  oid: Joi.string().required(),
  fileName: Joi.string().required(),
  fileUrl: Joi.string().required(),
  filePath: Joi.string().required(),
  fileMime: Joi.string().required(),
  description: Joi.string().allow('', null).optional(),
  lastUserId: Joi.string().required()
});

const params = Joi.object({
  oid: Joi.string().uuid().required()
});

const query = Joi.object({
  pageIndex: Joi.number().integer().min(1).required(),
  pageSize: Joi.number().integer().min(1).max(100).required(),
});

module.exports = {
  filterImageFileDto,
  pageImageFileDto,
  createImageFileDto,
  updateImageFileDto,
  query
};