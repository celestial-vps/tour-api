const Joi = require('joi');

/**
 * Returns Express middleware to validate request using a Joi schema.
 * @param {Joi.ObjectSchema} schema - Joi schema with optional keys: body, query, params, headers
 */
function validateRequest(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate({
            body: req.body,
            query: req.query,
            params: req.params,
            headers: req.headers,
        }, {
            abortEarly: false,
            allowUnknown: false, // prevent unknown keys
            stripUnknown: true   // remove unknown keys
        });

        if (error) {
            return res.status(400).json({
                message: 'Validation error',
                details: error.details.map(d => d.message),
            });
        }

        // Override validated values (optional: helpful if validation mutates them)
        req.body = value.body || {};
        req.query = value.query || {};
        req.params = value.params || {};
        req.headers = value.headers || {};

        // Optional: also assign to validated (for consistency if needed)
        req.validated = value;

        next();
    };
}

module.exports = {
    validateRequest
};
