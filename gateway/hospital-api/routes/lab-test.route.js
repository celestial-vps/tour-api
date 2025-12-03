const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const labTestController = require('../controllers/lab-test.controller');
const { validateRequest } = require('../misc/validation');
const j2s = require('joi-to-swagger');

const {
  createLabTestDto,
  updateLabTestDto,
  deleteLabTestDto,
  filterLabTestDto,
  getLabTestDto
} = require('../dtos/payload-lab-test-dto');

const router = express.Router();

// Swagger schemas from DTO
const { swagger: createLabTestSchema } = j2s(createLabTestDto);
const { swagger: updateLabTestSchema } = j2s(updateLabTestDto);
const { swagger: filterLabTestSchema } = j2s(filterLabTestDto);

/**
 * @swagger
 * tags:
 *   - name: LabTest
 *     description: Lab test management operations
 */

/**
 * @swagger
 * /lab-test/create:
 *   post:
 *     tags: [LabTest]
 *     summary: Create a new lab test entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Complete Blood Count"
 *               description:
 *                 type: string
 *                 example: "A complete blood count test to measure RBC, WBC, and platelets"
 *               cost:
 *                 type: number
 *                 example: 150000
 *     responses:
 *       200:
 *         description: Lab test created successfully
 */
router.post('/create', validateRequest(createLabTestDto), roleGuard('Admin'), labTestController.create);

/**
 * @swagger
 * /lab-test/{oid}:
 *   put:
 *     tags: [LabTest]
 *     summary: Update an existing lab test
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
 *                 example: "Complete Blood Count"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               cost:
 *                 type: number
 *                 example: 155000
 *     responses:
 *       200:
 *         description: Lab test updated successfully
 */
router.put('/:oid', validateRequest(updateLabTestDto), roleGuard('Admin'), labTestController.update);

/**
 * @swagger
 * /lab-test/delete/{oid}:
 *   delete:
 *     tags: [LabTest]
 *     summary: Delete a lab test entry
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lab test deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteLabTestDto), roleGuard('Admin'), labTestController.remove);

/**
 * @swagger
 * /lab-test:
 *   get:
 *     tags: [LabTest]
 *     summary: Get all lab tests
 *     responses:
 *       200:
 *         description: List of lab tests
 */
router.get('/', validateRequest(filterLabTestDto), roleGuard('Admin'), labTestController.findAll);

/**
 * @swagger
 * /lab-test/q:
 *   post:
 *     tags: [LabTest]
 *     summary: Paginate lab tests
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
 *                 example: "Blood"
 *     responses:
 *       200:
 *         description: Paginated list of lab tests
 */
router.post('/q', validateRequest(filterLabTestDto), roleGuard('Admin'), labTestController.find);

/**
 * @swagger
 * /lab-test/{oid}:
 *   get:
 *     tags: [LabTest]
 *     summary: Get a single lab test by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A lab test entry
 */
router.get('/:oid', validateRequest(getLabTestDto), roleGuard('Admin'), labTestController.findById);

module.exports = router;
