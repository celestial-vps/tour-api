const Joi = require("joi");

/**
 * Schema Generic Success Response
 * dataSchema wajib diberikan supaya swagger tidak menjadi "string"
 */
const successResponse = (dataSchema) =>
  Joi.object({
    code: Joi.number().valid(200).required(),
    status: Joi.number().valid(200).required(),
    message: Joi.string().default("Success"),
    total: Joi.number().optional(),
    data: dataSchema.required(),
  });

/**
 * Error Response 400/500
 */
const errorResponse = Joi.object({
  code: Joi.number().valid(400, 500).required(),
  status: Joi.number().valid(400, 500).required(),
  message: Joi.string().required(),
  data: Joi.array().items(Joi.string()).optional(),
});

module.exports = {
  successResponse,
  errorResponse,
};
