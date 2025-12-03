const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const medicalRecordController = require('../controllers/patient-medical-record.controller');
const { validateRequest } = require('../misc/validation');
const {
  createPatientMedicalRecordDto,
  updatePatientMedicalRecordDto,
  deletePatientMedicalRecordDto,
  filterPatientMedicalRecordDto,
  getPatientMedicalRecordDto
} = require('../dtos/payload-patient-medical-record-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: PatientMedicalRecords
 *     description: Patient Medical Record management operations
 */

/**
 * @swagger
 * /medical-records/create:
 *   post:
 *     tags: [PatientMedicalRecords]
 *     summary: Create a new patient medical record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePatientMedicalRecord'
 *     responses:
 *       200:
 *         description: Medical record created successfully
 */
router.post('/create', validateRequest(createPatientMedicalRecordDto), roleGuard('Admin'), medicalRecordController.create);

/**
 * @swagger
 * /medical-records/{oid}:
 *   put:
 *     tags: [PatientMedicalRecords]
 *     summary: Update an existing patient medical record
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePatientMedicalRecord'
 *     responses:
 *       200:
 *         description: Medical record updated successfully
 */
router.put('/:oid', validateRequest(updatePatientMedicalRecordDto), roleGuard('Admin'), medicalRecordController.update);

/**
 * @swagger
 * /medical-records/delete/{oid}:
 *   delete:
 *     tags: [PatientMedicalRecords]
 *     summary: Delete a patient medical record
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Medical record deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deletePatientMedicalRecordDto), roleGuard('Admin'), medicalRecordController.remove);

/**
 * @swagger
 * /medical-records:
 *   get:
 *     tags: [PatientMedicalRecords]
 *     summary: Get all patient medical records
 *     responses:
 *       200:
 *         description: List of patient medical records
 */
router.get('/', validateRequest(filterPatientMedicalRecordDto), roleGuard('Admin'), medicalRecordController.findAll);

/**
 * @swagger
 * /medical-records/q:
 *   post:
 *     tags: [PatientMedicalRecords]
 *     summary: Paginate patient medical records
 *     parameters:
 *       - name: pageIndex
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: pageSize
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           default: 10
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FilterPatientMedicalRecord'
 *     responses:
 *       200:
 *         description: Paginated list of patient medical records
 */
router.post('/q', validateRequest(filterPatientMedicalRecordDto), roleGuard('Admin'), medicalRecordController.find);

/**
 * @swagger
 * /medical-records/{oid}:
 *   get:
 *     tags: [PatientMedicalRecords]
 *     summary: Get a single patient medical record by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A single patient medical record entry
 */
router.get('/:oid', validateRequest(getPatientMedicalRecordDto), roleGuard('Admin'), medicalRecordController.findById);

module.exports = router;
