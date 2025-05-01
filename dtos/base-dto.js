const Joi = require('joi');

// Authentication header schema
const authSchema = Joi.object({
    authorization: Joi.string()
        .pattern(/^Bearer [A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)
        .required()
        .messages({
            'string.pattern.base': 'Authorization header must be a valid Bearer token',
            'any.required': 'Authorization header is required'
        })
}).unknown(true); // Allow other headers

module.exports = {
    authSchema,
};