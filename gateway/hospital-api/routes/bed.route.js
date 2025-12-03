const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const bedController = require('../controllers/bed.controller');
const { validateRequest } = require('../misc/validation');
const j2s = require('joi-to-swagger');

const {
  createBedDto,
  updateBedDto,
  deleteBedDto,
  filterBedDto,
  getBedDto
} = require('../dtos/payload-bed-dto');

const router = express.Router();

// Swagger schemas
const { swagger: createBedSchema } = j2s(createBedDto);
const { swagger: updateBedSchema } = j2s(updateBedDto);
const { swagger: filterBedSchema } = j2s(filterBedDto);

/**
 * @swagger
 * tags:
 *   - name: Bed
 *     description: Bed management operations
 */

/**
 * @swagger
 * /bed/create:
 *   post:
 *     tags: [Bed]
 *     summary: Create a new bed entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomOid:
 *                 type: string
 *                 example: "uuid-room-123"
 *               bedNumber:
 *                 type: string
 *                 example: "B01"
 *               status:
 *                 type: string
 *                 enum: ["Available", "Occupied", "Maintenance"]
 *                 example: "Available"
 *     responses:
 *       200:
 *         description: Bed created successfully
 */
router.post('/create', validateRequest(createBedDto), roleGuard('Admin'), bedController.create);

/**
 * @swagger
 * /bed/{oid}:
 *   put:
 *     tags: [Bed]
 *     summary: Update an existing bed entry
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
 *               roomOid:
 *                 type: string
 *                 example: "uuid-room-123"
 *               bedNumber:
 *                 type: string
 *                 example: "B02"
 *               status:
 *                 type: string
 *                 enum: ["Available", "Occupied", "Maintenance"]
 *                 example: "Occupied"
 *     responses:
 *       200:
 *         description: Bed updated successfully
 */
router.put('/:oid', validateRequest(updateBedDto), roleGuard('Admin'), bedController.update);

/**
 * @swagger
 * /bed/delete/{oid}:
 *   delete:
 *     tags: [Bed]
 *     summary: Delete a bed entry
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Bed deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteBedDto), roleGuard('Admin'), bedController.remove);

/**
 * @swagger
 * /bed:
 *   get:
 *     tags: [Bed]
 *     summary: Get all beds
 *     responses:
 *       200:
 *         description: List of beds
 */
router.get('/', validateRequest(filterBedDto), roleGuard('Admin'), bedController.findAll);

/**
 * @swagger
 * /bed/q:
 *   post:
 *     tags: [Bed]
 *     summary: Paginate beds
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
 *               roomOid:
 *                 type: string
 *                 example: "uuid-room-123"
 *               bedNumber:
 *                 type: string
 *                 example: "B01"
 *               status:
 *                 type: string
 *                 enum: ["Available", "Occupied", "Maintenance"]
 *                 example: "Available"
 *     responses:
 *       200:
 *         description: Paginated list of beds
 */
router.post('/q', validateRequest(filterBedDto), roleGuard('Admin'), bedController.find);

/**
 * @swagger
 * /bed/{oid}:
 *   get:
 *     tags: [Bed]
 *     summary: Get a single bed by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A bed entry
 */
router.get('/:oid', validateRequest(getBedDto), roleGuard('Admin'), bedController.findById);

module.exports = router;
