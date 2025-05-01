const Joi = require('joi');

/**
 * Returns Express middleware to validate request using a Joi schema.
 * @param {Joi.ObjectSchema} schema - Joi schema with optional keys: body, query, params, headers.
 * @returns {Function} - Express middleware
 */
function validateRequest(schema) {
    return (req, res, next) => {
        // Use keys from schema to build the object to validate
        const schemaKeys = Object.keys(schema.describe().keys);
        const dataToValidate = {};

        for (const key of schemaKeys) {
            if (req[key] !== undefined) {
                dataToValidate[key] = req[key];
            }
        }

        const { error, value } = schema.validate(dataToValidate, {
            allowUnknown: true,
            abortEarly: false
        });

        if (error) {
            return res.status(400).json({
                message: 'Validation error',
                details: error.details.map(detail => detail.message)
            });
        }

        // Attach validated values to req.validated
        req.validated = value;
        next();
    };
}

module.exports = {
    validateRequest
};
