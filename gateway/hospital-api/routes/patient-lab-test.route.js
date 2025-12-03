const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const patientLabTestController = require('../controllers/patient-lab-test.controller');
const { validateRequest } = require('../misc/validation');
const {
  createPatientLabTestDto,
  updatePatientLabTestDto,
  deletePatientLabTestDto,
  filterPatientLabTestDto,
  getPatientLabTestDto
} = require('../dtos/payload-patient-lab-test-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: PatientLabTests
 *     description: Patient Lab Test management operations
 */

/**
 * @swagger
 * /patient-lab-tests/create:
 *   post:
 *     tags: [PatientLabTests]
 *     summary: Create a new patient lab test
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePatientLabTest'
 *     responses:
 *       200:
 *         description: Patient lab test created successfully
 */
router.post('/create', validateRequest(createPatientLabTestDto), roleGuard('Admin'), patientLabTestController.create);

/**
 * @swagger
 * /patient-lab-tests/{oid}:
 *   put:
 *     tags: [PatientLabTests]
 *     summary: Update an existing patient lab test
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
 *             $ref: '#/components/schemas/UpdatePatientLabTest'
 *     responses:
 *       200:
 *         description: Patient lab test updated successfully
 */
router.put('/:oid', validateRequest(updatePatientLabTestDto), roleGuard('Admin'), patientLabTestController.update);

/**
 * @swagger
 * /patient-lab-tests/delete/{oid}:
 *   delete:
 *     tags: [PatientLabTests]
 *     summary: Delete a patient lab test
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Patient lab test deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deletePatientLabTestDto), roleGuard('Admin'), patientLabTestController.remove);

/**
 * @swagger
 * /patient-lab-tests:
 *   get:
 *     tags: [PatientLabTests]
 *     summary: Get all patient lab tests
 *     responses:
 *       200:
 *         description: List of patient lab tests
 */
router.get('/', validateRequest(filterPatientLabTestDto), roleGuard('Admin'), patientLabTestController.findAll);

/**
 * @swagger
 * /patient-lab-tests/q:
 *   post:
 *     tags: [PatientLabTests]
 *     summary: Paginate patient lab tests
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
 *             $ref: '#/components/schemas/FilterPatientLabTest'
 *     responses:
 *       200:
 *         description: Paginated list of patient lab tests
 */
router.post('/q', validateRequest(filterPatientLabTestDto), roleGuard('Admin'), patientLabTestController.find);

/**
 * @swagger
 * /patient-lab-tests/{oid}:
 *   get:
 *     tags: [PatientLabTests]
 *     summary: Get a single patient lab test by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A single patient lab test entry
 */
router.get('/:oid', validateRequest(getPatientLabTestDto), roleGuard('Admin'), patientLabTestController.findById);

module.exports = router;
