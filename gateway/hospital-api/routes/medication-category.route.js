const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const medicationCategoryController = require('../controllers/medication-category.controller');
const { validateRequest } = require('../misc/validation');
const j2s = require('joi-to-swagger');

const {
  createCategoryDto,
  updateCategoryDto,
  deleteCategoryDto,
  filterCategoryDto,
  getCategoryDto
} = require('../dtos/payload-medication-category-dto');

const router = express.Router();

// Swagger schemas from DTO
const { swagger: createMedicationCategorySchema } = j2s(createCategoryDto);
const { swagger: updateMedicationCategorySchema } = j2s(updateCategoryDto);
const { swagger: filterMedicationCategorySchema } = j2s(filterCategoryDto);

/**
 * @swagger
 * tags:
 *   - name: MedicationCategory
 *     description: Medication category management operations
 */

/**
 * @swagger
 * /medication-category/create:
 *   post:
 *     tags: [MedicationCategory]
 *     summary: Create a new medication category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Antibiotics"
 *               description:
 *                 type: string
 *                 example: "Drugs used to treat bacterial infections"
 *     responses:
 *       200:
 *         description: Medication category created successfully
 */
router.post('/create', validateRequest(createCategoryDto), roleGuard('Admin'), medicationCategoryController.create);

/**
 * @swagger
 * /medication-category/{oid}:
 *   put:
 *     tags: [MedicationCategory]
 *     summary: Update an existing medication category
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
 *                 example: "Updated Category"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *     responses:
 *       200:
 *         description: Medication category updated successfully
 */
router.put('/:oid', validateRequest(updateCategoryDto), roleGuard('Admin'), medicationCategoryController.update);

/**
 * @swagger
 * /medication-category/delete/{oid}:
 *   delete:
 *     tags: [MedicationCategory]
 *     summary: Delete a medication category
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Medication category deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteCategoryDto), roleGuard('Admin'), medicationCategoryController.remove);

/**
 * @swagger
 * /medication-category:
 *   get:
 *     tags: [MedicationCategory]
 *     summary: Get all medication categories
 *     responses:
 *       200:
 *         description: List of medication categories
 */
router.get('/', validateRequest(filterCategoryDto), roleGuard('Admin'), medicationCategoryController.findAll);

/**
 * @swagger
 * /medication-category/q:
 *   post:
 *     tags: [MedicationCategory]
 *     summary: Paginate medication categories
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
 *                 example: "Antibiotics"
 *     responses:
 *       200:
 *         description: Paginated list of medication categories
 */
router.post('/q', validateRequest(filterCategoryDto), roleGuard('Admin'), medicationCategoryController.find);

/**
 * @swagger
 * /medication-category/{oid}:
 *   get:
 *     tags: [MedicationCategory]
 *     summary: Get a single medication category by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A medication category entry
 */
router.get('/:oid', validateRequest(getCategoryDto), roleGuard('Admin'), medicationCategoryController.findById);

module.exports = router;
