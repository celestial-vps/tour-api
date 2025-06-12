const auditTrailService = require('./audit-trail-midleware-service.js');
const Joi = require('joi');
const sendAuditLog = require('./kafka-producer');

const createDto = Joi.object({
  tableName: Joi.string().required(),
  recordOid: Joi.string().required(),
  action: Joi.string()
    .valid(
      'CREATE', 'UPDATE', 'DELETE', 'READ',
      'LOGIN', 'LOGOUT', 'APPROVE', 'REJECT',
      'IMPORT', 'EXPORT'
    )
    .required(),
  status: Joi.string()
    .valid('SUCCESS', 'FAILED', 'ERROR')
    .default('SUCCESS'),
  message: Joi.string().required(),
  previousData: Joi.object().optional(),
  newData: Joi.object().optional(),
  changedFields: Joi.array().items(Joi.string()).optional(),
  userOid: Joi.string()
    .guid({ version: ['uuidv4'] })
    .optional(),
  ipAddress: Joi.string()
    .ip({ version: ['ipv4', 'ipv6'], cidr: 'forbidden' })
    .optional(),
  userAgent: Joi.string().optional(),
});

async function recordAuditTrail(action, tableName, data, req, status = 'SUCCESS', message = '') {
  try {
    const auditPayload = {
      tableName,
      recordOid: data?.value ?? 'unknown',
      action,
      status,
      message: message || `${action} ${tableName} ${status.toLowerCase()}`,
      userOid: req.authorization_payload?.userOid,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      newData: status === 'SUCCESS' ? data : undefined,
    };
    await sendAuditLog(auditPayload);
    const { error, value } = createDto.validate(auditPayload);
    if (error) {
      console.warn('Audit trail validation failed:', error.message);
      return;
    }

    await auditTrailService.record(value);
  } catch (err) {
    console.error('Failed to record audit trail:', err.message);
  }
}

module.exports = { recordAuditTrail };
