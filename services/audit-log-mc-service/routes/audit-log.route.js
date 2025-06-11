const express = require('express');
const auditLogController = require('../controllers/audit-log.controller'); // Pastikan path-nya sesuai
const { validateRequest } = require('../misc/validation');
const {
  filterAuditLogDto,
  createAuditLogDto,
  updateAuditLogDto, deleteAuditLogDto,
  getAuditLogDto
} = require('../dtos/payload-audit-log-dto');

const router = express.Router();

router.post('/create', validateRequest(createAuditLogDto), auditLogController.create);

router.put('/:oid', validateRequest(updateAuditLogDto), auditLogController.update);

router.delete('/delete/:oid', validateRequest(deleteAuditLogDto), auditLogController.remove);

router.get('/', validateRequest(filterAuditLogDto), auditLogController.findAll);

router.post('/q', validateRequest(filterAuditLogDto), auditLogController.find);

router.get('/:oid', validateRequest(getAuditLogDto), auditLogController.findById);

module.exports = router;
