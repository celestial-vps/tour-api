const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const treatmentController = require('../controllers/treatment.controller');
const { validateRequest } = require('../misc/validation');
const {
  createTreatmentDto,
  updateTreatmentDto,
  deleteTreatmentDto,
  filterTreatmentDto,
  getTreatmentDto
} = require('../dtos/payload-treatment-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Treatments
 *     description: Treatment management operations
 */

/**
 * @swagger
 * /treatments/create:
 *   post:
 *     tags: [Treatments]
 *     summary: Create a new treatment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTreatment'
 *     responses:
 *       200:
 *         description: Treatment created successfully
 */
router.post('/create', validateRequest(createTreatmentDto), roleGuard('Admin'), treatmentController.create);

/**
 * @swagger
 * /treatments/{oid}:
 *   put:
 *     tags: [Treatments]
 *     summary: Update an existing treatment
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
 *             $ref: '#/components/schemas/UpdateTreatment'
 *     responses:
 *       200:
 *         description: Treatment updated successfully
 */
router.put('/:oid', validateRequest(updateTreatmentDto), roleGuard('Admin'), treatmentController.update);

/**
 * @swagger
 * /treatments/delete/{oid}:
 *   delete:
 *     tags: [Treatments]
 *     summary: Delete a treatment
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Treatment deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteTreatmentDto), roleGuard('Admin'), treatmentController.remove);

/**
 * @swagger
 * /treatments:
 *   get:
 *     tags: [Treatments]
 *     summary: Get all treatments
 *     responses:
 *       200:
 *         description: List of treatments
 */
router.get('/', validateRequest(filterTreatmentDto), roleGuard('Admin'), treatmentController.findAll);

/**
 * @swagger
 * /treatments/q:
 *   post:
 *     tags: [Treatments]
 *     summary: Paginate treatments
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
 *             $ref: '#/components/schemas/FilterTreatment'
 *     responses:
 *       200:
 *         description: Paginated list of treatments
 */
router.post('/q', validateRequest(filterTreatmentDto), roleGuard('Admin'), treatmentController.find);

/**
 * @swagger
 * /treatments/{oid}:
 *   get:
 *     tags: [Treatments]
 *     summary: Get a single treatment by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A single treatment entry
 */
router.get('/:oid', validateRequest(getTreatmentDto), roleGuard('Admin'), treatmentController.findById);

module.exports = router;
