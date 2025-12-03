const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const specializationController = require('../controllers/specialization.controller');
const { validateRequest } = require('../misc/validation');
const {
  createSpecializationDto,
  updateSpecializationDto,
  deleteSpecializationDto,
  filterSpecializationDto,
  getSpecializationDto
} = require('../dtos/payload-specialization-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Specializations
 *     description: Specialization management operations
 */

/**
 * @swagger
 * /specializations/create:
 *   post:
 *     tags: [Specializations]
 *     summary: Create a new specialization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSpecialization'
 *     responses:
 *       200:
 *         description: Specialization created successfully
 */
router.post('/create', validateRequest(createSpecializationDto), roleGuard('Admin'), specializationController.create);

/**
 * @swagger
 * /specializations/{oid}:
 *   put:
 *     tags: [Specializations]
 *     summary: Update an existing specialization
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
 *             $ref: '#/components/schemas/UpdateSpecialization'
 *     responses:
 *       200:
 *         description: Specialization updated successfully
 */
router.put('/:oid', validateRequest(updateSpecializationDto), roleGuard('Admin'), specializationController.update);

/**
 * @swagger
 * /specializations/delete/{oid}:
 *   delete:
 *     tags: [Specializations]
 *     summary: Delete a specialization
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Specialization deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteSpecializationDto), roleGuard('Admin'), specializationController.remove);

/**
 * @swagger
 * /specializations:
 *   get:
 *     tags: [Specializations]
 *     summary: Get all specializations
 *     responses:
 *       200:
 *         description: List of specializations
 */
router.get('/', validateRequest(filterSpecializationDto), roleGuard('Admin'), specializationController.findAll);

/**
 * @swagger
 * /specializations/q:
 *   post:
 *     tags: [Specializations]
 *     summary: Paginate specializations
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
 *             $ref: '#/components/schemas/FilterSpecialization'
 *     responses:
 *       200:
 *         description: Paginated list of specializations
 */
router.post('/q', validateRequest(filterSpecializationDto), roleGuard('Admin'), specializationController.find);

/**
 * @swagger
 * /specializations/{oid}:
 *   get:
 *     tags: [Specializations]
 *     summary: Get a single specialization by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A single specialization entry
 */
router.get('/:oid', validateRequest(getSpecializationDto), roleGuard('Admin'), specializationController.findById);

module.exports = router;
