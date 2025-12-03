const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const medicationController = require('../controllers/medication.controller');
const { validateRequest } = require('../misc/validation');
const j2s = require('joi-to-swagger');

const {
  createMedicationDto,
  updateMedicationDto,
  deleteMedicationDto,
  filterMedicationDto,
  getMedicationDto
} = require('../dtos/payload-medication-dto');

const router = express.Router();

// Swagger schemas from DTO
const { swagger: createMedicationSchema } = j2s(createMedicationDto);
const { swagger: updateMedicationSchema } = j2s(updateMedicationDto);
const { swagger: filterMedicationSchema } = j2s(filterMedicationDto);

/**
 * @swagger
 * tags:
 *   - name: Medication
 *     description: Medication management operations
 */

/**
 * @swagger
 * /medication/create:
 *   post:
 *     tags: [Medication]
 *     summary: Create a new medication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Paracetamol"
 *               categoryOid:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               description:
 *                 type: string
 *                 example: "Pain reliever and fever reducer"
 *     responses:
 *       200:
 *         description: Medication created successfully
 */
router.post('/create', validateRequest(createMedicationDto), roleGuard('Admin'), medicationController.create);

/**
 * @swagger
 * /medication/{oid}:
 *   put:
 *     tags: [Medication]
 *     summary: Update an existing medication
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Ibuprofen"
 *               categoryOid:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440001"
 *               description:
 *                 type: string
 *                 example: "Anti-inflammatory medication"
 *     responses:
 *       200:
 *         description: Medication updated successfully
 */
router.put('/:oid', validateRequest(updateMedicationDto), roleGuard('Admin'), medicationController.update);

/**
 * @swagger
 * /medication/delete/{oid}:
 *   delete:
 *     tags: [Medication]
 *     summary: Delete a medication
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Medication deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteMedicationDto), roleGuard('Admin'), medicationController.remove);

/**
 * @swagger
 * /medication:
 *   get:
 *     tags: [Medication]
 *     summary: Get all medications
 *     responses:
 *       200:
 *         description: List of medications
 */
router.get('/', validateRequest(filterMedicationDto), roleGuard('Admin'), medicationController.findAll);

/**
 * @swagger
 * /medication/q:
 *   post:
 *     tags: [Medication]
 *     summary: Paginate medications
 *     parameters:
 *       - name: pageIndex
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: pageSize
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Paracetamol"
 *     responses:
 *       200:
 *         description: Paginated list of medications
 */
router.post('/q', validateRequest(filterMedicationDto), roleGuard('Admin'), medicationController.find);

/**
 * @swagger
 * /medication/{oid}:
 *   get:
 *     tags: [Medication]
 *     summary: Get a single medication by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A medication entry
 */
router.get('/:oid', validateRequest(getMedicationDto), roleGuard('Admin'), medicationController.findById);

module.exports = router;
