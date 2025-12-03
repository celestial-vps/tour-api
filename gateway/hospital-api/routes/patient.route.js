const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const patientController = require('../controllers/patient.controller');
const { validateRequest } = require('../misc/validation');
const {
  createPatientDto,
  updatePatientDto,
  deletePatientDto,
  filterPatientDto,
  getPatientDto
} = require('../dtos/payload-patient-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Patients
 *     description: Patient management operations
 */

/**
 * @swagger
 * /patients/create:
 *   post:
 *     tags: [Patients]
 *     summary: Create a new patient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePatient'
 *     responses:
 *       200:
 *         description: Patient created successfully
 */
router.post('/create', validateRequest(createPatientDto), roleGuard('Admin'), patientController.create);

/**
 * @swagger
 * /patients/{oid}:
 *   put:
 *     tags: [Patients]
 *     summary: Update an existing patient
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
 *             $ref: '#/components/schemas/UpdatePatient'
 *     responses:
 *       200:
 *         description: Patient updated successfully
 */
router.put('/:oid', validateRequest(updatePatientDto), roleGuard('Admin'), patientController.update);

/**
 * @swagger
 * /patients/delete/{oid}:
 *   delete:
 *     tags: [Patients]
 *     summary: Delete a patient
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deletePatientDto), roleGuard('Admin'), patientController.remove);

/**
 * @swagger
 * /patients:
 *   get:
 *     tags: [Patients]
 *     summary: Get all patients
 *     responses:
 *       200:
 *         description: List of patients
 */
router.get('/', validateRequest(filterPatientDto), roleGuard('Admin'), patientController.findAll);

/**
 * @swagger
 * /patients/q:
 *   post:
 *     tags: [Patients]
 *     summary: Paginate patients
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
 *             $ref: '#/components/schemas/FilterPatient'
 *     responses:
 *       200:
 *         description: Paginated list of patients
 */
router.post('/q', validateRequest(filterPatientDto), roleGuard('Admin'), patientController.find);

/**
 * @swagger
 * /patients/{oid}:
 *   get:
 *     tags: [Patients]
 *     summary: Get a single patient by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A single patient entry
 */
router.get('/:oid', validateRequest(getPatientDto), roleGuard('Admin'), patientController.findById);

module.exports = router;
