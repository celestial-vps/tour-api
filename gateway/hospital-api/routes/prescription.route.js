const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const prescriptionController = require('../controllers/prescription.controller');
const { validateRequest } = require('../misc/validation');
const {
  createPrescriptionDto,
  updatePrescriptionDto,
  deletePrescriptionDto,
  filterPrescriptionDto,
  getPrescriptionDto
} = require('../dtos/payload-prescription-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Prescriptions
 *     description: Prescription management operations
 */

/**
 * @swagger
 * /prescriptions/create:
 *   post:
 *     tags: [Prescriptions]
 *     summary: Create a new prescription
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePrescription'
 *     responses:
 *       200:
 *         description: Prescription created successfully
 */
router.post('/create', validateRequest(createPrescriptionDto), roleGuard('Admin'), prescriptionController.create);

/**
 * @swagger
 * /prescriptions/{oid}:
 *   put:
 *     tags: [Prescriptions]
 *     summary: Update an existing prescription
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
 *             $ref: '#/components/schemas/UpdatePrescription'
 *     responses:
 *       200:
 *         description: Prescription updated successfully
 */
router.put('/:oid', validateRequest(updatePrescriptionDto), roleGuard('Admin'), prescriptionController.update);

/**
 * @swagger
 * /prescriptions/delete/{oid}:
 *   delete:
 *     tags: [Prescriptions]
 *     summary: Delete a prescription
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Prescription deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deletePrescriptionDto), roleGuard('Admin'), prescriptionController.remove);

/**
 * @swagger
 * /prescriptions:
 *   get:
 *     tags: [Prescriptions]
 *     summary: Get all prescriptions
 *     responses:
 *       200:
 *         description: List of prescriptions
 */
router.get('/', validateRequest(filterPrescriptionDto), roleGuard('Admin'), prescriptionController.findAll);

/**
 * @swagger
 * /prescriptions/q:
 *   post:
 *     tags: [Prescriptions]
 *     summary: Paginate prescriptions
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
 *             $ref: '#/components/schemas/FilterPrescription'
 *     responses:
 *       200:
 *         description: Paginated list of prescriptions
 */
router.post('/q', validateRequest(filterPrescriptionDto), roleGuard('Admin'), prescriptionController.find);

/**
 * @swagger
 * /prescriptions/{oid}:
 *   get:
 *     tags: [Prescriptions]
 *     summary: Get a single prescription by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A single prescription entry
 */
router.get('/:oid', validateRequest(getPrescriptionDto), roleGuard('Admin'), prescriptionController.findById);

module.exports = router;
