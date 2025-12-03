const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const diseaseController = require('../controllers/diseases.controller');
const { validateRequest } = require('../misc/validation');
const j2s = require('joi-to-swagger');

const {
  createDiseaseDto,
  updateDiseaseDto,
  deleteDiseaseDto,
  filterDiseaseDto,
  getDiseaseDto
} = require('../dtos/payload-disease-dto');

const router = express.Router();

// Swagger schemas from DTO
const { swagger: createDiseaseSchema } = j2s(createDiseaseDto);
const { swagger: updateDiseaseSchema } = j2s(updateDiseaseDto);
const { swagger: filterDiseaseSchema } = j2s(filterDiseaseDto);

/**
 * @swagger
 * tags:
 *   - name: Disease
 *     description: Disease management operations
 */

/**
 * @swagger
 * /disease/create:
 *   post:
 *     tags: [Disease]
 *     summary: Create a new disease entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Diabetes"
 *               description:
 *                 type: string
 *                 example: "A chronic condition affecting sugar metabolism"
 *     responses:
 *       200:
 *         description: Disease created successfully
 */
router.post('/create', validateRequest(createDiseaseDto), roleGuard('Admin'), diseaseController.create);

/**
 * @swagger
 * /disease/{oid}:
 *   put:
 *     tags: [Disease]
 *     summary: Update an existing disease entry
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
 *                 example: "Hypertension"
 *               description:
 *                 type: string
 *                 example: "High blood pressure condition"
 *     responses:
 *       200:
 *         description: Disease updated successfully
 */
router.put('/:oid', validateRequest(updateDiseaseDto), roleGuard('Admin'), diseaseController.update);

/**
 * @swagger
 * /disease/delete/{oid}:
 *   delete:
 *     tags: [Disease]
 *     summary: Delete a disease entry
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Disease deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteDiseaseDto), roleGuard('Admin'), diseaseController.remove);

/**
 * @swagger
 * /disease:
 *   get:
 *     tags: [Disease]
 *     summary: Get all diseases
 *     responses:
 *       200:
 *         description: List of diseases
 */
router.get('/', validateRequest(filterDiseaseDto), roleGuard('Admin'), diseaseController.findAll);

/**
 * @swagger
 * /disease/q:
 *   post:
 *     tags: [Disease]
 *     summary: Paginate diseases
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
 *                 example: "Diabetes"
 *     responses:
 *       200:
 *         description: Paginated list of diseases
 */
router.post('/q', validateRequest(filterDiseaseDto), roleGuard('Admin'), diseaseController.find);

/**
 * @swagger
 * /disease/{oid}:
 *   get:
 *     tags: [Disease]
 *     summary: Get a single disease by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A disease entry
 */
router.get('/:oid', validateRequest(getDiseaseDto), roleGuard('Admin'), diseaseController.findById);

module.exports = router;
