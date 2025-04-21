const Joi = require('joi');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  Object.assign(req, value);
  return next();
};

module.exports = validate;
//=================
const httpStatus = require('http-status');
const validateRequest = require('./validateRequest');
const ApiError = require('../utils/ApiError'); // Or wherever your custom error class is

const validate = (schemas) => (req, res, next) => {
  const { isValid, message } = validateRequest(schemas, req);
  if (!isValid) {
    return next(new ApiError(httpStatus.BAD_REQUEST, message));
  }
  next();
};

module.exports = validate;
