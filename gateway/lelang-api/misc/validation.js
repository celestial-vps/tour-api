const Joi = require('joi');

/**
 * Function to validate request parameters, body, and query parameters.
 * @param {Joi.Schema} paramsSchema - Joi schema for route parameters.
 * @param {Joi.Schema} bodySchema - Joi schema for request body.
 * @param {Joi.Schema} querySchema - Joi schema for query parameters.
 * @param {Object} req - The request object.
 * @param {Joi.Schema} tokenSchema - Joi schema for token validation.
 * @returns {Object} - Returns an object with isValid and message properties.
 */
const validateRequest = (paramsSchema, bodySchema, querySchema, req, tokenSchema) => {
    let message = '';

    // Validate route parameters
    if (paramsSchema) {
        const { error: paramError } = paramsSchema.validate(req.params, { abortEarly: false });
        if (paramError) {
            message += `Parameter validation error: ${paramError.details.map(detail => detail.message).join(', ')}. `;
        }
    }

    // Validate request body
    if (bodySchema) {
        const { error: bodyError } = bodySchema.validate(req.body, { abortEarly: false });
        if (bodyError) {
            message += `Body validation error: ${bodyError.details.map(detail => detail.message).join(', ')}. `;
        }
    }

    // Validate query parameters
    if (querySchema) {
        const { error: queryError } = querySchema.validate(req.query, { abortEarly: false });
        if (queryError) {
            message += `Query validation error: ${queryError.details.map(detail => detail.message).join(', ')}. `;
        }
    }

    // Validate Bearer token
    if (tokenSchema) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            message += 'Authorization header missing. ';
        } 
        // Uncomment to validate token if needed
        // else {
        //     const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
        //     const { error: tokenError } = tokenSchema.validate(token);
        //     if (tokenError) {
        //         message += `Bearer token validation error: ${tokenError.details.map(detail => detail.message).join(', ')}. `;
        //     }
        // }
    }

    return { isValid: !message, message: message.trim() };
};

module.exports = validateRequest;